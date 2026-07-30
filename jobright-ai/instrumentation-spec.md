# Instrumentation Spec: Making TQA Measurable

A metric nobody can log is a slogan. This is the event schema that would turn [Trusted Qualified Applications](./teardown.md#4-metrics-analysis) from a definition into a number an engineer could ship and an analyst could query. Written engineering-facing on purpose: this is what I would hand to a data engineer, not a restatement of the metric for a reader.

Scope note: an external proposal. Names and shapes follow common product-analytics conventions; a real implementation would conform to the team's existing taxonomy.

## Design rules

1. **Provenance is a property, not a derived field.** Every value the agent writes carries where it came from at write time. Reconstructing provenance later is impossible, which is how these failures stay invisible today.
2. **Never log the field's value.** Log its type, its risk class, and its provenance. The instrumentation for a trust problem must not itself become a privacy problem.
3. **Self-reported completion is a separate event from verified completion.** They are different claims by different parties, and collapsing them is the bug ([failure mode #7](./teardown.md#5-diagnosis-seven-failure-modes-five-system-gaps)).
4. **Every event carries `application_id`,** so an application can be reconstructed end to end and scored against the four TQA conditions.

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
  ats_type              string      // greenhouse | workday | lever | unsupported | ...
  method                enum(partnered_adapter|ai_scan|easy_apply|assisted_manual)
  agent_reported_complete   bool    // what the status panel claimed
  required_fields_agent_count   int
  gate_blocked          bool
  gate_block_reasons    array<string>

submission_verified
  application_id        string
  verification_source   enum(ats_confirmation|redirect_state|email_receipt|none_available)
  verified              bool
  ats_reported_missing_fields   array<string>   // field types only, never values
  latency_from_attempt_ms       int
```

The single most valuable query in this whole spec:

```sql
-- How often does the agent claim success the site does not confirm?
select count(*) filter (where a.agent_reported_complete and not v.verified)::float
     / count(*) filter (where a.agent_reported_complete) as false_success_rate
from submission_attempted a
left join submission_verified v using (application_id);
```

That is failure mode #7, expressed as a number. Nobody can act on "the status panel sometimes lies." Everybody can act on a false-success rate with a trend line.

### `constraint_violation_detected`
Fires when a recommended or opened role conflicts with a saved hard constraint.

```
constraint_violation_detected
  application_id        string      // null if surfaced in the feed, never opened
  constraint_type       enum(work_auth|salary_floor|location|seniority|employment_type)
  detected_at           enum(recommendation|open|prefill|submission)
  user_dismissed        bool
```

Feeds the recommendation-quality funnel, which the [audit method](./audit-method.md) keeps deliberately separate from execution quality.

## Deriving TQA

With the events above, the north star is a query rather than a philosophy. An application counts when all four hold:

| TQA condition | Derivation |
|---|---|
| Qualified | No `constraint_violation_detected` for the application |
| Factually grounded | No `critical_field_resolved` with `provenance_type = model_generated` in class `identity` or `compensation` |
| Submission verified | `submission_verified.verified = true` |
| Interview-ready | No `resume_change_reviewed` with `user_action = auto_applied_no_review` where `is_material = true` |

## What I would ship first

`critical_field_resolved` and the `submission_attempted` / `submission_verified` pair, in that order. Those three alone produce the baseline prevalence number that the [90-day plan](./teardown.md#9-if-i-were-their-pm-the-first-90-days) treats as its Day-30 decision gate, and the false-success rate that justifies execution honesty regardless of what the prevalence turns out to be.
