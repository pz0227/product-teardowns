# Trust Layer Prototype

**An independent, conceptual prototype. Not affiliated with, endorsed by, or shipped into Jobright or any other product. All demonstration data is fictional (persona: "Jordan Lee").**

This turns the [Jobright teardown](../../jobright-ai/teardown.md)'s P0 recommendation into working interaction logic: what would an application agent look like if critical facts were **read, never generated**, if every resume change shipped only after review, and if the submit button were gated on verified state instead of the agent's belief?

## Run it

No build, no dependencies. Either:

```bash
cd prototypes/jobright-trust-layer
python3 -m http.server 8000
# open http://localhost:8000
```

or simply open `index.html` in a browser.

## What it demonstrates

1. **A provenance state model.** Every high-risk fact carries one of six states: profile-verified, evidence-backed, policy-derived, user-asserted, model-generated, or unsupported, plus a hard "generation allowed: never" policy. The states are not decoration; the gate treats them differently, and the distinction between the first three and the last three is the whole product argument.
2. **Read-never-generated in action.** Two fields start missing (referral, salary). The agent pauses and asks instead of inventing a plausible answer, which is exactly the failure documented in evidence entries [JR-02 and JR-13](../../jobright-ai/evidence-index.md). The salary pause shows policy-assisted resolution: JD range parsed, unit detected, saved user policy applied, one tap to confirm.
3. **Resume change transparency, with approval separated from evidence.** Each tailored edit is a before/after diff with a reason and a source check. One demo diff is deliberately **model-generated** (invented cohort count and outcome, mirroring [JR-08](../../jobright-ai/evidence-index.md)). Approving it does not make it true: the gate stays closed until you explicitly acknowledge that you are submitting non-evidence-backed content under your own name. Editing it changes who asserted it (user-asserted), not whether evidence exists.
4. **Submission trust gate, and an agent that cannot mark its own homework.** Submit stays disabled until every pre-submission item passes. Clicking it moves the state to *attempted*, never to *verified*: the panel says plainly that the agent cannot confirm the result itself, and only a simulated external signal from the site closes the loop. This is deliberate. An agent that treats its own click as proof of submission is committing failure mode #7, the exact behavior this teardown was written about.
5. **Live TQA verdict.** A panel evaluates the four [Trusted Qualified Application](../../jobright-ai/teardown.md#4-metrics-analysis) conditions in real time, so the metric definition from the teardown is experienced, not just read.

## Changelog: what an external review changed

**v1 to v2.** I asked a senior-PM reviewer to attack the prototype, and two of its states turned out to contradict the teardown they were built to demonstrate:

| Defect in v1 | Why it was wrong | v2 behavior |
|---|---|---|
| Editing a claim set `grounded = true` | A user can edit one invented claim into another. Approval creates **authorization**, not evidence. Collapsing the two is the same conflation the teardown criticizes | Six-state provenance model. Editing sets *user-asserted*; the record preserves that no independent evidence exists, and the gate requires an explicit acknowledgment before such content can ship |
| Clicking Submit set `submitted = true`, which satisfied the TQA condition "submission verified" | The teardown's entire argument on failure mode #7 is that submission truth must come from the site, never from the agent's own belief. The prototype was performing the failure it diagnosed | Three-state submission machine (attempted, verified, failed). The agent can reach *attempted*; only an external signal reaches *verified*. The verdict shows "Eligible: external verification pending" in between |

I am keeping this table rather than quietly fixing the code, because the interesting part is not that v1 had the bug. It is that the bug was a **conceptual** error I could not see until someone tested the model, which is the same reason this prototype needs real users next.

## Design rationale

- The tension this UI has to resolve is **speed vs. trust** (the teardown's §10.3 risk): so the gate interrupts only on missing or ungrounded content, resolves in one tap where a saved policy exists, and everything already verified flows through untouched. The design bet: pauses are rare and cheap; wrong submissions are rare and catastrophic.
- The diff view treats **ungroundedness, not change, as the enemy**: a grounded improvement sails through with one approval; only invented content blocks the gate.
- Plain HTML/CSS/JS on purpose: the concept is interaction logic and policy, not engineering; anyone can read the ~250 lines of script.

## Limitations (read before judging)

- A concept, not a product: no backend, no real parsing, no ATS integration, fictional data, one hand-built scenario.
- The "verified against the site's own state" gate item is aspirational within the demo; a real implementation needs ATS-side validation access, which is precisely the engineering question the [validation plan](../../jobright-ai/validation-plan.md) would scope.
- Pause frequency and resolution time are the make-or-break numbers, and a prototype cannot produce them; usability testing with the prototype is step one of the validation plan.

## Optional: GitHub Pages

The prototype is static and deploys as-is: repository Settings → Pages → deploy from branch, root or `/prototypes` path. No build step required. Skip this if it adds maintenance burden; `python3 -m http.server` is the supported path.
