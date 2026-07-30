# Redacted Evidence Images: Status and Checklist

**No screenshots are published yet.** The raw archive (20 images) contains personal information (name, email, phone, GPA, application identifiers) and is kept out of git by policy. This checklist tracks which images are queued for manual redaction and publication. An image appears in this folder only after every item in the redaction standard passes.

## Redaction standard (all must hold before publishing)

1. Name, email address, phone number, GPA, and any application/account identifiers removed or masked.
2. Any third-party personal information (recruiter names, referrer names) removed.
3. The screenshot remains understandable after redaction (the failure is still visible).
4. The image is linked from a specific evidence-index entry (JR-nn).
5. The caption states what the reader should notice, in one sentence.

## Publication queue (priority order, by evidentiary value)

| Priority | Evidence ID | File (local archive) | What it shows | What needs redaction |
|---|---|---|---|---|
| 1 | JR-13 | `put_old_salary_range_for_new_postion_crazy_number.png` | The 6500095000 concatenated salary | Applicant identity fields, company identifiers |
| 2 | JR-20 | `not_filling_most_basic_material(resume).png` | "Submit Now" claimed over a missing required resume | Identity fields, ATS account info |
| 3 | JR-09 | `wrong_info_about_last_employment_info.png` | Fabricated employer in "Latest Employer" | Identity fields; keep the fabricated value visible |
| 4 | JR-08 | `resume_make_up_with_quantified_results.png` | Invented "18%" quantified resume claim | All real resume content except the fabricated bullet |
| 5 | JR-16 | `can_not_finish_auto_fill_with_even_simply_fields.png` | "5/5 complete" vs. ATS flagging missing email/phone | Email/phone values themselves, identity fields |
| 6 | JR-25 | `autofill_not_avalable.png` | "W-2 only, no sponsorship" posting served to a sponsorship-requiring profile | Profile panel identity details |

Remaining images stay in the local archive until these six are published and the process is proven.

## Why not publish everything at once

Each image needs a manual redaction pass and a caption that earns its place. Six images cover every major failure class in the taxonomy (value fabrication, critical-fact error, execution-state misreporting, constraint violation); more adds volume, not proof.
