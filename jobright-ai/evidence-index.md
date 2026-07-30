# Evidence Index, Jobright.ai

Every finding used in the [teardown](./teardown.md), with what it rests on and whether you can inspect it yourself. Seven redacted screenshots are published in [`img/`](./img/README.md) with captions; raw originals contain personal information and stay out of git by policy.

Status is split into three dimensions, because "verified" on its own is ambiguous: it can mean "I saw it happen" or "you can inspect it too," and those are very different guarantees for a reader.

- **Evidence basis:** Direct observation · First-person recollection · Calculated · Product update observed · External source · Inference
- **Artifact availability:** Publicly inspectable (published in [`img/`](./img/README.md)) · Privately archived (raw screenshot exists, contains personal data, not published) · No artifact · External source
- **Confidence:** High · Medium · Low

| ID | Date (2026) | Finding | Evidence basis | Artifact availability | Confidence | Supports |
|---|---|---|---|---|---|---|
| JR-01 | 07-07 | Recommendation precision on my saved hard constraints: 3 of 7 top recommendations usable (43%). Sample and criteria documented in log | Calculated | Log entry (sample listed item by item) | Low-Medium (n=7; 95% Wilson interval 16% to 75%, see [audit method](./audit-method.md)) | §3①, §4 |
| JR-02 | 07-07 | Referral question answered "Yes" with an invented company name; no referral exists | First-person recollection | None | Medium | §5 #1 |
| JR-03 | 07-07 | University name filled incorrectly on an application | First-person recollection | None | Medium | §5 #1 |
| JR-04 | 07-07 | Salary autofill reuses last-typed figure regardless of JD; annual figure placed in a monthly field | First-person recollection | None | Medium | §5 #2 |
| JR-05 | 07-07 | Silent resume rewrite ("market & competitive analysis" became "profit analysis"); interviewer probed it and I could not speak to the term | Observed | None (interview recounted same week) | High (personally experienced) | §3⑥, §5 #5 |
| JR-06 | 07-07 | AI scan on non-partnered sites runs very long, sometimes completes with nothing filled | Direct observation | Privately archived (later batch) | High | §5 #3 |
| JR-07 | 07-08/09 | Tailored resume invented experience: "AI-powered banking features," agile filler, none in canonical resume | Direct observation | Privately archived | High | §5 #1, TL;DR |
| JR-08 | 07-08/09 | Tailored resume invented a quantified claim: "improving MVP release timelines by 18%" | Direct observation | Publicly inspectable: [`resume_make_up_with_quantified_results.png`](./img/resume_make_up_with_quantified_results.png) | High | §5 #1, TL;DR |
| JR-09 | 07-08/09 | "Name of Latest Employer" autofilled with a consulting firm I never worked at | Direct observation | Publicly inspectable: [`wrong_info_about_last_employment_info.png`](./img/wrong_info_about_last_employment_info.png) | High | §5 #1, TL;DR |
| JR-10 | 07-08/09 | Degree name mangled ("Agricultural Business Technoiogy [sic]") in place of my actual program | Direct observation | Privately archived | High | §5 #1 |
| JR-11 | 07-08/09 | "How soon are you available?" answered with a date already in the past at fill time | Direct observation | Privately archived | High | §5 #2 |
| JR-12 | 07-08/09 | Salary range filled "70000 to 70000": degenerate range from blind value reuse | Direct observation | Privately archived | High | §5 #2 |
| JR-13 | 07-08/09 | Compensation expectation filled **6500095000**: saved range 65000 to 95000 concatenated | Direct observation | Publicly inspectable: [`put_old_salary_range_for_new_postion_crazy_number.png`](./img/put_old_salary_range_for_new_postion_crazy_number.png) | High | §5 #2, TL;DR |
| JR-14 | 07-08/09 | Form instruction 'If "Yes", type Yes' answered with "relocating" | Direct observation | Publicly inspectable: [`aigc_is_wrong.png`](./img/aigc_is_wrong.png) | High | §5 #2 |
| JR-15 | 07-08/09 | Location preference "San Francisco (Hybrid)" filled for a Des Moines, Iowa company | Direct observation | Privately archived | High | §5 #2 |
| JR-16 | 07-08/09 | Status panel "5/5 filled, form complete, Submit Now" while the ATS flagged missing required email and phone | Direct observation | Publicly inspectable: [`can_not_finish_auto_fill_with_even_simply_fields.png`](./img/can_not_finish_auto_fill_with_even_simply_fields.png) | High | §5 #7 |
| JR-17 | 07-08/09 | "3/3 required fields filled, 100%" over a visibly empty required field | Direct observation | Privately archived | High | §5 #7 |
| JR-18 | 07-08/09 | Panel proceeds while education/skills sections were never touched | Direct observation | Privately archived | High | §5 #7 |
| JR-19 | 07-08/09 | "15/16 filled, 94%" with legal/background toggles shown complete but unselected; agent attempts to auto-answer compliance questions; stalled minutes | Direct observation | Privately archived | High | §5 #7 |
| JR-20 | 07-08/09 | "11/11 required fields filled, Submit Now" while the ATS flagged the missing **resume** and current company | Direct observation | Publicly inspectable: [`submit-now-over-missing-resume.png`](./img/submit-now-over-missing-resume.png) | High | §5 #7, TL;DR |
| JR-21 | 07-08/09 | "29/29 filled, 100%" while Major unset, GPA empty and error-highlighted, State unset | Direct observation | Privately archived | High | §5 #7 |
| JR-22 | 07-08/09 | All pre-steps checked, then "Fill Out Application Form 0/13" over a fully empty form | Direct observation | Privately archived | High | §5 #3 |
| JR-23 | 07-08/09 | "Autofill Not Supported" on non-partnered site; manual form left empty | Direct observation | Publicly inspectable: [`autofill_not_avalable.png`](./img/autofill_not_avalable.png) | High | §5 #3 |
| JR-24 | 07-08/09 | Many jobs resolve to assisted-manual flow ("Hit Autofill, review, submit, then click I've Applied"), not delegation | Direct observation | Privately archived | High | §5 #6 |
| JR-25 | 07-08/09 | Posting stating "W-2 only, no H-1B sponsorship" served to a profile requiring future sponsorship | Direct observation | Publicly inspectable: [`autofill_not_avalable.png`](./img/autofill_not_avalable.png) (JD panel) | High | §3①, §4 |
| JR-26 | 07-09 | Fabricated tailored resumes (JR-07/08) were auto-submitted to real jobs before the user could intervene; user could not reconstruct which version went where | Observed (annotation) | Log annotation | High for occurrence, Low for count | §5 gap 4, §6 P1 |
| JR-27 | 07-12 | Applied tab now links each application to company + resume version (product update) | Product update observed | Log entry | High | §3⑤, §6 P1 rescope |
| JR-28 | 07-12 | Sponsorship-violating recommendations: roughly 1 to 2 observed in the prior week | Observed | Log annotation | Low (casual count) | §3① |
| JR-29 | 07-21 | LazyApply public reviews (2.4 Trustpilot, 52% one-star) independently reproduce the failure taxonomy: wrong authorization answers, half-filled forms, inflated counts | External signal | Public review site, retrieved 2026-07 | Medium (external, not audited by me) | §7 |
| JR-30 | 07-21 | Teal 4.9 Chrome Web Store rating; Simplify reputation and reported field accuracy | External signal | Public listings, retrieved 2026-07 | Medium | §7 |

## Reading notes

- **Opportunistic capture, not a rate.** JR-07 through JR-25 were captured because they were failures. They are strong evidence that these failure classes exist and no evidence at all about frequency. Rates require the pre-selected sampling in the [audit method](./audit-method.md).
- **Recollections stay recollections.** JR-02, JR-03, JR-04, and JR-05 have no artifact. They shaped what I watched for; the documented incidents carry the argument.
- **One screenshot can support two findings** (JR-23 and JR-25): the same capture shows an execution failure in one panel and a recommendation-constraint violation in another.
