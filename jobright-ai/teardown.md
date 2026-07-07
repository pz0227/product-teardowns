# Teardown: Jobright.ai

> Status: 🚧 Work in progress · Started 2026-07-07
> My context: paying (Turbo) user, 350+ applications submitted through/alongside it. This teardown is based on logged daily usage, not a demo tour.

## 1. Product overview

_TODO (Polly): who is it for — job seekers broadly, or is the real core user the international student (see the H1B-sponsor filter)? What job is it hired to do?_

## 2. Business model

_TODO (Polly): Turbo subscription — where does the paywall sit? Why did I personally pay? What's the moment of willingness-to-pay?_

## 3. Core user journey

_TODO (Polly): recommend → review → autofill → submit → (interview?). Where does the journey actually deliver value, and where does it quietly hurt the user?_

## 4. Metrics analysis

Working thesis: **the product behaves as if its north star is "applications sent," while the user's true goal is interviews/offers.**

_TODO (Polly, from today's metrics practice): what SHOULD its north star be? Which 3 metrics would I watch? Why does "applications sent" explain the failure patterns below?_

## 5. Diagnosis — 3 failure clusters (from evidence log)

### Cluster A: Acts on my behalf without verifying facts
- Autofill writes wrong school name; fabricates referral answers ("Yes" + invents a company).
- Generated answers & cover letters read obviously AI-written.
- Agent silently rewrites my resume per JD with no change log — I got asked about a term "my" resume said in an interview and couldn't recall it.

### Cluster B: Context-blindness
- Salary field reuses my last-typed number regardless of the JD's posted range — even into **monthly** pay fields.
- Recommends LinkedIn Easy Apply jobs where its tailored-resume value prop can't apply.
- Recommendation precision: first logged sample 3/7 usable (see evidence log).

### Cluster C: Reliability
- On non-partnered ATS sites, AI scan hangs for a long time and often fills nothing.

_TODO (Polly): root-cause narrative — why do all three clusters trace back to the north-star misalignment? Steelman: why would a growth-stage company rationally make these tradeoffs?_

## 6. Recommendations (Week 3)

_TODO: top 3 fixes + RICE + the tradeoffs I'd accept as their PM._
