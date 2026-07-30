# Usability Test Plan: Trust Layer Prototype

The next thing this concept needs is not more analysis. It needs people who are not me to use it and disagree with it. This is the script I would run, written to be runnable by anyone, including me, this week.

**Status: not yet run.** No findings exist. When they do, they go in a Findings section below, including the parts that contradict the current design.

## What I am actually trying to learn

The prototype encodes four bets. Each one could be wrong, and each has a question that would expose it:

| The bet | The question that tests it | What "wrong" looks like |
|---|---|---|
| Users want the agent to stop and ask on identity facts | When it pauses, do they resolve it or resent it? | They call the pause annoying and say they would rather fix errors afterward |
| Provenance labels communicate something useful | Can they say, unprompted, what "user-asserted" means for their application? | The labels read as decoration, or worse, everything looks equally trustworthy |
| The acknowledgment step protects people | Faced with the invented resume claim, do they read the warning or click through it? | They click through in under two seconds and cannot recall what it said |
| Speed and trust are the real tradeoff | Would they accept this friction on 30 applications a day? | They would not, and the whole gate needs to become a setting rather than a default |

## Participants

Six to ten people, recruited across the three segments defined in the [teardown](../../jobright-ai/teardown.md#1-product-overview), because I expect them to disagree:

- **Volume-first** (2 to 4): applying at high volume, optimizing for throughput
- **Quality-first** (2 to 3): professionals who cannot afford AI-sounding or false material
- **Constraint-heavy** (2 to 3): visa, salary floor, or location constraints where one wrong field disqualifies

I am constraint-heavy myself, so this segment is the one where I most need to hear from others rather than confirm myself.

## Protocol (about 20 minutes each)

Screen share, think-aloud, no leading questions. I do not explain the interface first; if it needs explaining, that is a finding.

1. **Context (2 min).** "You are applying to a job through an AI agent. Get this application to the point where you would be comfortable submitting it."
2. **Task 1, the pauses (5 min).** Let them hit the referral and salary pauses cold. Watch: do they understand why it stopped? Do they look for a way to skip it?
3. **Task 2, the resume diff (7 min).** The invented "12 cohorts / adopted playbook" claim is the heart of the test. Watch: do they notice it is unsupported? Do they approve, edit, or reject? Do they read the acknowledgment or dismiss it?
4. **Task 3, the verdict (3 min).** "What does this panel tell you? Would you trust this application?"
5. **Debrief (3 min).** "Where would you have wanted the agent to just handle it? Which pause was worth it and which was not? What would you turn off first?"

## What I measure

- Time to resolve each pause, and whether resolution was one tap or an escape attempt
- Whether the invented claim is caught unprompted, and what they do with it
- Time spent on the acknowledgment text (a proxy for whether it works or is banner blindness)
- Unprompted mentions of provenance concepts, in their own words
- Stated willingness to accept this friction at their real application volume
- Segment differences, which is the whole reason for recruiting three of them

## What would change the design

Stated in advance, so the test can actually fail:

- If most participants click through the acknowledgment without reading it, the warning is theater, and the answer is to block the specific claim rather than warn about it.
- If the pauses read as annoying to volume-first users but valuable to constraint-heavy users, the gate becomes a risk-tolerance setting rather than a default, which contradicts how I built it.
- If nobody can articulate what the provenance labels mean, the six-state model is too fine-grained for a consumer surface and needs to collapse to two states: "we can back this up" and "we cannot."
- If people catch the invented claim without any help, the diff view is doing less work than I assumed and the priority shifts toward fields users cannot verify at all.

## Findings

Not yet run. When findings land here, the v2 to v3 changelog in the [prototype README](./README.md) records what changed and what I got wrong.
