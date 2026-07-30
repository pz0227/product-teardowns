# AI Product Teardowns: Can You Trust What an AI Does on Your Behalf?

**PM teardowns of AI agents I actually pay for, built from logged daily usage with dated evidence, not demo tours.** One question runs through the series: as AI products act for users instead of just answering them, where does trust break, and what would a PM measure and build to fix it?

## Start here (3 minutes)

1. Read the flagship case summary: **[Jobright.ai in 3 minutes](./jobright-ai/summary.md)**
2. Skim the strongest evidence: **[Jobright evidence index](./jobright-ai/evidence-index.md)**
3. See diagnosis turned into product: **[Trust Layer prototype](./prototypes/jobright-trust-layer/)** (independent concept, not affiliated)

Deeper: the [full Jobright teardown](./jobright-ai/teardown.md) (10 sections) and the [Claude Code teardown](./claude-code/teardown.md). Interviewing me? See the **[portfolio guide](./PORTFOLIO-GUIDE.md)**.

## The flagship case in four sentences

I pay for Jobright.ai, an AI agent that applies to jobs for me, and logged my usage across 350+ real applications. I documented 20+ incidents where the agent misrepresented me: a fabricated employer, an invented resume metric, a $6.5B salary expectation, a status panel claiming "form complete" over an empty resume field. Every one of these failures is invisible to the metric the product appears to optimize, applications sent: the counter increments, the dashboard looks healthy, and the cost lands weeks later in an interview where no dashboard is looking. So I designed the replacement north star (Trusted Qualified Applications), attributed every failure to its pipeline stage to show why better parsing wouldn't fix the worst ones, and prototyped the trust layer I'd build instead.

## Selected evidence

All entries dated, from my own logged usage. Full trail: [evidence index](./jobright-ai/evidence-index.md).

| Date | What the agent did | Why it matters |
|---|---|---|
| 07-08 | Filled "Name of Latest Employer" with a consulting firm I never worked at | Identity-level fact, generated instead of read |
| 07-08 | Salary expectation filled as **6500095000**: my saved 65000 to 95000 range concatenated | Confidently wrong beats visibly broken; this invites submission |
| 07-08 | "11/11 required fields filled, Submit Now" while the ATS flagged the missing resume | The status UI misreports execution state, weaponizing user trust |
| 07-07 | Tailored resume invented an "18%" improvement metric; a rewrite I couldn't explain was later probed in a real interview | Value front-loaded at apply-time, cost back-loaded at interview-time |
| 07-07 | Top-7 recommendation sample: 3 of 7 usable against my saved hard constraints (calculated: 43%) | The feed erodes trust in the layer above the agent |

## What this demonstrates

Each competency maps to a specific, inspectable artifact, not a claim:

| Competency | Where it's demonstrated |
|---|---|
| Metric & north-star design | [TQA](./jobright-ai/teardown.md#4-metrics-analysis) and [TCW](./claude-code/teardown.md#4-metrics-analysis): trust operationalized into measurable proxies |
| Failure attribution | [Pipeline attribution](./jobright-ai/teardown.md#5-diagnosis-seven-failure-modes-five-system-gaps): why the worst failures aren't parsing problems |
| Evidence discipline | Dated [logs](./jobright-ai/evidence-log.md) and [indexes](./jobright-ai/evidence-index.md); observed vs. calculated vs. inferred kept distinct |
| Prioritization & tradeoffs | [Banded prioritization](./jobright-ai/teardown.md#6-recommendations-prioritized) with stated assumptions; steelman sections in both teardowns |
| From diagnosis to requirements | [Trust Layer prototype](./prototypes/jobright-trust-layer/): read-never-generated policy, resume diff, submission gate |
| Experiment design | [Validation plan](./jobright-ai/validation-plan.md): research questions, methods, a staged experiment with falsification criteria |
| Intellectual honesty | "Where this analysis could be wrong" sections; evidence-maturity labels below |

Not claimed here: stakeholder management, engineering leadership, or shipped business impact. This is independent research and concept work.

## Teardowns

| Product | Industry | Evidence maturity | One-line thesis |
|---|---|---|---|
| <img src="https://www.google.com/s2/favicons?domain=jobright.ai&sz=64" width="20" height="20" align="center"> **[Jobright.ai](./jobright-ai/summary.md)** · [full](./jobright-ai/teardown.md) · [site ↗](https://jobright.ai) | Career & HR | **Developed directional case**: sustained heavy usage, 20+ documented incidents, dated log | Optimized for "applications sent," but the real prize is being the agent users trust to represent them when they're not watching. |
| <img src="https://www.google.com/s2/favicons?domain=claude.ai&sz=64" width="20" height="20" align="center"> **[Claude Code](./claude-code/summary.md)** · [full](./claude-code/teardown.md) · [site ↗](https://claude.com/claude-code) | Developer tools | **Early pattern hypothesis**: 4 documented incidents, logging ongoing | The model may no longer be the bottleneck: every logged trust failure so far is memory, continuity, or transparency, not generation quality. |

## Method

Every teardown starts from paid daily usage and cites a dated evidence log. Claims carry their epistemic status: observed, calculated, inferred, externally sourced, or hypothesis. Feelings are treated as signals worth investigating; only evidence gets to be proof. Structure template [here](./TEMPLATE.md), full method and epistemic rules in [METHODOLOGY.md](./METHODOLOGY.md).

I studied psychology and statistics before product, and this repo is that combination at work: psychology is why every teardown starts with something that *feels* off; statistics is why a feeling only earns its place after it survives evidence.

## AI collaboration

Built with AI assistance, used transparently: I supplied the product usage, screenshots, observations, judgments, corrections, and final approval on every claim; Claude Code assisted with editing, organization, diagrams, and challenging my arguments. **AI assisted the production process. It was never treated as a source of product evidence.** Full disclosure in [METHODOLOGY.md](./METHODOLOGY.md#ai-collaboration-disclosure).

## Who am I

**Polly Zheng**, AI Product Manager · psychology + statistics @ Penn. Chasing the "users actually love it" feeling, and learning in public.

[**LinkedIn**](https://www.linkedin.com/in/jh-zheng0227/) · [**GitHub**](https://github.com/pz0227) · [**X** @pollyyyyyyy_z](https://x.com/pollyyyyyyy_z)
