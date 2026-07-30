# Claude Code Teardown: The Deepest Delegation Yet, and the Memory That Doesn't Keep Up

> **Status:** 🌱 v0, evidence gathering. Written from daily paid usage; every claim cites the [evidence log](./evidence-log.md). Same rules as [teardown #1](../jobright-ai/teardown.md): feelings as signals, evidence as proof, roast the tradeoff, not the team.

## 1. TL;DR (draft thesis, to be earned)

Teardown #1 examined an agent that applies to jobs on your behalf. This one examines the deepest delegation I practice daily: an agent that writes code, runs commands, manages projects, and drafts my public words. The surprising finding so far is that the trust failures are not about code quality. The model writes good code. The failures cluster around **memory and continuity**: context that doesn't travel across surfaces, long sessions that silently drop agreed decisions, and reliability the user can neither see nor price. On the delegation-trust spectrum from teardown #1, this product sits at the deepest end, where the cost of being silently forgotten is highest.

*[POLLY: revisit after 2+ weeks of logging. Thesis must survive the evidence, not lead it.]*

## 2. Product overview

- **What it is:** an AI coding and general-work agent, available as a desktop CLI/app, a mobile app, and a browser extension, on a paid subscription with usage-based model tiers.
- **Who it's really for:** *[POLLY: your read. AI-native builders? PMs-who-build? Engineers offloading scaffolding?]*
- **Why they pay:** *[POLLY: your willingness-to-pay moment. What made the subscription obviously worth it?]*

## 3. Business model

Subscription plus model-tier pricing: the same product behaves differently depending on which model the user selects and pays for. See evidence 2026-07-29 (model router entry): the pricing structure itself shapes user behavior, which makes it a product surface, not just a billing detail.

## 4. Core user journey (value vs. cost, stage by stage)

Delegation pipeline: ask → agent plans → agent acts (edits files, runs commands, browses) → user reviews → work ships → *(days later: was anything silently wrong?)*

The recurring pattern from teardown #1 applies: **value is front-loaded, cost is back-loaded.** The agent's speed shows up immediately; the cost of a dropped decision or a stale memory surfaces later, when the user has stopped watching. Evidence: 2026-07-30 (compaction entry).

*[POLLY: fill per stage as the log grows.]*

## 5. Metrics analysis

- **What the product appears to optimize:** *[hypothesis: tasks completed per session? tokens? subscription retention? To investigate.]*
- **The failure mode of that metric:** a task can "complete" while silently violating an earlier agreement the context no longer contains. Completion counters can't see the review tax.
- **Draft north star:** something like *Trusted Completed Work*: work the agent finished that the user did NOT have to re-check, re-teach, or repair. Sibling of teardown #1's Trusted Qualified Applications. *[POLLY: operationalize with measurable proxies once evidence supports it.]*

## 6. Diagnosis: attribute failures to the pipeline

Early attribution from four logged incidents (see evidence log):

| Incident | Stage | Class |
|---|---|---|
| Memory doesn't travel across surfaces (07-22) | context/state | silent capability boundary |
| Outage mid-task (07-29) | infrastructure | reliability, error opacity |
| User becomes the model router (07-29) | pricing/UX | decision offloaded to user |
| Compaction drops agreed decisions (07-30) | context/state | silent degradation |

Three of four are **not** model-intelligence failures. They are state, continuity, and transparency failures. Same lesson as teardown #1: the agent's weakest link is rarely the generation step.

## 7. Recommendations (RICE, once evidence matures)

Early candidates, to be pressure-tested:
1. **Continuity contract:** before acting on long-session context, surface what the agent still remembers vs. what was compacted away, so the user can catch drops before they become wrong actions.
2. **Memory that follows the account, not the machine,** with explicit user control over what travels.
3. **Honest capability boundaries:** each surface states up front what context it does and does not have, instead of letting the user discover the boundary at the moment of need.

*[POLLY: RICE-score these only after frequency data exists.]*

## 8. Competitive landscape: the delegation-trust spectrum, extended

Teardown #1 mapped job tools by delegation depth and found sentiment inverts as automation deepens. This product extends the spectrum's deep end: more delegation than any job agent (it edits your files and speaks in your voice). Open question: does the inversion hold, or does developer tooling break the pattern because users can read the diffs? *[POLLY: compare Copilot-style autocomplete vs. agent modes vs. fully autonomous agents.]*

## 9. If I were their PM: first 90 days

*[POLLY: after the evidence matures. Likely centered on continuity trust, not model quality.]*

## 10. Where this analysis could be wrong

- n=1 heavy user with an unusual workflow (single very long sessions, multi-surface expectations); typical users may never hit these boundaries.
- The author uses the product to produce this very analysis, which risks both familiarity bias and grudge-logging. Mitigation: the log must also record delights (see open questions).
- Four incidents is a pattern hypothesis, not a pattern. Frequency data first.
- Some failures (outages, pricing tiers) may be temporary states of a fast-moving product, not structural choices.

---

*Written from real usage. Updated as the log grows.*
