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

## 2026-07-12 — Applied-tab verification (partial) + product update observed
Checked Jobright's application history per the 07-09 verification item: the **Applied tab now links each application to the company and the resume version used** (appears to be a recent product update). Still missing/unverified: change diffs with rationale, archived free-text answers, pre-submit confirmation gate. P1 critique rescoped accordingly in teardown §6.

## 2026-07-08/09 — Screenshot evidence batch #1 (15 images, local `evidence screenshots/`, unredacted — kept out of git)

> Status: cataloged by Claude from the raw screenshots; per-item context (company, what happened next, whether submitted) pending Polly's annotation pass. Redacted copies go to `img/` before anything is published.

**A. Resume fabrication (tailoring)**
- `make_up_resume_info_just_to_match_jd.png` — tailored resume invented DR bullets: "AI-powered banking features," "Utilized JIRA and agile methodologies." Neither exists in the canonical resume.
- `resume_make_up_with_quantified_results.png` — invented quantified claim: "improving MVP release timelines by 18%," plus "backlog grooming," "bi-weekly demo sessions." Fabricated metric.
- `resume_makeup.png` — all three jobs rewritten with generic agile filler ("backlog refinement sessions"; "structured backlog management" at an export company).

**Context annotations (2026-07-09, Polly):**
- The fabricated tailored resumes (batch A) **were submitted to real jobs** — in many flows the agent completed submission before the user could intervene. Polly could not reconstruct from memory which version went where. **⚠️ To verify: Jobright does have an application-history feature — check whether it preserves the exact submitted resume version and free-text answers per application, or only the fact that an application was sent. The P1 critique stands only to the extent the former is missing.**
- For several incidents (e.g., the BCG employer error, the ClassDojo submit prompt) Polly **cannot reconstruct the context** — which application, whether it shipped. At 30+ applications/day this is expected, and it is itself evidence for the P1 application-memory recommendation: *without an application record, even the user's own incidents are untraceable.*
- Sponsorship-violating recommendations (batch E): roughly 1–2 observed in the past week — real but low-frequency.
- Prevalence framing: 19 screenshots captured across 2026-07-08/09, most during the 07-09 batch of 30+ applications. Capture was opportunistic (worst moments screenshotted), so this is **incident documentation, not a rate estimate** — rates come from the random-audit sampling plan above.

**B. Critical fact errors (application forms)**
- `wrong_info_about_last_employment_info.png` — "Name of Latest Employer" autofilled as "Boston Consulting Group (BCG)." Never worked there.
- `wrong_info_miss_info.png` — education mapped as "Agricultural Business Technoiogy [sic], University of Pennsylvania" (actual: M.S.Ed in Statistics, Measurement, Assessment & Research Technology). UL Solutions application.
- `use_some_very_old_days_past_month.png` — "How soon are you available to start?" → "2026-06-26," a date already in the past at fill time.
- `salary_range_not_adjusted_same_as_last_time.png` — Salary Range filled "70000 to 70000": degenerate range, reused last-typed figure.
- `aigc_is_wrong.png` — form instructs 'If "Yes", type Yes' → agent typed "relocating." Instruction not followed; answer ambiguous.
- `put_old_salary_range_for_new_postion_crazy_number.png` — total-compensation expectation filled as "**6500095000**": the saved range 65000–95000 concatenated into one ~$6.5B figure. Field-format blindness on top of value reuse.
- `company_is_in_Des_Moines_iowa_but_put_SF_CA.png` — "location preference" filled "San Francisco, California (Hybrid)" on an application for a Des Moines, Iowa company. Context-blind reuse of a saved preference.

**C. Execution-state misreporting (proposed NEW failure mode #7)**
- `can_not_finish_auto_fill_with_even_simply_fields.png` — agent: "5/5 required fields filled. Form complete… click Submit Now" while the ATS simultaneously flags missing required Email and Phone (ClassDojo).
- `said_filled_but_not.png` — panel: "3/3 required fields filled | 100%" while Field of Study sits empty (Globe Life).
- `said_filled_but_not_filled_anything.png` — education/skills sections untouched (ADD buttons never clicked) while panel proceeds (Goldman Sachs).
- `stuck_for_mins_and_not_filling.png` — "15/16 filled | 94%" including felony/background-check/references questions shown ✓, but the YES/NO toggles are unselected; stalled for minutes (PerformYard). Also: agent attempts to auto-answer legal/compliance questions.
- `not_filling_most_basic_material(resume).png` — "11/11 required fields filled. Form complete… click Submit Now" while the ATS flags missing required **Resume** and **Current Company**. The agent invites submission of an application with no resume attached.
- `missing:wrong_info_about_university.png` — "29/29 required fields filled | 100%" while Major is unset ("Make a Selection"), GPA is empty and error-highlighted, and State is unset.

Why this is distinct from #3 (scan hangs): a hang is a visible failure the user can take over from; a **false success claim** invites submitting an incomplete or wrong application. It attacks TQA condition 3 (verified submission state) directly.

**D. Execution coverage reality**
- `stuck_at_agent_page_not_filling_info.png` — all pre-steps ✓, then "Fill Out Application Form 0/13" over a fully empty Greenhouse form (Clinical Architecture).
- `autofill_not_avalable.png` — "Autofill Not Supported — Submit Request" on a non-partnered careers site; manual form empty (WebstaurantStore via Clark Associates careers).
- `most_of_job_still_require_user_to_click_external_apply.png` — "supports application autofill only on the application site… Hit Autofill, review, submit, then click I've Applied" — assisted-manual flow, not delegation (Imagen).

**E. Recommendation constraint violation (funnel 1, with receipt)**
- `autofill_not_avalable.png` (JD panel, same image) — posting states "W-2 candidates only, H-1B sponsorship not available," yet the job was served/queued for a user whose profile requires future sponsorship.

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
