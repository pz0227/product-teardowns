# Audit Method, Jobright.ai

Why this file exists: the screenshot evidence in this teardown was captured **opportunistically** (worst moments got screenshotted). That is exactly the right way to document that failure classes exist, and exactly the wrong way to estimate how often they happen. This method converts incident documentation into rate estimates. **Status: method defined; random-audit dataset not yet collected. The [template](./audit-template.csv) is a template, not results.**

## Two funnels, kept separate

Mixing recommendation quality with execution quality produces mush. They are different systems with different failure modes.

### Funnel 1: recommendation quality

*Question: does Jobright recommend jobs that pass my saved hard constraints?*

- **Metric:** constraint violation rate in the recommendation feed (violations / recommendations sampled).
- **Procedure:** sample the top N feed recommendations at a fixed time daily; judge each against the user's saved constraints (role type, seniority, employment type, salary floor, sponsorship). Record verdict and reason per item.
- **The existing 43% figure (JR-01)** belongs to this funnel: a documented 7-item sample with stated criteria. It is a **calculated point estimate from one small sample**, not a stable rate; the procedure above is how it becomes one.

### Funnel 2: application execution quality

*Question: once a job is selected, does the agent execute the application correctly and honestly?*

Two collection layers, so low-frequency high-severity incidents are never lost while the rate sample stays unbiased:

1. **Event-triggered incident logging (always on).** Any critical incident is recorded regardless of sampling: wrong referral/authorization answer, wrong school or employer, salary-unit mismatch, failed scan, fabricated resume content, false completion claim.
2. **Random audit sampling (the rate estimator).** Each usage day, select a random sample of 5 applications *before* knowing how they went, and complete the full schema in [audit-template.csv](./audit-template.csv) for each.

### Audit schema (one row per audited application)

| Column | What to record |
|---|---|
| `date` | Audit date |
| `company_role` | Company and role (or anonymized ID if published) |
| `platform_ats` | Workday, Greenhouse, Lever, other |
| `method` | partnered-ATS autofill / AI Scan / Easy Apply / assisted-manual |
| `time_to_complete_min` | Wall-clock minutes, start to submitted-or-abandoned |
| `autofill_succeeded` | yes / partial / no |
| `critical_field_wrong` | yes / no, and which field |
| `salary_handled_correctly` | yes / no (unit, range, JD context) |
| `generated_content_needed_rewrite` | none / minor / major |
| `resume_changes_explainable` | yes / no / no changes |
| `correct_resume_version_used` | yes / no / unverifiable |
| `submission_verified` | yes / no / unclear |
| `notes` | Free text |

## Rules that keep the numbers honest

1. **Opportunistic captures never enter rate calculations.** They live in the evidence index as incident documentation.
2. **Select the audit sample before outcomes are known.** Post-hoc selection of interesting applications recreates the bias this method exists to remove.
3. **Every published rate carries its n and its window.** "43% (n=7, one day, one profile)" is honest; "43% of recommendations are wrong" is not.
4. **One user is still one user.** Rates from this method describe my account and constraints; they become market claims only with more users, which is beyond this project's current scope and labeled accordingly.
