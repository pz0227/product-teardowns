# Teardown Template

The structure I aim for. Not every teardown fills every section, but the strongest ones move from evidence to diagnosis to a decision I'd defend.

1. **TL;DR**: the thesis, the sharpest piece of evidence, and the one fix, in five lines.
2. **Product overview**: who it's really for, what problem it solves, why they pay.
3. **Business model**: how it makes money; where the paywall sits and why.
4. **Core user journey**: the steps from landing to value; where users drop or get hurt.
5. **Metrics analysis**: what its north star *should* be vs. what it *appears* to optimize.
6. **Diagnosis**: cluster the failures; attribute them to where they actually live; find the root cause behind the pattern, not a bug list.
7. **Recommendations**: banded prioritization with named assumptions and validation gates.
8. **Competitive landscape**: where the product sits among alternatives, and what that reveals.
9. **If I were their PM**: what I would propose to validate with the team, phase by phase.
10. **Where this analysis could be wrong**: the limits of my own case, and how I'd de-risk it.

Each teardown ships with companion files: a 3-minute `summary.md`, a dated `evidence-log.md`, and an `evidence-index.md` tying every finding to its type, confidence, and status. Method and epistemic rules live in [METHODOLOGY.md](./METHODOLOGY.md).

Rules for myself:
- Every claim needs evidence from the log (dated, reproducible), or an explicit epistemic label.
- Incidents are not rates; rates need pre-selected samples.
- Steelman the builder: explain why the product is like this before judging it.
- Constructive tone in public versions: roast the tradeoff, not the team.
- No em-dashes and no vibes. If a sentence can't survive a follow-up question, it doesn't ship.
