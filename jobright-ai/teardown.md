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

"Factually correct" and "interview-ready" cannot stay vague qualitative ideas. Each of the four conditions has observable system proxies:

1. **Qualified** — *hard-constraint pass rate*: the role passes the user's saved constraints (location, work authorization, salary floor, seniority, job type, sponsorship).
2. **Factually grounded** —
   - *Critical-field provenance coverage*: % of critical fields populated from the canonical profile or explicit user rules, vs. model-generated.
   - *Critical-field correction rate*: % of submissions where the user manually corrects a high-risk field.
   - *Salary conflict rate*: % of applications where the entered pay expectation conflicts with the JD's stated range or compensation unit.
3. **Successfully submitted** — *verified submission completion rate*: ATS confirmation or a verified success state — not "scan finished."
4. **Interview-ready** —
   - *Application-to-resume-version linkage rate*: the exact submitted resume version is permanently attached to the application.
   - *Material resume-diff acknowledgment rate*: % of material changes confirmed by the user or covered by a saved approval rule.
   - *High-impact answer provenance rate*: % of generated answers linked to specific user experiences, projects, or evidence-bank entries.

I would not claim these proxies perfectly measure trust. I would say they make trust operational enough to improve systematically.

## 5. Diagnosis — six failure modes, four system gaps

The six failure modes I logged are concrete and memorable on their own — but they point to four underlying system-level product gaps:

| # | Observed problem | Failure mode |
|---|---|---|
| 1 | Wrong school name; fabricated referral ("Yes" + invented company) | **Critical fact accuracy failure** |
| 2 | Salary reuses last-typed number; annual figure in monthly fields; ignores JD range | **Context-aware field interpretation failure** |
| 3 | AI scan on non-partnered ATS hangs long, often fills nothing | **Cross-site execution reliability failure** |
| 4 | Answers & cover letters read obviously AI-generated | **Voice + evidence grounding failure** |
| 5 | Agent silently rewrites resume; user can't explain it in interviews | **Change traceability / interview-readiness failure** |
| 6 | LinkedIn Easy Apply jobs included without the tailored resume | **Channel coverage / asset handoff failure** |

### The four underlying system gaps

| System gap | Covers | What the product needs |
|---|---|---|
| **1 · Canonical profile & policy engine** | #1 wrong facts, #2 salary misuse | A canonical source of truth plus explicit user policies for high-risk fields |
| **2 · Cross-site execution & asset routing** | #3 AI-scan failures, #6 Easy Apply handoff | Reliable fallback states, clear execution visibility, channel-aware resume handoff |
| **3 · Evidence-grounded content generation** | #4 AIGC-sounding answers | An evidence bank, user voice controls, generation tied to real experiences |
| **4 · Resume versioning & change traceability** | #5 unexplainable rewrites | Per-application resume history, visible diffs with reasons, an interview-prep view |

**Root cause:** every one of these is *cheap* under an "Applications Sent" north star — the application still goes out, the counter still increments. Under TQA, every one of them subtracts. The metric explains the pattern.

### Steelman: why a rational team ships this

I think Jobright's current tradeoff is understandable. If I were on the team at an early growth stage, I might also prioritize application volume first. "Applications sent" is immediate, visible, easy for users to understand, and directly tied to the Turbo promise of saving time. It is easy to instrument, easy to demonstrate in a demo, and aligned with a market where competitors compete on speed and automation. By contrast, trust, factual accuracy, and interview readiness are nearly invisible in the first-session experience — and adding confirmation steps for salary, referral status, resume edits, or free-text answers creates friction and hurts completion rates. From a growth perspective, optimizing for throughput first is a rational choice.

**The mistake is not choosing "Applications Sent" as an early metric. The mistake is allowing it to remain the dominant optimization target once the product starts making high-stakes decisions on behalf of users.** Once Jobright fills in work authorization, referral status, salary expectations, education history, resume claims, or behavioral answers, the cost of an error is no longer linear: a single incorrect answer can create reputational risk, cost the user a role, or leave them unable to defend their submitted materials in an interview.

So I would frame the product shift as: **keep optimizing for application speed, but move from maximizing raw applications sent to maximizing trusted qualified applications submitted.** The goal is not to add manual review everywhere. The goal is to automate low-risk tasks aggressively while escalating only high-risk or low-confidence decisions.

## 6. Recommendations (prioritized)

**P0 — Critical profile facts.** Referral, work authorization, visa, education, employment, salary: these fields are **read, never generated** — sourced from the canonical profile, user rules, or explicit confirmation. When uncertain, the agent stops and asks. "Guess something reasonable" is not permitted for identity-level facts.

**P1 — Salary intelligence.** Parse the JD's posted pay range per job. Detect annual / monthly / hourly. Let the user set rules: "if the JD range is explicit, default to the midpoint"; "never apply below $X"; "prefer a range over a single number when asked for expected salary." Never blind-reuse the last-typed figure.

**P1 — Resume diff + application memory.** Every JD-tailoring produces a diff: what changed, why, old bullet / new bullet, matching JD keyword. The exact submitted resume version is permanently attached to that application in the tracker — one click before an interview: *"this is the exact resume I submitted."*

**P2 — Grounded writing.** Stop letting the model free-write "why are you a good fit." Build a user **evidence bank** — projects, metrics, stories, leadership/teamwork examples, preferred tone. Every generated answer cites which real experiences it used. No evidence → ask the user, don't invent.

**P2 — Execution reliability.** For non-partnered ATS sites, classify before acting: full adapter / partial autofill / AI scan / unsupported. Show explicit status, expected steps, and a fallback. *"This site fills to ~60%; please confirm the rest"* beats an infinite loading state that ends with nothing.

_TODO (Week 3): RICE scoring across these five + the tradeoffs I'd accept as their PM._

## 7. One-line product thesis

> Jobright's opportunity is not simply to help users apply faster. It is to become a job-search agent that users trust to represent them accurately when they are not watching.
