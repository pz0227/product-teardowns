# Claude Code Teardown: When the Model Stops Being the Bottleneck

> **Status:** 📖 Living analysis · v2.1 (2026-09-15) · **Evidence maturity: hypothesis corroborated externally, now tracked over time** (4 documented first-party incidents, one user, plus a public-issue census re-run 13 days apart: 88,789 issues on 09-02, 91,795 on 09-15)
> Written from a month of daily paid usage across three surfaces, with a [dated evidence log](./evidence-log.md) and an [evidence index](./evidence-index.md). Same rules as [teardown #1](../jobright-ai/teardown.md): feelings as signals, evidence as proof, roast the tradeoff, not the team. Claims are labeled: **Observed** = documented incident · **Inference** = argued from evidence, not proven · **External signal** = public source · **Hypothesis** = stated to be tested.

## TL;DR

Claude Code is the deepest AI delegation I practice daily: an agent that edits my files, runs my commands, browses on my behalf, and drafts words that ship under my name. After a month of daily use, the surprising finding is that **none of my logged trust failures are about code quality.** The model writes good code. Every documented failure is about **memory, continuity, and transparency**: context that does not travel across surfaces, long sessions that silently drop agreed decisions, outages that surface as vague errors mid-task, and a pricing structure that quietly makes the user do the model routing.

*(v2 update: I tested this thesis against 88,789 public GitHub issues. Zero of the twenty most-reacted are capability complaints, and the two most-commented threads in the entire repository are both about quota the user cannot see. See §5.5.)*

*(v2.1 update: I re-ran the same query 13 days later. 3,214 new issues, and the largest new cluster is the permission system refusing safe actions, including in the mode users enable to stop being asked. That is a guardrail failing in the direction almost nobody measures. See §5.6.)*

The thesis: **frontier agents have moved the bottleneck.** The generation step is now the strongest link in the chain. The weakest links are the state systems around it, and those failures follow the exact pattern documented in teardown #1: value lands immediately, cost lands later, precisely where the product's own metrics cannot see it. The one fix I would ship first: a continuity contract, where the agent discloses what it still remembers and what it has lost, before it acts on a long session's context.

## 1. Product overview

**What it is.** An agentic AI assistant that started as a coding tool and has become a general work agent. Unlike chat assistants that produce text for the user to apply, Claude Code acts directly: it reads and edits real files, executes shell commands, runs tests, browses the web, and connects to external tools. It is available as a desktop CLI and app, a mobile app, and a browser extension, under one product name and one account.

**Who it is really for.** Three segments emerge from usage:

1. **Engineers offloading implementation**, the original audience: scaffolding, refactors, test suites, migrations.
2. **AI-native builders who are not career engineers**, PMs, analysts, founders who can now ship working software they could not have written alone. The author is in this segment.
3. **Knowledge workers using it far beyond code**: research, writing, planning, personal operations. The product's own trajectory (mobile app, browser extension, general-purpose tooling) shows the company chasing this expansion.

The segmentation matters because **verification ability differs sharply by segment.** An engineer can read every diff. Segment 2 can partially verify. Segment 3 often cannot verify at all, and, as argued in section 8, the product's expansion moves its center of gravity toward exactly the users least able to check its work.

**Why they pay.** The willingness-to-pay moment is the first time a vague request becomes working, tested, committed software without the copy-paste loop of a chat assistant. The value is not text generation. It is **closed-loop execution**: the agent does the work, verifies it, and shows the receipt. That loop is genuinely category-defining, which is exactly why its trust failures deserve a serious look.

## 2. Business model

A paid subscription with tiered plans, where higher tiers unlock more usage and stronger models, plus model selection inside a session at very different effective price points.

Two structural observations:

1. **The subscription sells continuity, but continuity is the weakest feature.** What justifies a monthly relationship over pay-per-task is an assistant that accumulates context about you. Yet accumulated context is precisely what fails in the logged incidents (cross-surface fragmentation, compaction loss). The business model writes a check the memory architecture does not yet cash.
2. **Model tiers convert a product decision into a user burden.** When output quality differs meaningfully across tiers, the user must predict, per task, which model is worth the cost. Evidence entry 2026-07-29: the user ends up switching models mid-conversation, hoarding the expensive tier for high-stakes work, and paying for misjudgments in correction rounds. The product is better positioned than the user to route tasks to capability; today, the user is the router.

## 3. Core user journey: value vs. cost, stage by stage

The delegation pipeline, with where value lands and where cost quietly settles:

| Stage | What happens | Value delivered | Where it quietly hurts |
|---|---|---|---|
| 1. Ask | User states a goal in plain language | Zero translation cost to "software-speak" | Ambiguity absorbed silently; agent may resolve it differently than the user assumed |
| 2. Plan | Agent proposes an approach | Visible reasoning, feels controllable | Plans reference context the user cannot audit (what does it still remember?) |
| 3. Act | Files edited, commands run, web browsed | The category-defining magic: closed-loop execution | Actions based on stale or compacted context execute confidently anyway |
| 4. Review | User checks diffs and outputs | Diffs make code verifiable | Non-code outputs (plans, posts, decisions) have no diff view; verification depends on user memory |
| 5. Ship | Work goes out under the user's name | Throughput a solo human cannot match | The trust boundary from teardown #1: after shipping, an error is no longer a draft problem, it is the user's problem |
| 6. Later | Days pass, sessions continue | Compounding productivity | The review tax: silently dropped decisions resurface as wrong behavior the user must catch (evidence 2026-07-30) |

The shape is identical to teardown #1: **value front-loaded, cost back-loaded.** The difference is depth. A job agent drafts applications; this agent executes. When delegation is deeper, the same class of silent failure costs more.

## 4. Metrics analysis

**What the product appears to optimize.** From the outside: task completion, session throughput, and subscription retention. Every visible design choice (fast execution, capable defaults, generous autonomy) serves "the agent finished the thing."

**The failure mode of that metric.** A task can complete flawlessly while violating an agreement the context no longer contains. Completion counters cannot see re-taught decisions, re-checked outputs, or the user's growing habit of re-verifying what they already settled. In teardown #1 terms: the metric measures motion at the moment of action, while the real outcome (did the user have to pay a review tax later?) lives weeks downstream where no dashboard is looking.

**Proposed north star: Trusted Completed Work (TCW).** Work counts toward TCW only if all four hold:

1. **Completed**: the task actually finished (current metric, kept).
2. **Consistent**: no earlier in-session or in-memory agreement was violated.
3. **Continuous**: decisions survived session boundaries, compaction, and surface switches.
4. **Not reworked**: the user did not have to correct or re-teach it within a defined window.

**Measurable proxies, so this is operational rather than vibes:**

- *Post-compaction contradiction rate*: how often the agent's behavior conflicts with a pre-compaction agreement in the same session. Detectable by sampling long sessions.
- *Re-teach frequency*: how often users restate something they already established. Detectable from repeated-instruction patterns.
- *Cross-surface context miss rate*: sessions on a second surface that immediately re-explain context the first surface held.
- *Correction rounds per completed task*, trended by tenure: if trust is growing, this falls over time; a flat or rising curve means users are paying the review tax indefinitely.

**Guardrail metrics:** completion speed and task throughput must not degrade more than marginally; a perfectly consistent agent that is slow loses the very value users pay for.

## 5. Diagnosis: attribute the failures before prescribing

Four dated incidents, attributed across the pipeline:

| Incident (log date) | Pipeline stage | Failure class | Model intelligence involved? |
|---|---|---|---|
| Memory does not travel across surfaces (07-22) | Context/state | Silent capability boundary | No |
| Outage breaks delegated work mid-task (07-29) | Infrastructure | Reliability, error opacity | No |
| User becomes the model router (07-29) | Pricing/UX | Decision offloaded to user | No |
| Compaction silently drops agreed decisions (07-30) | Context/state | Silent degradation | No |

**Four for four, the model's intelligence is not the failing component.** This is the same attribution lesson as teardown #1, where the worst failures lived in value generation and state verification rather than parsing: fixing the obvious component (make the model smarter) would not have prevented a single logged incident. The binding constraint has moved to the state layer: what the agent remembers, what it discloses about what it remembers, and what happens to agreements at system boundaries (surfaces, sessions, compaction events).

**The root cause behind the pattern, stated as a hypothesis:** the product's architecture treats context as an implementation detail to be managed invisibly (compact it, scope it per machine, let tiers vary), while the user experiences context as **the relationship itself.** Every place those two views collide produces a logged incident. This hypothesis is falsifiable: if future logging shows frequent trust failures that are pure generation errors, it weakens; if failures keep clustering at state boundaries, it strengthens.

## 5.5 External signal: what 88,789 public issues say about where the bottleneck is

*(External signal. Retrieved 2026-09-02 via the GitHub Search API against `anthropics/claude-code`. Public, reproducible, and not curated by me.)*

Section 1 through 5 argue a thesis from four incidents in one person's usage: **the model is no longer the weak link; the state systems around it are.** That is a hypothesis with an obvious weakness, which is that one user's month is not a market. So I went and checked it against the largest public record of what this product's users actually complain about.

The repository carries **88,789 issues**. Here are the twenty most-reacted, bucketed by what kind of promise is being broken.

| Bucket | Reactions across top-20 issues | Representative issue |
|---|---|---|
| **Interop and platform reach** | ~10,300 | `Feature Request: Support AGENTS.md` (6,559 reactions) |
| **Behavioral stability, not capability** | ~7,300 | `Claude Code is unusable for complex engineering tasks with the Feb updates` (3,286) |
| **Identity and account plumbing** | ~3,200 | `Multi-account switching without shared email` (929) |
| **Billing, quota, and pricing** | ~2,400 | `Instantly hitting usage limits with Max subscription` (724) |
| **Terminal rendering** | ~1,700 | `Console scrolling top of history` (822, open since April 2025) |
| **"The model cannot do the task"** | **0** | none in the top 20 |

**The finding that matters: not one of the twenty most-reacted issues is a capability complaint.** Nobody in that set is saying the model writes bad code. The four model-related entries are all about *behavioral change* (a February update degrading long-horizon work, a deprecated model people want back, rhetorical tics, reflexive agreement), not about the ceiling of what it can do.

That is the thesis of this teardown, stated by thousands of strangers instead of by me.

**Reactions favor age; comments measure sustained pain.** An issue open since August 2025 has had twelve months to collect upvotes, so the interop bucket's lead is partly an artifact of time. Ranking by comment volume instead gives a different and sharper answer, and one cluster dominates outright:

| Issue | Comments | Opened | State |
|---|---|---|---|
| Instantly hitting usage limits with Max subscription | **1,491** | 2026-01-03 | open |
| Max plan session limits exhausted abnormally fast since March 23 | **843** | 2026-03-24 | open |
| Phone verification | 742 | 2026-03-14 | open |
| Unusable for complex engineering tasks with the Feb updates | 583 | 2026-04-02 | closed |

Two billing threads carry 2,334 comments between them and both are still open eight months later. Nothing else in the repository is close.

### Why the billing cluster is the same failure this teardown already describes

It would be easy to file "usage limits" under pricing and move on. It is not a pricing problem. Look at what the two most instructive closed issues actually say:

- **`Cache TTL silently regressed from 1h to 5m around early March 2026, causing quota and cost inflation`** (342 reactions).
- **`HERMES.md in git commit messages causes requests to route to extra usage billing instead of plan quota`** (532 reactions).

In both, an internal implementation detail changed what the user was charged, and the user had no instrument that could have shown it. Publicly reported alongside these, users [reverse-engineered the Claude Code binary](https://mlearning.substack.com/p/why-every-claude-code-power-user-is-secretly-broke) to find a caching bug inflating token consumption, and [The Register covered the dispute](https://www.theregister.com/2026/01/05/claude_devs_usage_limits/) over surprise limits.

That is precisely the pattern this teardown and [teardown #1](../jobright-ai/teardown.md) both describe: **value lands immediately and visibly, cost lands later in a channel the user cannot audit.** The session felt productive. The quota is gone. The user cannot reconstruct which turn spent it, so the complaint arrives as a feeling of unfairness rather than as a bug report, which is exactly why one thread accumulates 1,491 comments instead of getting fixed and closed.

The generalization across both teardowns:

> An agent that consumes a metered resource on your behalf owes you a meter. Not a total after the fact, an itemized, per-action reading you can watch while it spends.

Jobright spends the user's reputation and shows a count of applications. Claude Code spends the user's quota and shows a percentage. In both cases the unit displayed is not the unit that matters.

### The identity cluster is a failure I have now seen in two different products

Three separate issues asking for multi-account support total 2,338 reactions: [mobile](https://github.com/anthropics/claude-code/issues) (929), desktop (899), and per-connector accounts (510). Users have a work identity and a personal identity, and the product assumes one human equals one account.

I hit the structurally identical defect in Jobright the same week, from the opposite direction. There, one email address is simultaneously the contact on my résumé, the key to the saved autofill profile, and the primary key on every employer-side account the agent creates for me. Three roles with wildly different reset costs, collapsed into one string I cannot rotate. *(Logged 2026-09-02, being written up for [teardown #1](../jobright-ai/teardown.md) once I have the artifacts to support it.)*

Different products, same mistake. **Identity is plural, and products that model it as singular force an irreversible choice onto the user.** In Claude Code the cost is friction, logging out and back in. In an agent that writes accounts to third parties on your behalf, the same mistake is unrecoverable.

I did not expect these two teardowns to converge here, and the convergence is the most useful thing I got out of writing both.

### What this evidence does not establish

- **Selection bias runs the whole way through.** People who file GitHub issues are a self-selected, technical, English-speaking minority of users. Silent satisfied users are invisible here, and so are non-technical users, who by section 1's segmentation are the fastest-growing group and the least able to verify the agent's work at all.
- **Reaction counts are confounded by issue age**, stated above and only partly corrected by the comment ranking.
- **Bucketing is mine.** Someone else could reasonably file the February-regression thread under capability rather than stability. I would argue the issue text is about a change in behavior, but it is a judgment call and it moves the headline number.
- **Volume is not severity.** A rendering bug that annoys thousands may cost far less than a continuity failure that silently corrupts one person's work, which is the failure class my own evidence log actually contains.

What the census does establish is narrower and still worth having: **the public record of this product's complaints is overwhelmingly about packaging, not intelligence.** That is the claim this teardown opened with, and I no longer have to rest it on four incidents.

## 5.6 The 13-day re-run: the guardrail is now failing on false positives

> **External signal**, re-run of the §5.5 query on 2026-09-15. Same repository, same method, 13 days later.

**What changed at the top line.** The repository went from 88,789 issues to **91,795**, with **3,214 created since 2026-09-02**, about 230 a day. The two billing threads from §5.5 are both still open and still the most-discussed in the repository (725 reactions / 1,494 comments, and 545 / 853). Nothing about the quota-visibility finding has been resolved; it has just kept accumulating.

**The most-reacted new issue is still not a capability complaint.** It is [*"Mods, make Claude 10x more extensible"*](https://github.com/anthropics/claude-code/issues/91870) (175 reactions, 181 comments, opened 09-03). Users are not asking the model to be smarter. They are asking for more control over the harness around it. That is the v1 thesis stated by the users themselves.

### The new cluster: deny rules firing on safe commands

Searching the repository for permission and deny-rule issues opened since 2026-08-15 returns **308 matches**. Inside the top twenty by reactions, ten are the same defect wearing different hats, nearly all filed on 09-02 and 09-03, nearly all still open, and all pointing at versions 2.1.257 through 2.1.259:

| Reactions | Issue |
| --- | --- |
| 58 | Bash cd-compound-read guard prompts on absolute `cd` targets whenever a `Read()` deny rule exists |
| 26 | **`bypassPermissions` mode now prompts** on `cd DIR && grep …` when a `Read()` deny rule is configured |
| 18 | `Read()` deny rules prompt on `cd` compounds even when the target is a literal path |
| 13 | **Auto mode still prompts** for grep authorization despite being in Auto mode *(closed)* |
| 12 | `Read()` deny rules force manual approval on unrelated `grep` commands after `cd` with a relative glob |
| 10 | `Read(**/.env)` deny rule prompts on every `rg` directory search, though `rg` skips hidden files by default |
| 8 | `grep -r` with `--include` filters falsely triggers a `Read(.env)` deny prompt |
| 7 | `Read()` deny rule arms an unwhitelistable `cd`+relative-read prompt in `bypassPermissions` |
| 6 | Read-only Bash compounds starting with `cd DIR` lost static auto-approval in 2.1.258 |
| 4 | `rg` reading stdin in a pipeline is treated as a search of `.` and prompts |

**162 reactions across ten issues, and every single one is the permission system stopping something it should have allowed.**

### Why this matters more than it looks

A permission system has two failure modes, and they are not symmetric in how much attention they get:

- **False negative:** it allows an action it should have stopped. This is what safety reviews are built to catch.
- **False positive:** it stops an action it should have allowed. This is what determines whether the system is still switched on a month later.

Almost every conversation about agent guardrails is about the first one. **The second is the one that actually decides the outcome**, because a guardrail that fires on `cd src && grep -r TODO` teaches the user to reach for `bypassPermissions`. And the sharpest issue in the cluster is that **`bypassPermissions` prompts too**. So the escape hatch also failed. That is the worst available state: the user has already disabled their own protection, and is *still* being interrupted.

Two of the adjacent issues make the same point from the mode side rather than the rule side: Auto mode's bash-first instruction pushes `sed` and heredoc edits instead of the Edit and Write tools (38 reactions), and silently disables nested `CLAUDE.md` and path-scoped rules (16). A mode the user turned on for convenience is quietly changing which rules apply.

### The metric I would ship for this

The permission system currently reports nothing about its own accuracy. I would publish two numbers, per rule:

1. **Prompt acceptance rate.** Of the prompts this rule generated, what share did the user approve? **If a rule is approved 99% of the time, it is not asking a question. It is adding a keystroke,** and it should be auto-approved or rewritten.
2. **Bypass rate.** What share of sessions with this rule configured are run in `bypassPermissions` or Auto mode? A rule with a high bypass rate is not protecting anyone; it is the reason protection got turned off.

A guardrail without a false-positive rate is not a measured system, it is a hope. I hit exactly this building the eval for Kapi, my own analytics agent, which is why that eval scores **false refusals as their own dimension**, separate from missed refusals, and why the deterministic routing layer was tested for **false fires** and not only for correct ones. Precision and recall are both real. A safety system that only measures one of them gets disabled by its own users.

### What this re-run does not establish

Thirteen days is a short window, and a cluster of near-identical issues filed on two consecutive days is more likely to be one regression than a standing property of the product. Several are already closed. The honest reading is that this is a **regression in one version band**, not a permanent design failure. What makes it worth writing down is not the bug. It is that the product had no published measure that would have caught it, and the users had to catch it for them, ten times over.

## 6. The steelman: why a rational team ships it exactly this way

The teardown rule: explain the builder before judging them.

1. **Compaction is forced, not chosen.** Context windows are finite; long sessions must shed something. Summarize-and-continue is a reasonable engineering answer, and most sessions are probably short enough never to hit the boundary. The users who hit it hardest (marathon sessions, standing instructions accumulating for weeks) are the power-user tail, and you do not optimize v1 for the tail.
2. **Machine-local memory is a defensible privacy stance.** Keeping accumulated context on the user's machine rather than syncing it through the cloud is a real data-control position, and likely the right default for the enterprise trust this company sells. The failure is not the architecture; it is that the boundary is undisclosed until the user trips over it.
3. **Model tiers give professionals control.** Serious users genuinely want to choose cost-quality tradeoffs; a product that auto-routed every task would face its own distrust ("which model did I just pay for?"). Exposing the choice is honest. The failure mode is only that the product offers no assistance in making it.
4. **In a land-grab market, shipping beats polishing.** The agentic-coding category is moving at extraordinary speed, and the team is visibly prioritizing capability expansion. Continuity infrastructure is classic important-not-urgent work; deferring it is what almost every rational team does under competitive pressure.

**Where the tradeoff expires.** Each of these choices was sound when sessions were short, work stayed on one machine, and the product was a coding tool for diff-reading engineers. The product's own success is breaking all three assumptions: sessions now run for days, users move across three surfaces, and the audience increasingly cannot read the diffs. A tradeoff made for yesterday's usage pattern is quietly becoming today's trust ceiling.

## 7. Recommendations, prioritized

Banded rather than numerically scored: an external user does not know this team's architecture or how many subscribers run long sessions, and precise reach or engineer-month figures would imply otherwise. Reach here is conditional ("of users who..."), impact is when-hit severity, and evidence strength is honest about the n=4 base.

| # | Fix | Reach | Impact | Evidence strength | Est. effort | Reversibility | Decision |
|---|---|---|---|---|---|---|---|
| 1 | **Continuity contract**: on compaction, disclose what was kept vs. dropped, and let the user pin decisions that must survive | High among long-session users; share of base unknown | Critical when hit (silent wrong actions) | Directional (CC-04, single user, multiple instances) | Small-Medium (display + pinning, no new memory infra) | Easy | **Now** (as a proposal) |
| 2 | **Capability disclosure per surface**: each surface states what context it does and does not have, instead of failing silently | High among multi-surface users | High (prevents misplaced expectations) | Directional (CC-01) | Small (honesty about absence, not syncing) | Easy | **Now** (as a proposal) |
| 3 | **Task-aware model routing assist**: recommend a tier per task with a one-line rationale, user keeps override | Medium (multi-tier users) | Medium (money and correction time) | Weak-Directional (CC-03, comparative judgment) | Medium | Easy | **Validate first** (do users want the recommendation, or resent it?) |
| 4 | **Portable memory, opt-in**: account-level memory that travels across surfaces, user controls what syncs | Medium | Critical (the real fix for CC-01) | Directional | Large (privacy architecture, sync conflicts, enterprise review) | Difficult | **Validate first**, sequenced after 1 and 2 prove demand |
| 5 | **Session decision ledger**: user-visible standing agreements the agent maintains across a project | Medium | High | Directional (overlaps CC-04) | Medium | Easy | **Later**: ship 1 first, promote if pin-usage shows demand |

**What first and why:** 1 and 2, because they are honesty features rather than capability features: they require no new memory infrastructure, only stopping the product from implying continuity it does not have. Same ordering logic as teardown #1: fix disclosure before capability.
**The assumption that could change the decision:** frequency. If instrumented data showed compaction loss affecting a tiny fraction of sessions, recommendation 1 drops to a power-user setting; disclosure (2) stays justified at any frequency.
**What needs validation before engineering commitment:** whether pinning gets used (demand signal for 4), and the interruption cost of disclosure moments.

## 8. Competitive landscape: extending the delegation-trust spectrum

Teardown #1 mapped job-application tools by delegation depth and found that **user sentiment inverts as automation deepens**: the tools people love most do the least. Extending the same spectrum into coding agents:

| Delegation depth | Product archetype | User verification ability | Sentiment pattern |
|---|---|---|---|
| Autocomplete | Copilot-style inline suggestions | Total (every token visible pre-accept) | Broadly loved |
| IDE agent | Cursor-style scoped edits | High (diffs in editor, bounded scope) | Strong but polarizing at agent mode |
| Full environment agent | **Claude Code**: files, shell, browser, multi-surface | Partial, and falling as non-code use grows | Passionate users AND a visible review-tax discourse |
| Autonomous engineer | Devin-style fire-and-forget | Low | Most skeptical reception in the category |

Two observations:

1. **The inversion broadly holds, with one nuance: verification ability moderates it.** Coding agents get away with deeper delegation than job agents at the same depth because diffs make verification cheap. Trust does not track what the agent does; it tracks **what the user can check.**
2. **Which makes the product's own expansion its biggest trust risk.** Claude Code is growing beyond code into exactly the work that has no diff view: research, plans, prose, decisions. Every step of that expansion moves it down the verification axis toward the zone where, per teardown #1, sentiment inverts hardest. The company that solves verifiable delegation for non-code work (the "diff for a decision") owns the next position on this spectrum. Nobody holds it yet.

## 9. If I were their PM: the first 90 days

Framed honestly: **what I would propose to validate with the team.** I don't know this team's staffing, architecture, or existing telemetry; each phase ends in a decision their real data would make. Scoped to one workstream: continuity trust.

**Days 1-30 · Measure the review tax**
- *Objective:* give the problem a size instead of a vibe.
- *Key actions:* instrument the §4 proxies (post-compaction contradiction rate, re-teach frequency, cross-surface context misses, correction rounds by tenure); sample long sessions; interview power users about what they re-verify and why.
- *Involves:* data/telemetry engineering, user research.
- *Decision at exit:* is continuity loss frequent enough to justify product work, or is it a power-user tail issue?
- *Exit criterion:* baseline numbers for the four proxies on a dashboard.
- *Risk:* the data shows my n=4 pattern is rare. Good outcome; disclosure (phase 2) survives at any frequency, the rest gets rescoped.
- *Not building yet:* anything user-facing.

**Days 31-60 · Ship disclosure**
- *Objective:* convert silent degradation into visible, correctable moments.
- *Key actions:* per-surface capability statements (recommendation 2); compaction announcement with a retained-decisions summary (first half of recommendation 1), behind a flag to a cohort.
- *Involves:* product, design (the disclosure moment must inform without interrupting flow), engineering.
- *Decision at exit:* does re-teach frequency fall in sessions where disclosure fired?
- *Metrics:* re-teach frequency (target: falling), disclosure-moment dismissal rate (guardrail for annoyance).
- *Exit criterion:* cohort delta on re-teach frequency, in either direction, with enough volume to read.
- *Risk:* disclosure reads as noise and users dismiss it unread; the design answer is placement and brevity, and the rollback is a flag.
- *Not building yet:* memory sync, decision ledger.

**Days 61-90 · Ship control, decide on memory**
- *Objective:* give users agency over what survives, and gather the demand signal for the big investment.
- *Key actions:* decision pinning (second half of recommendation 1); run TCW shadow-scored against existing completion metrics; write the portable-memory go/no-go memo with pin-usage as the demand evidence.
- *Involves:* product, data, and, for the memory memo, security/privacy review.
- *Decision at exit:* does portable memory (recommendation 4) earn its heavy investment now, later, or not at all?
- *Exit criterion:* the memo, with cohort evidence attached.
- *Risk:* pinning is loved by a loud few and ignored by most; the memo must weigh intensity against breadth honestly.
- *Not building in these 90 days:* memory sync itself. Shipping continuity promises before continuity infrastructure is how the trust gap opened in the first place.

## 10. Where this analysis could be wrong

1. **n=1, and a tail-shaped n=1.** One heavy user running unusually long sessions across three surfaces. Typical users may never hit a compaction boundary or open the mobile app. De-risk: the open-questions section of the log now tracks frequency, and the analysis flags every frequency claim as a hypothesis.
2. **Four incidents is a pattern hypothesis, not a pattern.** The attribution table is suggestive, not statistical. De-risk: keep logging; the thesis is falsifiable (a run of pure generation failures would break it).
3. **The author uses the product to produce this analysis.** Familiarity bias in both directions: over-forgiving from affection, over-logging from proximity. De-risk: the log's standing rule now requires recording delights as well as failures, and the retention paradox (dissatisfied users who keep paying, including this one) is treated as data, not hypocrisy.
4. **A fast-moving target.** This product ships weekly; any specific failure may already be roadmapped, and pricing or memory architecture may change under this analysis. De-risk: claims are dated, and the document is versioned as a living analysis rather than a verdict.
5. **The verification-moderates-trust claim (section 8) rests on public sentiment reads**, not primary research across products. De-risk: flagged as the weakest link in the argument; a structured comparison of user reviews across the four archetypes is the natural Week-3 follow-up.

---

*Written from real usage, updated as the [evidence log](./evidence-log.md) grows. Teardown #1, on an AI job-application agent, is [here](../jobright-ai/teardown.md).*
