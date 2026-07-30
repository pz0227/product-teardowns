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

1. **Canonical profile with provenance.** Every high-risk fact (employer, education, work authorization, referral, salary) shows its value, source, confidence, and a hard "generation allowed: never" policy. The provenance column is the point: an answer you cannot trace is an answer you cannot trust.
2. **Read-never-generated in action.** Two fields start missing (referral, salary). The agent pauses and asks instead of inventing a plausible answer, which is exactly the failure documented in evidence entries [JR-02 and JR-13](../../jobright-ai/evidence-index.md). The salary pause shows policy-assisted resolution: JD range parsed, unit detected, saved user policy applied, one tap to confirm.
3. **Resume change transparency.** Each tailored edit is a before/after diff with a stated reason and a source check. One demo diff is deliberately **ungrounded** (invented cohort count and outcome, mirroring [JR-08](../../jobright-ai/evidence-index.md)); approving it without edit keeps the trust gate closed. Reject reverts to the original; edit converts it into user-confirmed content.
4. **Submission trust gate.** Submit stays disabled until every critical item is verified: fields sourced, salary unit checked, changes reviewed, no unreviewed ungrounded content. The last item ("verified against the site's own state") is shown as pending by design: honest state reporting is a claim only the real system could make, which mirrors teardown failure mode #7.
5. **Live TQA verdict.** A panel evaluates the four [Trusted Qualified Application](../../jobright-ai/teardown.md#4-metrics-analysis) conditions in real time, so the metric definition from the teardown is experienced, not just read.

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
