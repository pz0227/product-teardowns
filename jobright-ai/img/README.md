# Redacted Evidence Images

Seven redacted screenshots from my own logged usage, published as the visual evidence behind the [teardown](../teardown.md). Raw originals stay out of git by policy; these copies passed a manual redaction pass plus a verification review before publishing.

## Redaction standard (all must hold)

1. Name, email, phone, GPA, and any account or application identifiers removed.
2. Third-party personal information removed; company names blacked out where they identify a specific application.
3. The failure remains visible and understandable after redaction.
4. Each image is linked from a specific [evidence-index](../evidence-index.md) entry.
5. A caption states what the reader should notice.

## Published images

| Evidence ID | File | What to notice |
|---|---|---|
| [JR-09](../evidence-index.md) | `wrong_info_about_last_employment_info.png` | "Name of Latest Employer" autofilled with a consulting firm I have never worked at. An identity-level fact, generated rather than read from my profile. |
| [JR-13](../evidence-index.md) | `put_old_salary_range_for_new_postion_crazy_number.png` | Total compensation expectation filled as **6500095000**: my saved 65000 to 95000 range concatenated into a single ~$6.5B figure. Field-format blindness on top of blind value reuse. |
| [JR-08](../evidence-index.md) | `resume_make_up_with_quantified_results.png` | Highlighted text is generated content that is not in my canonical resume, including an invented metric ("improving MVP release timelines by 18%"). This version was submitted before I could review it. |
| [JR-14](../evidence-index.md) | `aigc_is_wrong.png` | The form instructs: `If "Yes", type Yes`. The agent typed "relocating". The field was not understood, and the answer it produced is ambiguous to a recruiter. |
| [JR-20](../evidence-index.md) | `submit-now-over-missing-resume.png` | Left panel: "11/11 required fields filled. Form complete, click Submit Now." Right panel, at the same moment: the site itself flags a missing required **Resume**. The agent invites submission of an application with no resume attached. |
| [JR-16](../evidence-index.md) | `can_not_finish_auto_fill_with_even_simply_fields.png` | Same pattern, different site: "5/5 required fields filled. Form complete" while the site flags missing required Email and Phone. Execution state is self-reported, not verified. |
| [JR-25](../evidence-index.md) | `autofill_not_avalable.png` | Two findings in one capture: the posting states "W-2 candidates only, H-1B sponsorship not available" yet was served to a profile that requires future sponsorship, and the panel reports "Autofill Not Supported" on this site. |

## Why these seven

They cover every failure class in the taxonomy: value fabrication (JR-08, JR-09), context-blind field interpretation (JR-13, JR-14), execution-state misreporting (JR-16, JR-20), and recommendation constraint violation (JR-25). The remaining images in my local archive repeat these classes; more would add volume, not proof.
