# Evidence Index, Jobright.ai

Every finding used in the [teardown](./teardown.md), with its evidence type, status, and where it lives. Raw screenshots contain personal information and are kept in a local archive, out of git; the [redaction checklist](./img/README.md) tracks which are being prepared for publication. A finding citing an unpublished screenshot is marked "archived (redaction pending)".

**Evidence types:** Observed (screenshot) · Observed (recalled) · Calculated · Product update observed · External signal
**Status:** Verified (screenshot in archive) · Unverified (recall only, no artifact) · Updated (later evidence changed scope)

| ID | Date (2026) | Finding | Type | Artifact | Confidence | Supports | Status |
|---|---|---|---|---|---|---|---|
| JR-01 | 07-07 | Recommendation precision on my saved hard constraints: 3 of 7 top recommendations usable (43%). Sample and criteria documented in log | Calculated | Log entry (sample listed item by item) | Medium (n=7, one profile) | §3①, §4 | Verified |
| JR-02 | 07-07 | Referral question answered "Yes" with an invented company name; no referral exists | Observed (recalled) | None | Medium | §5 #1 | Unverified |
| JR-03 | 07-07 | University name filled incorrectly on an application | Observed (recalled) | None | Medium | §5 #1 | Unverified |
| JR-04 | 07-07 | Salary autofill reuses last-typed figure regardless of JD; annual figure placed in a monthly field | Observed (recalled) | None | Medium | §5 #2 | Unverified |
| JR-05 | 07-07 | Silent resume rewrite ("market & competitive analysis" became "profit analysis"); interviewer probed it and I could not speak to the term | Observed | None (interview recounted same week) | High (personally experienced) | §3⑥, §5 #5 | Verified by consequence |
| JR-06 | 07-07 | AI scan on non-partnered sites runs very long, sometimes completes with nothing filled | Observed | Later batch D screenshots | High | §5 #3 | Verified |
| JR-07 | 07-08/09 | Tailored resume invented experience: "AI-powered banking features," agile filler, none in canonical resume | Observed (screenshot) | `make_up_resume_info_just_to_match_jd.png`, `resume_makeup.png` archived (redaction pending) | High | §5 #1, TL;DR | Verified |
| JR-08 | 07-08/09 | Tailored resume invented a quantified claim: "improving MVP release timelines by 18%" | Observed (screenshot) | `resume_make_up_with_quantified_results.png` archived (redaction pending) | High | §5 #1, TL;DR | Verified |
| JR-09 | 07-08/09 | "Name of Latest Employer" autofilled with a consulting firm I never worked at | Observed (screenshot) | `wrong_info_about_last_employment_info.png` archived (redaction pending) | High | §5 #1, TL;DR | Verified |
| JR-10 | 07-08/09 | Degree name mangled ("Agricultural Business Technoiogy [sic]") in place of my actual program | Observed (screenshot) | `wrong_info_miss_info.png` archived (redaction pending) | High | §5 #1 | Verified |
| JR-11 | 07-08/09 | "How soon are you available?" answered with a date already in the past at fill time | Observed (screenshot) | `use_some_very_old_days_past_month.png` archived (redaction pending) | High | §5 #2 | Verified |
| JR-12 | 07-08/09 | Salary range filled "70000 to 70000": degenerate range from blind value reuse | Observed (screenshot) | `salary_range_not_adjusted_same_as_last_time.png` archived (redaction pending) | High | §5 #2 | Verified |
| JR-13 | 07-08/09 | Compensation expectation filled **6500095000**: saved range 65000 to 95000 concatenated | Observed (screenshot) | `put_old_salary_range_for_new_postion_crazy_number.png` archived (redaction pending) | High | §5 #2, TL;DR | Verified |
| JR-14 | 07-08/09 | Form instruction 'If "Yes", type Yes' answered with "relocating" | Observed (screenshot) | `aigc_is_wrong.png` archived (redaction pending) | High | §5 #2 | Verified |
| JR-15 | 07-08/09 | Location preference "San Francisco (Hybrid)" filled for a Des Moines, Iowa company | Observed (screenshot) | `company_is_in_Des_Moines_iowa_but_put_SF_CA.png` archived (redaction pending) | High | §5 #2 | Verified |
| JR-16 | 07-08/09 | Status panel "5/5 filled, form complete, Submit Now" while the ATS flagged missing required email and phone | Observed (screenshot) | `can_not_finish_auto_fill_with_even_simply_fields.png` archived (redaction pending) | High | §5 #7 | Verified |
| JR-17 | 07-08/09 | "3/3 required fields filled, 100%" over a visibly empty required field | Observed (screenshot) | `said_filled_but_not.png` archived (redaction pending) | High | §5 #7 | Verified |
| JR-18 | 07-08/09 | Panel proceeds while education/skills sections were never touched | Observed (screenshot) | `said_filled_but_not_filled_anything.png` archived (redaction pending) | High | §5 #7 | Verified |
| JR-19 | 07-08/09 | "15/16 filled, 94%" with legal/background toggles shown complete but unselected; agent attempts to auto-answer compliance questions; stalled minutes | Observed (screenshot) | `stuck_for_mins_and_not_filling.png` archived (redaction pending) | High | §5 #7 | Verified |
| JR-20 | 07-08/09 | "11/11 required fields filled, Submit Now" while the ATS flagged the missing **resume** and current company | Observed (screenshot) | `not_filling_most_basic_material(resume).png` archived (redaction pending) | High | §5 #7, TL;DR | Verified |
| JR-21 | 07-08/09 | "29/29 filled, 100%" while Major unset, GPA empty and error-highlighted, State unset | Observed (screenshot) | `missing:wrong_info_about_university.png` archived (redaction pending) | High | §5 #7 | Verified |
| JR-22 | 07-08/09 | All pre-steps checked, then "Fill Out Application Form 0/13" over a fully empty form | Observed (screenshot) | `stuck_at_agent_page_not_filling_info.png` archived (redaction pending) | High | §5 #3 | Verified |
| JR-23 | 07-08/09 | "Autofill Not Supported" on non-partnered site; manual form left empty | Observed (screenshot) | `autofill_not_avalable.png` archived (redaction pending) | High | §5 #3 | Verified |
| JR-24 | 07-08/09 | Many jobs resolve to assisted-manual flow ("Hit Autofill, review, submit, then click I've Applied"), not delegation | Observed (screenshot) | `most_of_job_still_require_user_to_click_external_apply.png` archived (redaction pending) | High | §5 #6 | Verified |
| JR-25 | 07-08/09 | Posting stating "W-2 only, no H-1B sponsorship" served to a profile requiring future sponsorship | Observed (screenshot) | `autofill_not_avalable.png` (JD panel, same image) archived (redaction pending) | High | §3①, §4 | Verified |
| JR-26 | 07-09 | Fabricated tailored resumes (JR-07/08) were auto-submitted to real jobs before the user could intervene; user could not reconstruct which version went where | Observed (annotation) | Log annotation | High for occurrence, Low for count | §5 gap 4, §6 P1 | Verified as incident |
| JR-27 | 07-12 | Applied tab now links each application to company + resume version (product update) | Product update observed | Log entry | High | §3⑤, §6 P1 rescope | Updated: P1 critique rescoped to diffs/rationale/answers archive |
| JR-28 | 07-12 | Sponsorship-violating recommendations: roughly 1 to 2 observed in the prior week | Observed | Log annotation | Low (casual count) | §3① | Partially verified |
| JR-29 | 07-21 | LazyApply public reviews (2.4 Trustpilot, 52% one-star) independently reproduce the failure taxonomy: wrong authorization answers, half-filled forms, inflated counts | External signal | Public review site, retrieved 2026-07 | Medium (external, not audited by me) | §7 | Verified as external signal |
| JR-30 | 07-21 | Teal 4.9 Chrome Web Store rating; Simplify reputation and reported field accuracy | External signal | Public listings, retrieved 2026-07 | Medium | §7 | Verified as external signal |

## Reading notes

- **Opportunistic capture, not a rate.** JR-07 through JR-25 were captured because they were failures; the batch says nothing about how often failures occur. Rates come from the [audit method](./audit-method.md), which exists precisely because this distinction matters.
- **Recalled entries stay marked unverified.** JR-02/03/04 predate the screenshot habit. They informed which failure modes to watch for; the verified entries carry the argument.
- **One index row can cite one screenshot for two findings** (JR-23/JR-25): the same image shows an execution failure and a recommendation-constraint violation in different panels.
