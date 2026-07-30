# Portfolio Guide

For recruiters, hiring managers, and interviewers: how to read this repository in the time you have.

## If you have 2 minutes

1. [README](./README.md), top half: what this is and the flagship case in four sentences.
2. [Jobright summary](./jobright-ai/summary.md): the three strongest pieces of evidence and the proposed north star.

That's enough to know what I did and how I think.

## If you have 10 minutes

1. [Jobright summary](./jobright-ai/summary.md) (3 min)
2. [Trust Layer prototype](./prototypes/jobright-trust-layer/): open it, refuse the ungrounded resume edit, watch the gate respond (3 min)
3. Full teardown, two sections: [§5 failure attribution](./jobright-ai/teardown.md#5-diagnosis-seven-failure-modes-five-system-gaps) (why better parsing wouldn't fix the worst failures) and [§10 where this could be wrong](./jobright-ai/teardown.md#10-where-this-analysis-could-be-wrong) (2 min)
4. [Evidence index](./jobright-ai/evidence-index.md): skim the status column to see how claims and evidence stay attached (1 min)
5. [Claude Code summary](./claude-code/summary.md): the same method at an earlier maturity stage, labeled as such (1 min)

## Skills demonstrated, with receipts

| Skill | Artifact |
|---|---|
| Metric design | [TQA](./jobright-ai/teardown.md#4-metrics-analysis): trust decomposed into four conditions with measurable proxies; [TCW](./claude-code/teardown.md#4-metrics-analysis) as its sibling |
| Failure attribution | [Pipeline analysis](./jobright-ai/teardown.md#5-diagnosis-seven-failure-modes-five-system-gaps) separating perception, policy, and honesty failures |
| Evidence discipline | [Logs](./jobright-ai/evidence-log.md), [indexes](./jobright-ai/evidence-index.md), [audit method](./jobright-ai/audit-method.md) distinguishing incidents from rates |
| Prioritization under uncertainty | [Banded prioritization](./jobright-ai/teardown.md#6-recommendations-prioritized) with named assumptions and validation gates |
| Experiment design | [Validation plan](./jobright-ai/validation-plan.md) with guardrails, stopping criteria, and a falsification condition |
| Diagnosis to requirements | [Prototype](./prototypes/jobright-trust-layer/): policy, interaction logic, and edge cases in working form, plus a [changelog](./prototypes/jobright-trust-layer/README.md) of two conceptual defects an external review exposed |
| Working with engineering | [Instrumentation spec](./jobright-ai/instrumentation-spec.md): event schema, field risk classes, and tested SQL that separates a verified failure from an unverifiable one |
| Intellectual honesty | Steelman and self-falsification sections in both teardowns; epistemic labels; maturity labels |

## Strongest interview discussion topics

1. **The trust boundary:** why the submit button converts a draft problem into the user's problem, and how that reframes agent UX.
2. **Metric design under adversarial incentives:** how "applications sent" hides every documented failure, and how TQA's four conditions were chosen to be system-measurable.
3. **Attribution before investment:** why the worst failures are policy failures (generate vs. read) rather than parsing failures, and what that changes about the roadmap.
4. **The delegation-trust spectrum:** why user sentiment appears to invert with delegation depth, what moderates it (verification ability), and where the unclaimed market position is.
5. **Prioritizing without internal data:** what bands preserve that fake-precise RICE destroys, and what I'd need to recalibrate.
6. **Being wrong on purpose:** the prototype shipped two states that contradicted my own teardown (approval treated as evidence; a self-verified submission). An external review caught them, I fixed the model and published the changelog. That is the story I would tell about how I handle being wrong.

## Limitations, stated plainly

- Single-user evidence throughout; prevalence claims are explicitly not made.
- The Claude Code teardown is an early-stage hypothesis with four documented incidents; it is labeled as such everywhere it appears.
- The prototype is conceptual: no backend, no ATS integration, fictional data.
- Competitor observations rely on public signals, not hands-on audits.

## For a resume or profile

> Built a public AI-product research series analyzing AI agents from logged daily usage: documented 20+ failures across 350+ real applications of a job-application agent, designed a trust-based north-star metric with measurable proxies, attributed failures across the agent pipeline, and prototyped the resulting trust-layer concept.

LinkedIn project description:

> AI Product Teardowns: an evidence-first research series on AI agents, asking whether users can trust what an AI does on their behalf. Flagship case: a paying-user analysis of an AI job-application agent (350+ real applications, 20+ documented failures, dated evidence log), a proposed north-star metric (Trusted Qualified Applications), pipeline failure attribution, banded prioritization, a validation plan, and an interactive trust-layer prototype.

Both are factual against this repository; neither claims outcomes that did not happen.
