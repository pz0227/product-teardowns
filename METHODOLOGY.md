# Methodology

How this series is researched, written, and kept honest.

## The research method

1. **Paid, daily, real-stakes usage.** Every teardown subject is a product I pay for and rely on for consequential work. No demo tours: the incidents documented here happened inside my actual job search and my actual projects.
2. **Dated evidence logs.** Observations are recorded as dated, specific, reproducible entries ([example](./jobright-ai/evidence-log.md)). An observation becomes a finding only after it survives evidence; feelings are treated as signals worth investigating, never as proof.
3. **Evidence indexes.** Each finding carries an ID, type, confidence, status, and the teardown section it supports ([example](./jobright-ai/evidence-index.md)), so any claim can be traced back to what actually happened and when.
4. **Incidents vs. rates, never confused.** Screenshots captured at failure moments document that a failure class exists; they say nothing about frequency. Rate claims require pre-selected random samples, per the [audit method](./jobright-ai/audit-method.md). The one calculated rate in the series (43% recommendation precision) is published with its full sample (n=7), criteria, and a point-estimate warning.
5. **Analysis discipline.** Failures are attributed to pipeline stages before recommendations are made; every prioritization uses bands rather than numbers that would imply internal knowledge; every teardown contains a steelman (why a rational team ships it this way) and a self-falsification section (what would prove me wrong).
6. **Evidence maturity is labeled.** Jobright: developed directional case. Claude Code: early pattern hypothesis. The labels appear wherever conclusions do.

## Epistemic labels

Used at load-bearing claims throughout the series:

| Label | Means |
|---|---|
| **Observed** | A documented incident: dated log entry, screenshot in archive, or personally experienced event |
| **Calculated** | Derived from a documented sample; published with n, window, and method |
| **Inference** | Argued from product behavior, incentives, or evidence; not confirmed by internal data |
| **External signal** | Public source (ratings, reviews), cited with retrieval date; not independently audited |
| **Hypothesis** | Stated to be tested; carries its falsification condition where possible |

## Privacy rules

- Raw screenshots contain personal information and never enter the repository; git-ignored by policy.
- Published images require a manual redaction pass against a [written standard](./jobright-ai/img/README.md) before they appear.
- People who appear in my usage (collaborators, recruiters, referrers) are anonymized in all published material.

## AI collaboration disclosure

This repository is produced with AI assistance (Claude Code), used the way a PM uses any capable collaborator, and disclosed the same way.

**What I supply:** the product usage itself, every screenshot and logged incident, the observations and corrections, the product judgments, the willingness-to-pay decisions, the segment framings, the calls on what is a finding versus a hunch, and final approval of every claim that publishes.

**What the AI assists with:** editing and structure, diagram and prototype code, repository organization, challenging my arguments (several sections exist because the draft was pushed on), and drafting that I then correct against what actually happened.

**The rule that governs it:** **AI assisted the production process. It was never treated as a source of product evidence.** A generated sentence does not become a fact by being fluent; nothing enters an evidence log unless it happened to me, dated. Where AI-assisted analysis produced an interpretive claim I could not independently verify, it is labeled an inference or hypothesis like any other.

**Accountability:** every published conclusion is mine. If a claim in this repository is wrong, the error is my responsibility, not the tool's.

One of the teardowns in this series analyzes the AI tool used to help produce it. That is disclosed in the [Claude Code teardown](./claude-code/teardown.md) itself, treated as a bias to manage (§10.3), and, honestly, is exactly the kind of first-hand usage this method requires.
