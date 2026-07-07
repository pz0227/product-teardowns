# Evidence Log — Jobright.ai

> Rule: dated, specific, reproducible. One entry per observation. Numbers anonymized where personal.

## Week 2 plan: separate recommendation quality from execution quality

Current entries are strong directional hypotheses from one heavy user, not population-level claims. Evidence collection splits into **two funnels**:

### Funnel 1 — Recommendation-stage evidence
Measures whether Jobright recommends the right jobs. Primary metric: **constraint violation rate in the recommendation feed**. The existing 43% observation belongs here — it is evidence about recommendation precision / constraint mismatch, *not* application execution quality.

### Funnel 2 — Application-stage evidence
Measures whether Jobright reliably executes applications once a job is selected. To keep the study sustainable, do **not** fully log every application. Two-layer system:

- **Event-triggered logging:** always record any critical incident — wrong referral answer, incorrect school, salary-unit mismatch, visa/work-authorization error, failed AI Scan, missing tailored resume.
- **Random audit sampling:** each day, fully audit a random sample of **5 applications** with the complete schema: company & role · platform/ATS · method (partnered ATS / AI Scan / Easy Apply / other) · time to complete · autofill succeeded? · critical field wrong? · salary stale/incorrect/wrong unit? · generated content needed major rewriting? · resume changes understandable & interview-defensible? · correct tailored resume available? · submission verified?

This yields an unbiased execution-quality sample without full logging of 30+ daily applications, while still capturing all low-frequency, high-severity incidents.

**Positioning:** these are not population-level claims yet. They are a structured usability sample designed to identify where delegated job-search automation breaks trust.

## 2026-07-07 — Recommendation precision sample #1
Sampled the top 7 recommendations in my feed (profile: entry-level PM/analyst, full-time, US):
- ✅ Associate PM @ CSC Generation — relevant (86% "strong match")
- ✅ AI Innovation Analyst @ Carnival — relevant
- 🟡 Associate PM @ Sunrise Medical — marginal (marketing-heavy)
- ❌ Fall **co-op internship** (I need full-time) — Lila Sciences
- ❌ Fall **internship** — Whitney Museum
- ❌ **Software Engineer (OCaml)** @ Jane Street — flagged "100% skills match" for a PM profile
- ❌ Product Dev Analyst — salary band below my stated floor

**Precision: 3/7 ≈ 43%** (usable = matches role type, seniority, employment type, salary floor I set in-product).

## 2026-07-07 — Autofill fact errors (recalled from recent usage)
- Wrote the wrong university name.
- Answered "Do you have a referral?" with **Yes** and inserted a company name — I have no referral. (Integrity risk: this is the tool lying on my behalf.)
- Salary autofill reuses my last-typed number regardless of JD range; has filled the same annual figure into a **monthly** salary field.

## 2026-07-07 — Silent resume rewrite (interview harm)
Agent mode tailors my resume per JD with no diff/change log. One rewrite changed "market & competitive analysis" to "profit analysis"; an interviewer asked about it and I couldn't speak to the term. Value delivered at apply-time, cost charged at interview-time.

## 2026-07-07 — AI scan reliability
On sites not partnered (non-Workday etc.), AI scan runs very long and sometimes completes without filling anything.

<!-- Add new entries above this line, newest first within each date. -->
