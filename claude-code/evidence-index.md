# Evidence Index, Claude Code

Every finding used in the [teardown](./teardown.md), with type, status, and confidence. The evidence base here is deliberately small and labeled as such: **four documented incidents, one heavy user, logging ongoing.** No screenshots are published for this teardown yet; entries derive from session records, anonymized before publication.

**Evidence types:** Observed · Calculated · Inference · External signal · Hypothesis
**Status:** Documented (dated log entry) · Hypothesis (argued, awaiting evidence)

| ID | Date (2026) | Finding | Type | Confidence | Supports | Status |
|---|---|---|---|---|---|---|
| CC-01 | 07-22 | Mobile app had no knowledge of context and collaborators the desktop session holds; same account, no shared memory, boundary discovered at moment of need | Observed | High (personally experienced, same-day logged) | §3 stage 2, §5 | Documented |
| CC-02 | 07-29 | Repeated generic "server error" failures across browser and fetch tools mid-task; work stalled; no recovery estimate available in-product | Observed | High | §5 | Documented |
| CC-03 | 07-29 | Meaningful output-quality differences across paid model tiers on similar tasks; user managed cost/quality by switching models mid-conversation | Observed | Medium (comparative judgment, not blind-tested) | §2, §5 | Documented |
| CC-04 | 07-30 | After automatic context compaction, agent contradicted decisions explicitly agreed earlier in the same session; user re-taught them one by one | Observed | High (multiple concrete instances in one session) | §3 stage 6, §5, TL;DR | Documented |
| CC-05 | 07-30 | "The model is no longer the bottleneck": all four incidents attribute to state/continuity/transparency, none to generation quality | Inference from CC-01..04 | Medium (n=4; falsifiable as stated in teardown §5) | TL;DR, §5 | Hypothesis |
| CC-06 | 07-30 | Sentiment patterns across the delegation spectrum (autocomplete loved, autonomous agents skeptically received) | External signal, directional | Low-Medium (public sentiment reads, no structured review analysis yet) | §8 | Hypothesis, flagged as weakest link in teardown §10.5 |
| CC-07 | 07-30 | Product strategic direction (expansion beyond code toward general work) | Inference from public product surface area | Medium | §1, §8 | Hypothesis |

## Reading notes

- CC-05 is the teardown's thesis and is deliberately indexed as an **inference, not an observation**. The falsification condition is stated in teardown §5: a run of pure generation failures would break it.
- Open logging questions (frequency of compaction loss, delights as well as failures, cross-surface successes) are tracked at the end of the [evidence log](./evidence-log.md).
