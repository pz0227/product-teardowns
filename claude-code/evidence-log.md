# Evidence Log, Claude Code

> Rule: dated, specific, reproducible. One entry per observation. Details anonymized where personal. Same standard as the Jobright log: an observation becomes a finding only after it survives evidence.

Context for all entries: the author uses Claude Code daily as a paying subscriber, for real work (software projects, research, writing, planning), across three surfaces: the desktop CLI/app, the mobile app, and the Chrome extension.

---

## 2026-09-02, External evidence census: 88,789 public GitHub issues (CC-08)

**Method.** GitHub Search API against `anthropics/claude-code`, two passes: top 40 issues by reaction count, top 35 by comment count, plus open issues created since 2026-06-01. Public, reproducible by anyone with the same query.

**Headline result.** Of the twenty most-reacted issues, **zero are capability complaints.** The buckets, by summed reactions across those twenty: interop and platform reach ~10,300; behavioral stability and regression ~7,300; identity and account plumbing ~3,200; billing and quota ~2,400; terminal rendering ~1,700.

**By sustained discussion rather than upvotes**, billing dominates outright. `Instantly hitting usage limits with Max subscription` has 1,491 comments and has been open since 2026-01-03. `Max plan session limits exhausted abnormally fast since March 23, 2026` has 843 comments, open since 2026-03-24. Nothing else in the repository approaches these.

**Two closed issues that explain the cluster.** `Cache TTL silently regressed from 1h to 5m around early March 2026` (342 reactions) and `HERMES.md in git commit messages causes requests to route to extra usage billing instead of plan quota` (532 reactions). Both are cases where an invisible implementation detail changed what the user was billed.

**Why this matters for the teardown.** The v1 thesis, that the model is no longer the bottleneck and the state systems around it are, rested on four first-party incidents from one user. This census corroborates it from an independent, public, self-selected population. Written up as §5.5.

**Unexpected cross-teardown convergence.** Three multi-account issues total 2,338 reactions. That is the same defect as Jobright failure mode #8 logged the same day: a product modeling identity as singular and forcing an irreversible choice. Both teardowns now reference it.

**Limits, recorded so they are not lost.** Issue filers are a self-selected technical minority; silent and non-technical users are invisible. Reaction counts favor older issues, only partly corrected by the comment ranking. The bucketing is my judgment, and reclassifying the February-regression thread would move the headline. Volume is not severity.

## 2026-07-22 · Memory does not travel across surfaces

**What happened:** The desktop session holds months of working context: project state, ongoing goals, a persistent memory directory, and knowledge of the user's regular collaborators. Away from the desk, the user sent a screenshot of a message from a frequent collaborator to the mobile app, expecting a contextual reply draft. The mobile app had no idea who the person was or what the user was working on. Same account, same product name, zero shared memory.

**Why it matters:** The user discovered the boundary only at the moment of need. The "assistant that knows me" value proposition silently does not travel; each surface is a stranger wearing the same name. The workaround (re-explaining everything from scratch on mobile, or waiting until back at the desk) erases the time the assistant was supposed to save.

**Failure class:** context/state continuity · silent capability boundary

## 2026-07-29 · Platform outage breaks delegated work mid-task

**What happened:** During an active work session, multiple tool calls failed repeatedly with a generic "Server error, try again in a moment" and a pointer to a status page. Browser automation and web fetches were both affected. The task in progress (time-sensitive research the user had asked for) stalled for the better part of an hour; the agent could neither complete the work nor say when it would recover.

**Why it matters:** The more work is delegated, the more a single upstream outage costs. The failure surfaced as vague errors inside the conversation, and the user, mid-flow, could not tell whether the problem was their request, the agent, or the platform. Delegated workflows inherit infrastructure risk the user cannot see or control.

**Failure class:** reliability · error opacity

## 2026-07-29 · The user becomes the model router

**What happened:** The product exposes multiple model tiers at very different price points. Across several days the user observed meaningful quality differences between tiers on identical task types, and ended up actively managing the tradeoff: switching models mid-conversation, reserving the expensive tier for high-stakes work, and complaining that output on a cheaper tier required more correction rounds.

**Why it matters:** Cost pressure turns the user into the router. The product delegates a decision it is better positioned to make (which model does this task need?) onto the person least equipped to make it in advance. The user pays either way: in money, or in review-and-correction time.

**Failure class:** pricing/quality coupling · decision offloaded to user

## 2026-07-30 · Context compaction silently drops agreed decisions

**What happened:** In a long-running session, the product automatically compacted earlier conversation history to stay within context limits. After compaction, the agent contradicted several decisions that had been explicitly agreed earlier in the same session (established scope choices and strategy details). The user caught the regressions only because they were paying close attention, then had to re-teach the dropped decisions one by one, with visible frustration.

**Why it matters:** This is the same trust-boundary pattern documented in teardown #1: the failure is invisible at the moment it happens and surfaces later as wrong behavior the user must catch. A delegated agent that silently forgets agreements charges a review tax exactly proportional to how much was delegated to it.

**Failure class:** context/state continuity · silent degradation

---

## Open questions to keep logging

- How often does long-session compaction drop something that matters? (frequency, not just existence)
- Does the review tax shrink or grow as the user's projects get bigger?
- What does the product do WELL that keeps a dissatisfied user paying anyway? (the retention paradox from teardown #1: sentiment vs. subscription)
- Cross-surface: any case where memory DID transfer and delighted the user?
