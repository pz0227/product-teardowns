# Jobright.ai in 3 Minutes

> **Evidence maturity: developed directional case.** Sustained heavy paid usage, 20+ documented incidents in a dated log, one user. Not population-level claims; the [validation plan](./validation-plan.md) describes how I'd turn incidents into rates.

## The product and the problem

Jobright.ai is an AI job-search agent: it recommends jobs, tailors your resume per posting, autofills applications, and can complete submission on your behalf. Its paying user delegates the most consequential paperwork of their professional life to an agent that acts while they're not watching. That makes it the sharpest live case of the question this series tracks: **can you trust what an AI does on your behalf?**

## Research context

I am a paying Turbo user in an active job search: 350+ applications submitted through and alongside the product, 30+ on peak days, logged daily with dated entries and screenshots. I am a constraint-heavy user (work authorization, salary floor), which shapes which failures I feel most sharply.

## Three strongest pieces of evidence

1. **Identity facts get generated, not read** (observed, screenshots archived). The agent filled "Name of Latest Employer" with a consulting firm I never worked at, answered a referral question "Yes" with an invented company, and filled a salary expectation of **6500095000**, my saved 65000 to 95000 range concatenated into one number.
2. **The status UI misreports execution state** (observed, 6 screenshots). "11/11 required fields filled, Submit Now" while the ATS itself flagged the missing resume; "100% complete" over visibly empty required fields. A false success claim invites submitting a broken application, which is categorically worse than a visible failure.
3. **The cost surfaces where no dashboard looks** (observed). A silent resume rewrite changed my real experience into wording I'd never seen; an interviewer probed the phrase and I couldn't speak to it. Value is booked at submission; the cost settles weeks later, in the interview.

## The signature insight

**Value is front-loaded; trust cost is back-loaded, and the submit button is the trust boundary.** Before submission an error is a draft problem; after it, the error is me. Every logged failure is invisible to the metric the product appears to optimize (inference: applications sent), because the application still goes out and the counter still increments. The metric explains the failure pattern.

## Proposed north star

**Trusted Qualified Applications (TQA):** an application counts only if it (1) meets the user's saved hard constraints, (2) has every critical fact read from the user's canonical profile rather than generated, (3) verifiably completed submission, and (4) is interview-ready: every change traceable and explainable. Each condition maps to a measurable proxy (constraint-violation rate, critical-field correction rate, verified-submission rate, diff-acknowledgment rate), so trust becomes steerable instead of aspirational.

## Top two recommendations

1. **Read-never-generated for identity facts** (employer, education, work authorization, referral, salary): sourced from canonical profile, saved rules, or explicit confirmation; when unsure, stop and ask. Removes the catastrophic-tail failure class while touching a small share of fields.
2. **Execution honesty:** completion state must derive from the ATS's own validation, never the agent's belief, and the submit action blocks on verified state. A truthful status panel protects users from every other failure class at once.

## What I would validate next

Prevalence is the biggest unknown: incidents are documented, rates are not. The [validation plan](./validation-plan.md) specifies random application audits (vs. my opportunistic screenshots), segment interviews, and a staged experiment for the trust gate, including the friction tradeoff that could falsify the recommendation.

## Go deeper

- [Full teardown](./teardown.md) · 10 sections, pipeline attribution, steelman, banded prioritization, 90-day plan, self-critique
- [Evidence log](./evidence-log.md) · dated entries · [Evidence index](./evidence-index.md) · every finding with type, status, and confidence
- [Trust Layer prototype](../prototypes/jobright-trust-layer/) · the P0 turned into interaction logic (independent concept)
- [Validation plan](./validation-plan.md) · how this becomes decision-grade evidence
- [Instrumentation spec](./instrumentation-spec.md) · the event schema that makes TQA a query, not a slogan
