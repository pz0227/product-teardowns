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

_TODO (Polly): operationalization — how to measure "factually correct" and "interview-ready" at scale? Candidate proxies: % of critical fields sourced from canonical profile vs. generated (system-measurable); % of resume diffs explicitly confirmed by user; post-submission error reports per 100 applications._

## 5. Diagnosis — six failure modes

The six problems I logged are really four product failures wearing six costumes:

| # | Observed problem | Failure mode |
|---|---|---|
| 1 | Wrong school name; fabricated referral ("Yes" + invented company) | **Critical fact accuracy failure** |
| 2 | Salary reuses last-typed number; annual figure in monthly fields; ignores JD range | **Context-aware field interpretation failure** |
| 3 | AI scan on non-partnered ATS hangs long, often fills nothing | **Cross-site execution reliability failure** |
| 4 | Answers & cover letters read obviously AI-generated | **Voice + evidence grounding failure** |
| 5 | Agent silently rewrites resume; user can't explain it in interviews | **Change traceability / interview-readiness failure** |
| 6 | LinkedIn Easy Apply jobs included without the tailored resume | **Channel coverage / asset handoff failure** |

**Root cause:** every one of these is *cheap* under an "Applications Sent" north star — the application still goes out, the counter still increments. Under TQA, every one of them subtracts. The metric explains the pattern.

_TODO (Polly): steelman the builder — why would a rational growth-stage team ship this? (Speed is demo-visible, verification is invisible; apps-sent is the value users feel on day one; competitors race on volume.) Then: where exactly is the tradeoff wrong?_

## 6. Recommendations (prioritized)

**P0 — Critical profile facts.** Referral, work authorization, visa, education, employment, salary: these fields are **read, never generated** — sourced from the canonical profile, user rules, or explicit confirmation. When uncertain, the agent stops and asks. "Guess something reasonable" is not permitted for identity-level facts.

**P1 — Salary intelligence.** Parse the JD's posted pay range per job. Detect annual / monthly / hourly. Let the user set rules: "if the JD range is explicit, default to the midpoint"; "never apply below $X"; "prefer a range over a single number when asked for expected salary." Never blind-reuse the last-typed figure.

**P1 — Resume diff + application memory.** Every JD-tailoring produces a diff: what changed, why, old bullet / new bullet, matching JD keyword. The exact submitted resume version is permanently attached to that application in the tracker — one click before an interview: *"this is the exact resume I submitted."*

**P2 — Grounded writing.** Stop letting the model free-write "why are you a good fit." Build a user **evidence bank** — projects, metrics, stories, leadership/teamwork examples, preferred tone. Every generated answer cites which real experiences it used. No evidence → ask the user, don't invent.

**P2 — Execution reliability.** For non-partnered ATS sites, classify before acting: full adapter / partial autofill / AI scan / unsupported. Show explicit status, expected steps, and a fallback. *"This site fills to ~60%; please confirm the rest"* beats an infinite loading state that ends with nothing.

_TODO (Week 3): RICE scoring across these five + the tradeoffs I'd accept as their PM._
