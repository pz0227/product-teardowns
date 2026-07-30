# Claude Code in 3 Minutes

> **Evidence maturity: early pattern hypothesis.** Four documented incidents from one month of daily paid usage, logging ongoing. Enough to form a hypothesis, not to prove a pattern. Published early on purpose, with the uncertainty on the label rather than buried in a footnote.

## The product and the problem

Claude Code is an agentic AI assistant that started as a coding tool and is becoming a general work agent: it edits real files, runs commands, browses, and drafts work that ships under the user's name, across a desktop app, a mobile app, and a browser extension. It sits at the deepest end of the delegation spectrum this series maps: more is delegated here than to any job agent, so the cost of silent failure is higher.

## Research context

Daily paid use for real work (software projects, research, writing, planning) across all three surfaces, including unusually long multi-day sessions. That is a power-user pattern, and typical users may never hit the boundaries I hit.

## The four documented incidents

All dated, in the [evidence log](./evidence-log.md):

1. **Memory does not travel across surfaces** (07-22, observed). The mobile app had zero knowledge of context the desktop holds; same account, same product name, and the boundary is discovered only at the moment of need.
2. **A platform outage broke delegated work mid-task** (07-29, observed). Repeated vague "server error" failures; the user cannot tell if the problem is their request, the agent, or the platform.
3. **The user becomes the model router** (07-29, observed). Meaningful quality differences across paid model tiers push the routing decision onto the person least equipped to make it per-task.
4. **Context compaction silently dropped agreed decisions** (07-30, observed). After automatic history compaction, the agent contradicted agreements made earlier in the same session; the user caught it only by paying close attention, then paid a re-teach tax.

## The developing hypothesis

**The model's intelligence was not the failing component in any logged incident.** All four failures live in state, continuity, and transparency: what the agent remembers, what it discloses about what it remembers, and what happens to agreements at system boundaries (surfaces, sessions, compaction). Stated as a falsifiable hypothesis: if future logging shows trust failures that are pure generation errors, it weakens; failures clustering at state boundaries strengthen it.

## Proposed north star (draft)

**Trusted Completed Work (TCW):** work counts only if completed, consistent with prior agreements, continuous across session boundaries, and not reworked by the user within a defined window. Measurable proxies: post-compaction contradiction rate, re-teach frequency, cross-surface context-miss rate, correction rounds trended by tenure.

## Top two recommendations (disclosure before capability)

1. **Continuity contract:** on compaction, disclose what was kept and dropped, and let the user pin decisions that must survive. Converts silent degradation into a visible, correctable moment. No new memory infrastructure required.
2. **Capability disclosure per surface:** each surface states up front what context it does and does not have, instead of failing silently. Honesty about absent memory is cheaper than syncing it, and buys most of the trust.

## What I would validate next

Frequency, before anything else: how often does compaction actually drop something that matters, and for whom? The log also records what the product does well, so the evidence base does not become a grievance file, and treats the retention paradox (a dissatisfied user who keeps paying, including me) as data worth explaining.

## Go deeper

- [Full teardown](./teardown.md) · verification-ability segmentation, steelman, banded prioritization, 90-day plan, self-critique
- [Evidence log](./evidence-log.md) · dated entries · [Evidence index](./evidence-index.md)
- Flagship case for comparison: [Jobright.ai](../jobright-ai/summary.md), the developed version of the same trust thesis
