# Teardown: Jobright.ai

> Status: 🚧 Draft v1 · Started 2026-07-07
> My context: paying (Turbo) user, 350+ applications submitted through/alongside it. This teardown is based on logged daily usage, not a demo tour.

## 1. Product overview

Jobright.ai is an AI job-search copilot. Its core user is **the active job seeker who applies at volume across many sites — but still cares about application quality and personal truthfulness.** Three segments, with different stakes:

| Segment | Core need | Why they use Jobright |
|---|---|---|
| **Volume-first applicants** | Apply to more jobs, faster | New grads, laid-off workers, career changers — need to kill repetitive form-filling |
| **Quality-first applicants** | Every application must sound like *them* | PM / design / engineering professionals — cannot afford obviously-AI copy or fabricated claims |
| **Constraint-heavy applicants** | Cannot apply wrong, cannot fill wrong | People with visa, salary, location, or work-authorization constraints — one wrong field is disqualifying |

The in-product H1B-sponsor filter reveals how central the third segment is to its real user base.

## 2. Business model

Consumer side is **freemium SaaS**: the free tier delivers matching and basic tools; **Turbo** puts the high-frequency, high-value, execution-heavy capabilities behind a subscription — the full agent, tailored materials, auto-apply, connection resources. There is also an employer-side recruiting product, so the long-term shape is likely **B2C subscription + B2B recruiting (two-sided)** — but Turbo itself sells *efficiency and outcomes to job seekers*.

**Why I personally paid (the willingness-to-pay moment):** agent mode. Match scoring against my resume (93% / 80% / 72%), JD-tailored resume versions, and raw speed — the time that used to produce ~15 applications now produces 30+. Some submissions complete without me watching. New postings surface within hours. Generated answers handle the time-sink questions (why company / why fit / tell me about a time...).

**The churn thesis (why the failures below are existential, not cosmetic):** the product's entire value is *trusted delegation*. The moment a user must re-verify every school name, referral answer, salary field, free-text answer, and resume edit, **the time saved by automation is eaten by verification** — and the willingness to keep paying collapses. For a subscription business, trust bugs are revenue bugs.

## 3. Core user journey

_TODO (Polly): recommend → review → autofill → submit → (interview?). Where the journey delivers value and where it quietly hurts. Week 2._

## 4. Metrics analysis

**I would not use raw "Applications Sent" as the north star.** It is trivially gameable, and it rewards the wrong behavior — every one of these counts as a "sent application":

- an application with a fabricated referral answer
- an annual salary figure filled into a monthly-pay field
- a resume rewritten so far the user can't explain it in an interview
- a stuck AI scan the user retries (may even count as activity)
- a LinkedIn Easy Apply submission that never carried the tailored resume

Optimizing it turns the product into a **high-throughput spam engine**.

### Proposed north star: Weekly Trusted Qualified Applications (TQA)

An application counts toward TQA only if **all four** hold:

1. **Qualified** — meets the user's hard constraints: location, work authorization, visa, salary floor, role type, seniority.
2. **Factually correct** — critical fields (school, employment, referral, salary, work authorization) come from the user's canonical profile, rules, or explicit confirmation. Never model-guessed.
3. **Submission succeeded** — actually submitted; not mid-scan, stuck, or partially filled.
4. **Interview-ready** — the resume, cover letter, and free-text answers are traceable; the user can explain every change in an interview.

### Why TQA beats raw volume for every segment

| Segment | Problem with raw Applications Sent | Why TQA is better |
|---|---|---|
| Volume-first | Reflects speed but rewards junk applications | Keeps the speed, filters low-match jobs |
| Quality-first | Mass AI copy and fabricated rewrites damage personal brand | Requires authentic, explainable, traceable materials |
| Constraint-heavy | Mis-filled visa/salary/referral is catastrophic | Enforces critical-field accuracy and hard-constraint filters |

### Outcome metrics (guardrails, not the north star)

Interviews per 100 TQAs · recruiter response rate · offer rate · retention / Turbo renewal. These are the real results — but they lag by weeks and are confounded by market conditions, candidate background, and hiring cycles. They validate the north star; they can't steer weekly product decisions.

### Making TQA measurable at scale

"Trusted Qualified Applications" should be operationalized through observable system signals rather than treated as a vague quality concept.

**Qualified** — this should *not* be measured as "hard-constraint pass rate," because passing saved constraints is part of the definition itself. The key quality metrics measure failure instead, and belong to the **recommendation stage**:
- *Constraint violation rate*: % of recommended or submitted roles that violate user-saved hard constraints (work authorization, location, salary floor, seniority, job type, sponsorship).
- *Post-recommendation rejection rate*: % of recommended jobs the user dismisses because they violate a saved requirement.

**Factually grounded** — critical fields (education, employment history, referral status, work authorization, salary expectations) come from a canonical profile, saved user policy, or explicit confirmation:
- *Critical-field provenance coverage*: % of high-risk fields populated from a canonical profile, saved rule, or explicit confirmation.
- *Critical-field correction rate*: % of high-risk autofilled fields later corrected by the user.
- *Salary-context conflict rate*: % of applications where entered compensation conflicts with the job's stated range, compensation unit, or saved user rule.
- *Low-confidence escalation rate*: % of uncertain high-risk fields surfaced to the user rather than auto-submitted.

**Successfully submitted:**
- *Verified submission completion rate*: % of application flows with a confirmed submission state.
- *Unsupported-site completion rate*: completion rate for AI Scan / non-partnered ATS flows.
- *p50 / p90 time to completion*: especially for unsupported sites, where long scan time is a major failure mode.

**Interview-ready:**
- *Application-to-resume-version linkage rate*: % of submitted applications linked to the exact resume version used.
- *Material resume-diff acknowledgment rate*: % of high-impact resume edits reviewed or pre-approved by the user.
- *High-impact answer provenance rate*: % of generated behavioral answers or cover-letter claims linked to a user-provided project, metric, or evidence-bank entry.

These do not perfectly measure trust. But they make trust measurable enough to improve systematically.

## 5. Diagnosis — seven failure modes, five system gaps

The failure modes I logged are concrete and memorable on their own — but they point to five underlying system-level product gaps:

| # | Observed problem | Failure mode |
|---|---|---|
| 1 | Wrong school name; fabricated referral ("Yes" + invented company) | **Critical fact accuracy failure** |
| 2 | Salary reuses last-typed number; annual figure in monthly fields; ignores JD range | **Context-aware field interpretation failure** |
| 3 | AI scan on non-partnered ATS hangs long, often fills nothing | **Cross-site execution reliability failure** |
| 4 | Answers & cover letters read obviously AI-generated | **Voice + evidence grounding failure** |
| 5 | Agent silently rewrites resume; user can't explain it in interviews | **Change traceability / interview-readiness failure** |
| 6 | LinkedIn Easy Apply jobs included without the tailored resume | **Channel coverage / asset handoff failure** |
| 7 | Agent reports "5/5 filled — form complete, Submit Now" while the ATS flags missing required fields (email, phone, even the resume itself); "100%" shown over visibly empty fields | **Execution-state misreporting failure** |

### The five underlying system gaps

| System gap | Covers | What the product needs |
|---|---|---|
| **1 · Canonical profile & policy engine** | #1 wrong facts, #2 salary misuse | A canonical source of truth plus explicit user policies for high-risk fields |
| **2 · Cross-site execution & asset routing** | #3 AI-scan failures, #6 Easy Apply handoff | Reliable fallback states, clear execution visibility, channel-aware resume handoff |
| **3 · Evidence-grounded content generation** | #4 AIGC-sounding answers | An evidence bank, user voice controls, generation tied to real experiences |
| **4 · Resume versioning & change traceability** | #5 unexplainable rewrites | Per-application resume history, visible diffs with reasons, an interview-prep view |
| **5 · Execution-state integrity** | #7 false completion claims | Field state verified against the ATS's own validation (never self-reported); submit gates that block on verified state, not on the agent's belief |

Why gap 5 is distinct from gap 2: a hang or an unsupported site (#3) is a *visible* failure the user can take over from. A **false success claim** actively invites submitting an incomplete application — it doesn't just fail to deliver value, it weaponizes the user's trust in the status UI. Observed compound case: the agent auto-submits tailored (sometimes fabricated) resumes before the user can intervene — and the user, at 30+ applications/day, cannot reconstruct from memory which version went where. _(To verify: how much of this Jobright's existing application history actually covers — see evidence log. The critique is scoped to whatever it doesn't.)_

### Failure attribution across the agent pipeline — why "better parsing" won't save it

The intuitive diagnosis for a form-filling agent that fills things wrong is *"it can't read the page"* — bad parsing, weak OCR. That diagnosis is mostly wrong here, and the way to see it is to attribute every logged incident to a stage of the agent's pipeline:

```
① Page acquisition → ② Field understanding → ③ Value retrieval/generation → ④ Actuation → ⑤ State verification
```

(①  is DOM access for web ATS forms — OCR/CV only enters for PDF or image forms. ③ is the decision "does this value come from the user's profile, or does a model generate it?")

| Stage | What it does | Logged evidence living there |
|---|---|---|
| ① Page acquisition | Get the form's structure (DOM, dynamic JS, iframes) | AI-scan hangs; "0/13" over an empty form; "Autofill Not Supported" |
| ② Field understanding | What does this field mean? | Annual figure in monthly field; 'If "Yes", type Yes' instruction ignored |
| ③ Value retrieval / generation | Where does the value come from? | **Fabricated employer (BCG); invented degree name; invented "18%" resume metric; stale past date; blind salary reuse** |
| ④ Actuation | Actually write values, click buttons | Fields skipped while flow proceeds |
| ⑤ State verification | Confirm what was actually written/submitted | **All of failure mode #7** (false "100%", "Submit Now" over missing required fields) |

Two conclusions fall out of the attribution:

1. **Perfect parsing would not prevent the worst failures.** The highest-stakes incidents — fabricated employer, invented metrics, stale answers — live in stage ③: the system *generates* where it should *retrieve*. That is a policy decision, not a perception limitation, and it is exactly what P0 ("read, never generated") fixes. Investing in better page understanding (①–②) buys coverage of the long tail of ATS sites; it buys zero trust on the sites that already work.
2. **Stage ⑤ decides whether the user can even see stages ①–④ fail.** A parsing error under honest state reporting is an inconvenience; a parsing error under false "100% complete" claims becomes a submitted, wrong application. Gap 5 is load-bearing for the entire pipeline.

Method note: this is the same fault-attribution discipline used in LLM eval work — attribute failures to pipeline stages *before* deciding where to invest. Two questions classify almost every incident: *did the system understand the field?* and *was the value retrieved or generated?*

**Root cause:** every one of these is *cheap* under an "Applications Sent" north star — the application still goes out, the counter still increments. Under TQA, every one of them subtracts. The metric explains the pattern.

### Steelman: why "Applications Sent" can remain rational for longer than it should

I think Jobright's current focus on applications sent is understandable.

In an early growth stage, "applications sent" is immediate, visible, and easy for users to understand. It clearly communicates the Turbo value proposition: save time, reduce repetitive work, and apply to more relevant jobs. It is also easy to instrument, easy to demonstrate in a product demo, and aligned with a market where competing AI job tools are heavily competing on speed and automation.

Trust, factual accuracy, and interview readiness are less visible in the first-session experience. Adding confirmation steps for salary, referral status, resume edits, or free-text answers can introduce friction and reduce short-term completion rates. If I were on the team, I might initially make the same tradeoff.

**There is also an attribution problem.** Many trust failures do not surface at the moment of submission. A wrong salary expectation, referral answer, work-authorization response, or unfamiliar resume edit may create problems days or weeks later — during recruiter screening, interview preparation, or renewal decisions. The user may silently correct the information, blame themselves, blame the employer's application flow, or simply stop using the product later. As a result, Jobright's core dashboards may record a successful application while missing the downstream trust cost. The product can look healthy on immediate throughput metrics even when it is gradually weakening user confidence.

So the issue is not that optimizing for applications sent was irrational. The issue is that the metric becomes incomplete once Jobright is representing users in high-stakes decisions.

> Volume is primarily an acquisition logic. Trust is primarily a retention logic.

When Turbo renewal and repeat usage become the binding growth constraint, maximizing raw applications sent without improving trust becomes increasingly irrational. At that point, the product should still optimize for speed, but shift from maximizing raw applications sent to maximizing **trusted qualified applications submitted**. The goal is not to add manual review everywhere. It is to automate low-risk tasks aggressively while escalating only high-risk or low-confidence decisions.

## 6. Recommendations (prioritized)

**P0 — Critical profile facts.** Referral, work authorization, visa, education, employment, salary: these fields are **read, never generated** — sourced from the canonical profile, user rules, or explicit confirmation. When uncertain, the agent stops and asks. "Guess something reasonable" is not permitted for identity-level facts.

**P1 — Salary intelligence.** Parse the JD's posted pay range per job. Detect annual / monthly / hourly. Let the user set rules: "if the JD range is explicit, default to the midpoint"; "never apply below $X"; "prefer a range over a single number when asked for expected salary." Never blind-reuse the last-typed figure.

**P1 — Resume diff + application memory.** Every JD-tailoring produces a diff: what changed, why, old bullet / new bullet, matching JD keyword. The exact submitted resume version is permanently attached to that application in the tracker — one click before an interview: *"this is the exact resume I submitted."* **And a hard gate: no tailored resume is auto-submitted without either an explicit diff confirmation or a previously saved user approval rule** — observed today, the agent submits fabricated versions faster than the user can intervene.

**P2 — Grounded writing.** Stop letting the model free-write "why are you a good fit." Build a user **evidence bank** — projects, metrics, stories, leadership/teamwork examples, preferred tone. Every generated answer cites which real experiences it used. No evidence → ask the user, don't invent.

**P2 — Execution reliability + honest state.** For non-partnered ATS sites, classify before acting: full adapter / partial autofill / AI scan / unsupported. Show explicit status, expected steps, and a fallback. *"This site fills to ~60%; please confirm the rest"* beats an infinite loading state that ends with nothing. And completion claims must derive from the **ATS's own validation state, never the agent's belief** — a status panel that says "5/5 filled, Submit Now" while the form flags a missing resume is worse than no status panel at all.

**P3 — Expose the agent as an API / MCP server.** The trust rules above become enforceable when the product's core capabilities are exposed as typed tools rather than UI automation — an API cannot misreport state the way a status panel can:

| Tool | Contract | Which trust rule it enforces |
|---|---|---|
| `search_jobs(constraints)` | returns only roles passing the user's saved hard constraints, with match rationale | Qualified (funnel 1) |
| `draft_answer(question, jd)` | returns `{answer, sources[]}` — every claim cites a canonical-profile entry; no source, no answer | Factually grounded |
| `get_application_record(job_id)` | returns `{submitted_resume_version, answers[], submit_status, timestamp}` | Submission verified + interview-ready |

This also positions Jobright for the agent ecosystem: users' own AI assistants (Claude, etc.) could operate Jobright safely through the same contracts.

_TODO (Week 3): RICE scoring across these five + the tradeoffs I'd accept as their PM._

## 7. One-line product thesis

> Jobright's opportunity is not simply to help users apply faster. It is to become a job-search agent that users trust to represent them accurately when they are not watching.
