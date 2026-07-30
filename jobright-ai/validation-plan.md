# Validation Plan, Jobright.ai Trust Layer

How the recommendations in the [teardown](./teardown.md) would be validated before an engineering commitment. This plan defines methods and an experiment design; **it contains no results, because none of these studies have been run.** It exists to show what decision-grade evidence would look like, and to name in advance what would falsify my own recommendation.

## Research questions

1. **Prevalence:** how often do critical-field errors actually occur per application, per field type, per ATS? (My evidence documents existence, not rate; see [audit method](./audit-method.md).)
2. **Harm distribution:** which user segments (volume-first, quality-first, constraint-heavy) experience the highest downstream harm per error?
3. **Interruption cost:** how often would the read-never-generated gate pause an application, and how long does resolution take?
4. **Throughput tradeoff:** does confirmation measurably reduce applications completed per session, and by how much?
5. **Provenance scope:** which fields should always require provenance, and which can tolerate generation with review?
6. **Interview readiness:** does a resume diff view change users' ability to explain their submitted materials? (Self-reported and, ideally, interview-outcome proxies.)

## Methods

| Method | What it answers | Notes |
|---|---|---|
| Random application audits | Q1, Q4 baseline | Per [audit method](./audit-method.md): sample selected before outcomes known |
| Event-triggered incident logging | Q1 severity tail, Q2 | Always on; catches low-frequency high-severity cases sampling misses |
| Segment interviews (all three §1 segments) | Q2, Q5, Q6 | Constraint-heavy users are my bias (§10.4); the other segments keep me honest |
| Prototype usability tests | Q3, Q6 | The [Trust Layer prototype](../prototypes/jobright-trust-layer/) exists for exactly this: put the gate in front of users and watch |
| Instrumentation proposal | Q1, Q3, Q4 at scale | The TQA proxies from teardown §4, which only the company can implement |
| Staged product experiment | Q3, Q4 decision | Below |

## The staged experiment (what I'd propose to the team)

- **Population:** active Turbo users in agent mode.
- **Segment split:** stratify by the three §1 segments, because the expected tradeoff differs by segment.
- **Control:** current behavior.
- **Treatment:** read-never-generated on the top five identity fields (employer, education, work authorization, referral, salary), with pause-and-ask on low confidence; partnered ATSs only, to avoid confounding by parsing failures.
- **Primary metric:** critical-field correction rate (user fixes a high-risk autofilled field), expected to fall.
- **Guardrails:** applications completed per session (should not fall beyond an agreed budget), pause rate per application, median pause-resolution time, session abandonment.
- **Expected tension, stated up front:** factual trust vs. application speed vs. completion rate vs. interruption rate. The gate spends interruption to buy trust; the experiment prices that trade instead of assuming it.
- **Stopping / rollback criteria:** pause rate above the friction budget for a sustained window, or completion-rate guardrail breached, or pause-resolution time collapsing into abandonment. Rollback is a threshold change or a flag, not a rebuild.
- **Major confounders:** ATS mix shifts, job-market seasonality, tenure effects (new users pause more), and the novelty effect of any new confirmation UI.
- **What would falsify the recommendation:** if the correction rate barely moves while completion drops materially, the gate is mis-scoped (wrong fields, wrong threshold) or the problem is rarer than my usage suggests, and the honest conclusion is to keep execution honesty (which survives at any error rate) and shelve the gate.

## Sequencing

Prototype usability first (cheap, external), then instrumentation, then the staged experiment. Nothing here requires believing my n=1 numbers; the plan exists so nobody has to.
