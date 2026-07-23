# Product Teardowns

**PM teardowns of AI products I actually pay for, built from logged daily usage, not demo tours.** Feelings as signals, evidence as proof.

Every claim traces to a dated observation. The recurring question: *can users trust what an AI does on their behalf?* The occasional classic product shows up too, since good fundamentals transfer.

> **Start here:** the [Jobright.ai teardown](./jobright-ai/teardown.md), a paying user's analysis of an AI job-application agent across 350+ real applications, 20+ documented failures, a new north-star metric, and a competitive read on why nobody has shipped trustworthy AI delegation yet.

## Teardowns

Sorted alphabetically. Each folder contains the full teardown plus a dated evidence log.

| Product | Type | Industry | Status | One-line thesis |
|---|---|---|---|---|
| <img src="https://www.google.com/s2/favicons?domain=jobright.ai&sz=64" width="20" height="20" align="center"> **[Jobright.ai](./jobright-ai/teardown.md)** · [site ↗](https://jobright.ai) | AI copilot · SaaS | Career & HR | 📖 Living analysis · v2 | Optimized for "applications sent," but the real prize is being the agent users trust to represent them when they're not watching. |

### What's inside the Jobright teardown

A paying user's analysis of an AI job-application agent, built from logged daily usage across 350+ real applications:

- **A metric diagnosis**: why "applications sent" explains every failure I found, and the north-star redesign (Trusted Qualified Applications) I'd replace it with, each condition with a system-measurable proxy.
- **Failure attribution across the agent's pipeline** (with a diagram): the worst failures live in value-generation and state-verification, not parsing, so "better parsing" wouldn't fix them.
- **A steelman** of why a rational team ships this, and where the tradeoff expires.
- **Prioritized fixes with RICE**, a competitive landscape (the delegation-trust spectrum), a 90-day execution plan, and an honest section on where my own analysis could be wrong.

## Why I do this

I studied psychology and statistics before product, and this repo is that combination at work.

**Psychology is how every teardown starts.** Something *feels* off: a flow that confuses, a field that quietly lies on your behalf, an answer that doesn't sound like you. I treat that feeling as a real signal worth investigating, not a complaint.

**Statistics is why you can trust what's written here.** A feeling only earns its place after it survives evidence: sampled real usage, dated logs, labeled failures, traced back to the metric the product is (implicitly) optimizing. An idea with evidence beats an opinion said louder.

And honestly, I can't use an app anymore without mentally taking it apart. Might as well write it down, and learn in public.

## How each teardown works

Every teardown starts from real usage and cites its own dated evidence log. No vibes-only claims: an observation becomes a finding only after it survives evidence. See the [structure template](./TEMPLATE.md).

## Who am I

**Polly Zheng**, AI Product Manager · psychology + statistics @ Penn

Chasing that "users actually love it" feeling, and learning in public.

[**LinkedIn**](https://www.linkedin.com/in/jh-zheng0227/) · [**GitHub**](https://github.com/pz0227) · [**X** @pollyyyyyyy_z](https://x.com/pollyyyyyyy_z)
