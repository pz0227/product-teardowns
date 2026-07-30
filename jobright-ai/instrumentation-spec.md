# Instrumentation Spec: Making TQA Measurable

A metric nobody can log is a slogan. This is the event schema that would turn [Trusted Qualified Applications](./teardown.md#4-metrics-analysis) from a definition into a number an engineer could ship and an analyst could query. Written engineering-facing on purpose: this is what I would hand to a data engineer, not a restatement of the metric for a reader.

Scope note: an external proposal. Names and shapes follow common product-analytics conventions; a real implementation would conform to the team's existing taxonomy.

## Design rules

1. **Provenance is a property, not a derived field.** Every value the agent writes carries where it came from at write time. Reconstructing provenance later is impossible, which is how these failures stay invisible today.
2. **Never log the field's value.** Log its type, its risk class, and its provenance. The instrumentation for a trust problem must not itself become a privacy problem.
3. **Self-reported completion is a separate event from verified completion.** They are different claims by different parties, and collapsing them is the bug ([failure mode #7](./teardown.md#5-diagnosis-seven-failure-modes-five-system-gaps)).
4. **Every event carries `application_id`,** so an application can be reconstructed end to end and scored against the four TQA conditions. Submission events additionally carry `submission_attempt_id`, because one application can be submitted several times and a later retry must not overwrite what happened on an earlier one.

## Field risk classes

Referenced by every event below. The class decides the policy, so it belongs in the data model rather than in a doc.

| Class | Fields | Policy |
|---|---|---|
| `identity` | employer, education, work authorization, referral, legal name | Read, never generated. Pause when unavailable |
| `compensation` | salary expectation, current compensation | Policy-derived or confirmed. Unit must be parsed from the posting |
| `logistics` | start date, location preference, relocation | Generated allowed with review |
| `narrative` | why-this-company, behavioral answers, resume bullets | Generated allowed; provenance recorded; material changes reviewed |

## Events

### `critical_field_resolved`
Fires whenever the agent settles a value for any field in `identity` or `compensation`.

```
critical_field_resolved
  application_id        string
  field_type            enum(employer|education|work_auth|referral|salary|name|...)
  field_risk_class      enum(identity|compensation|logistics|narrative)
  provenance_type       enum(profile|evidence|policy|user_asserted|model_generated|none)
  initial_confidence    float 0..1
  resolution_method     enum(auto_from_profile|auto_from_policy|paused_user_confirmed|
                             paused_user_typed|model_generated_no_pause)
  paused                bool
  resolution_time_ms    int         // null when not paused
  user_changed_value    bool        // did the user override what was proposed
```

Feeds: critical-field provenance coverage, pause rate, pause resolution time, and the correction rate that is the primary metric of the [staged experiment](./validation-plan.md).

### `resume_change_reviewed`
Fires per material diff presented to the user.

```
resume_change_reviewed
  application_id        string
  change_id             string
  section               enum(experience|skills|summary|education|other)
  provenance_type       enum(evidence|user_asserted|model_generated)
  is_material           bool        // did it change a claim, not just phrasing
  user_action           enum(approved|edited|rejected|auto_applied_no_review)
  acknowledged_ungrounded  bool     // explicit acknowledgment shown and accepted
  review_time_ms        int
```

`auto_applied_no_review` is the value that matters most: it counts the changes that shipped under the user's name without ever being seen. That number should be zero, and today it is not.

### `submission_attempted` and `submission_verified`
Two events, on purpose. One is the agent's claim; the other is the site's.

```
submission_attempted
  application_id        string
  submission_attempt_id string      // unique per attempt, NOT per application
  attempted_at          timestamp
  ats_type              string      // greenhouse | workday | lever | unsupported | ...
  method                enum(partnered_adapter|ai_scan|easy_apply|assisted_manual)
  agent_reported_complete   bool    // what the status panel claimed
  required_fields_agent_count   int
  required_critical_fields  array<string>  // identity/compensation fields this form
                                           // requires; see inventory trust below
  required_field_inventory_source  enum(ats_schema|partner_adapter_contract|
                                        ats_validation|dom_inventory|
                                        agent_parser|manual_review|unknown)
  required_field_inventory_status  enum(verified|partially_verified|unverified)
  material_changes_count    int            // material resume changes the agent made
                                           // for this application, so review coverage
                                           // can be checked against a declared total
  gate_blocked          bool
  gate_block_reasons    array<string>

submission_verified
  application_id        string
  submission_attempt_id string      // which attempt this verifies
  verified_at           timestamp
  verification_source   enum(ats_confirmation|redirect_state|email_receipt)
  verified              bool
  ats_reported_missing_fields   array<string>   // field types only, never values
```

`verification_source` has no `none_available` value. "No signal arrived" is the **absence** of this event, not a variant of it. Encoding absence as a row would let a missing verification masquerade as a verification.

#### Why the attempt id has to exist

A single application can be submitted more than once: the agent claims completion, the site rejects it or reports missing fields, the user fixes something, and a second submission succeeds. Keyed only by `application_id`, the "latest verification wins" rule then reports that application as a success, and the agent's original false claim disappears from the data entirely.

That is the wrong answer to the wrong question. **Application-level success and attempt-level reliability are different measurements.** The user eventually got the application in, which is what they care about. The agent still claimed a completion that was not true, which is what failure mode #7 is about, and a metric that lets a later retry absolve an earlier lie cannot detect the behavior it exists to detect.

So: every submission the agent initiates gets a new `submission_attempt_id`. User retries, post-correction resubmissions, and repeated agent clicks are all separate attempts. Verification binds to the attempt, never to the application. Duplicate verification events **within one attempt** are deduplicated to the final authoritative state; verdicts **across attempts** never overwrite each other.

#### Three metrics, not one

The tempting single metric ("false success rate") hides a distinction that matters operationally. There are two different bad outcomes after the agent claims completion:

All three are rates over **attempts**, not applications.

| Metric | Definition | What it means |
|---|---|---|
| **Verified failure rate** | Agent claimed complete on this attempt, a verification event arrived within the window, and it said `verified = false` | The site actively contradicted the agent. This is a confirmed lie by the status panel |
| **Missing verification rate** | Agent claimed complete on this attempt, no verification event arrived within the window | Nobody knows. Could be a successful submission on a site we cannot read, or a silent failure |
| **Unconfirmed success rate** | The sum of the two | Operational risk: attempts the user believes are submitted and we cannot confirm. **Not** proof that all of them failed |

Keeping them apart matters because the fixes differ: verified failures are a correctness bug in the agent, while missing verifications are a coverage gap in the verification integration. Reporting only the combined number would let a team "improve" the metric by adding verification coverage without fixing a single incorrect claim.

**The verification window must be configured per method,** because the sources differ in latency. A partnered adapter confirms within seconds; an email receipt may take minutes. The values below are placeholders for a real calibration, and the choice is consequential: too short a window inflates the missing rate with confirmations that simply had not arrived yet.

```sql
-- Dialect: PostgreSQL. Tested against SQLite 3.45 with equivalent fixtures;
-- see the test cases listed after the query.
with window_config(method, window_ms) as (
  values ('partnered_adapter',  60000),
         ('easy_apply',         60000),
         ('ai_scan',           300000),
         ('assisted_manual', 86400000)
),
attempts as (
  -- The denominator is attempts, not applications and not joined event rows.
  select a.application_id, a.submission_attempt_id, a.attempted_at, w.window_ms
  from submission_attempted a
  join window_config w on w.method = a.method
  where a.agent_reported_complete
    -- Exclude attempts whose window has not elapsed yet, otherwise "missing"
    -- just means "recent" and the metric drifts with query time.
    and a.attempted_at <= :as_of - make_interval(secs => w.window_ms / 1000.0)
),
ranked as (
  -- One verdict per ATTEMPT. Duplicate or delayed verifications inside a
  -- single attempt collapse to the final authoritative state; verdicts from
  -- different attempts on the same application never touch each other.
  select v.submission_attempt_id, v.verified,
         row_number() over (partition by v.submission_attempt_id
                            order by v.verified_at desc) as rn
  from submission_verified v
  join attempts a on a.submission_attempt_id = v.submission_attempt_id
  where v.verified_at <= a.attempted_at + make_interval(secs => a.window_ms / 1000.0)
),
verdict as (select submission_attempt_id, verified from ranked where rn = 1)
select
  count(*) as attempts_claimed_complete,
  1.0 * count(*) filter (where d.verified = false)
      / nullif(count(*), 0) as verified_failure_rate,
  1.0 * count(*) filter (where d.submission_attempt_id is null)
      / nullif(count(*), 0) as missing_verification_rate,
  1.0 * count(*) filter (where d.verified = false or d.submission_attempt_id is null)
      / nullif(count(*), 0) as unconfirmed_success_rate
from attempts a
left join verdict d on d.submission_attempt_id = a.submission_attempt_id;
```

**Why the NULL handling is written this way.** The obvious version of this query (`left join ... where not v.verified`) is wrong, and wrong in the direction that hides the worst case. When no verification event exists, `v.verified` is `NULL`, and `NOT NULL` evaluates to `NULL` rather than `TRUE`, so the application is silently excluded. That drops exactly the population this metric exists to find: the agent claimed success and nothing ever confirmed it. Missing verification is therefore detected by `d.submission_attempt_id is null` (a fact about the join) rather than by negating a nullable boolean. `nullif(count(*), 0)` returns `NULL` instead of raising when no attempts qualify, and deduplicating to one verdict per attempt keeps repeated verification events from fanning out the denominator.

**Test cases this query must handle**, verified against fixtures before publishing: verified success (excluded from both numerators); verified failure (counted once); no verification event at all (counted as missing, the case the naive query loses); agent never claimed completion (excluded from the denominator entirely); duplicate verifications inside one attempt where an early failure is superseded by a later success (latest verdict wins, counted once); **two attempts on the same application where the first is a verified failure and the second succeeds** (both counted, the first failure preserved); a verification arriving after the window (counted as missing, by design); an attempt too recent for its window to have elapsed (excluded); multiple attempts not inflating the denominator beyond one row each; and an empty input (returns `NULL` rates rather than dividing by zero).

On the fixtures, grouping by `application_id` instead of `submission_attempt_id` reported one failure where there were two, because the retry's success overwrote the original false claim. That single grouping choice halved the measured failure rate.

### `constraint_evaluation_completed`
Fires once per application when the constraint check runs. This event exists because **the absence of a violation is not evidence of qualification.** No violation event could equally mean every constraint passed, the check never ran, only some constraints were evaluated, the application came through an unsupported path, or the instrumentation itself failed. Those are very different states, and a metric that treats them alike will report its own blind spots as success.

```
constraint_evaluation_completed
  application_id        string
  evaluated_at          timestamp
  evaluation_source     enum(recommendation_engine|prefill_check|submission_gate)
  constraints_required  array<string>   // the user's saved hard constraints
  constraints_checked   array<string>   // subset actually evaluated
  constraints_passed    array<string>
  constraints_unresolved array<string>  // could not be determined from the posting
  coverage              float 0..1      // |checked| / |required|
  result                enum(pass|fail|partial|not_evaluated)
```

`partial` and `not_evaluated` are first-class results, not error states. A posting that does not state its sponsorship policy leaves work authorization genuinely unresolved, and the honest record of that is `partial` with the field named in `constraints_unresolved`, not a silent pass.

### `constraint_violation_detected`
Retained for diagnostics: it answers *which* constraint fails and *where* in the funnel, which is what the recommendation-quality analysis in the [audit method](./audit-method.md) needs. It is no longer used, in either direction, to establish qualification.

```
constraint_violation_detected
  application_id        string      // null if surfaced in the feed, never opened
  constraint_type       enum(work_auth|salary_floor|location|seniority|employment_type)
  detected_at           enum(recommendation|open|prefill|submission)
  user_dismissed        bool
```

### Critical-field provenance coverage

Groundedness has the same absence problem. "No field was model-generated" is satisfied by an application where the fields were never resolved, never instrumented, or resolved to `none`. Coverage has to be measured positively:

```
critical_field_provenance_coverage
  = |required critical fields with a resolution event AND a permitted provenance|
  / |required critical fields|          -- from submission_attempted.required_critical_fields
```

**The denominator is itself a claim, and it needs a source.** If the form requires four identity fields and the parser only recognized three, an agent that resolves all three reports 100% coverage while a required field sits empty. That is the same shape as the failure this whole teardown is about: the agent deciding what "complete" means and then grading itself against its own list. A coverage number is only as trustworthy as the inventory underneath it, so the inventory carries its provenance too.

| `required_field_inventory_source` | Trust | Why |
|---|---|---|
| `ats_schema` | **verified** | The form definition itself. Authoritative by construction |
| `partner_adapter_contract` | **verified** | A maintained integration contract with a known field set |
| `ats_validation` | **verified** | The site's own validation naming what it requires, before or after submit |
| `manual_review` | **verified** | A human enumerated the form. Expensive, used for sampling and calibration |
| `dom_inventory` | *partially verified* | Directional. Misses conditionally rendered and dynamically injected fields |
| `agent_parser` | **unverified** | The agent's own reading. Cannot establish its own completeness |
| `unknown` | **unverified** | Provenance not recorded |

`required_field_inventory_status` is derived from the source, and only `verified` can support a complete TQA. `agent_parser` alone never can, by design: a self-reported inventory grading a self-reported completion is circular, and the circularity is invisible in the resulting number.

**Cheap reconciliation using data we already log.** `submission_verified.ats_reported_missing_fields` is the site naming fields it required and did not receive. Any field there that is absent from `required_critical_fields` is proof that the inventory was incomplete for that attempt. That comparison costs nothing, retroactively downgrades the affected attempts, and gives an ongoing error rate for the parser itself, which is the number that would tell the team how far to trust `dom_inventory` in the first place.

Permitted provenance depends on the field's risk class. The rule follows the teardown's P0: identity facts are read, never generated.

| Risk class | Permitted provenance | Prohibited | Extra requirement |
|---|---|---|---|
| `identity` | `profile`, `evidence`, `policy` (an explicit saved answer, never an inferred default), `user_asserted` | `model_generated`, `none`, or no event at all | none |
| `compensation` | `profile`, `policy`, `user_asserted` | `model_generated`, `none`, or no event at all | `unit_validated = true` |
| `logistics` | any resolved provenance | none | none |
| `narrative` | any resolved provenance | none | material changes must be reviewed (see `resume_change_reviewed`) |

`user_asserted` means the user explicitly supplied or confirmed the value. It is permitted, and it is **not** the same as `evidence`: the user authorized the claim, but nothing independent backs it. The schema keeps the two apart precisely so that "the user approved it" can never be reported as "the data supports it." That distinction is the same one the [prototype](../prototypes/jobright-trust-layer/README.md) had to fix in its own state model.

`critical_field_resolved` therefore carries one more property for compensation fields:

```
  unit_validated        bool    // was the posting's pay unit parsed and matched
                                // (annual vs monthly vs hourly)? null for other classes
```

## Deriving TQA

With the events above, the north star is a query rather than a philosophy. An application counts when all four hold, and **every condition is satisfied by the presence of positive evidence, never by the absence of a bad event.** A metric that can pass because instrumentation failed is not measuring the product; it is measuring its own coverage.

| TQA condition | Derivation |
|---|---|
| **Qualified** | A `constraint_evaluation_completed` event exists **and** `coverage = 1.0` **and** `result = 'pass'` **and** `constraints_unresolved` is empty |
| **Factually grounded** | `required_field_inventory_status = 'verified'` **and** every field in `required_critical_fields` has a `critical_field_resolved` event whose `provenance_type` is permitted for its risk class, giving coverage `= 1.0`, **and** every `compensation` field has `unit_validated = true`. An unverified or partially verified inventory fails this condition even at 100% measured coverage, because the coverage is measured against a list that may be short |
| **Submission verified** | A `submission_verified` event exists for **this attempt** within the method's window with `verified = true`. Missing verification fails; it does not pass by default. A later successful attempt does not retroactively satisfy this condition for an earlier failed one |
| **Interview-ready** | The count of `resume_change_reviewed` events with `is_material = true` and `user_action` in (`approved`, `edited`, `rejected`) equals `material_changes_count`. Counting the reviews rather than checking for the absence of `auto_applied_no_review` is deliberate: "no bad review event" is also satisfied by an application whose changes were never logged |

Each of these can also fail for an uninteresting reason: the check never ran, the fields were never logged, the site could not be read. That is the point. An application whose qualification was never evaluated is not a Trusted Qualified Application, and the metric should say so out loud rather than let a gap in measurement read as a win.

## What I would ship first

`critical_field_resolved` and the `submission_attempted` / `submission_verified` pair, in that order. Those three alone produce the baseline prevalence number that the [90-day plan](./teardown.md#9-if-i-were-their-pm-the-first-90-days) treats as its Day-30 decision gate, plus the verified-failure and missing-verification rates that justify execution honesty regardless of what the prevalence turns out to be.

One caveat I would raise on day one rather than discover in month three: the missing-verification rate is partly a measure of our own integration coverage, so it will start high and fall as verification sources are added, for reasons that have nothing to do with product quality. Reporting it alongside the verified-failure rate, rather than blended into a single number, is what keeps that from looking like progress.
