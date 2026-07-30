# Usability Test Plan: Trust Layer Prototype

The next thing this concept needs is not more analysis. It needs people who are not me to use it and disagree with it. This is the script I would run, written to be runnable by anyone, including me, this week.

**Status: not yet run.** No findings exist. When they do, they go in a Findings section below, including the parts that contradict the current design.

## What I am actually trying to learn

The prototype encodes four bets. Each one could be wrong, and each has a question that would expose it:

| The bet | The question that tests it | What "wrong" looks like |
|---|---|---|
| Users want the agent to stop and ask on identity facts | When it pauses, do they resolve it or resent it? | They call the pause annoying and say they would rather fix errors afterward |
| Provenance labels communicate something useful | Can they say, unprompted, what "user-asserted" means for their application? | The labels read as decoration, or worse, everything looks equally trustworthy |
| The acknowledgment step protects people | After acting on the invented claim, can they say what their action meant? | They describe approving or rewriting it as having verified or confirmed the claim |
| Speed and trust are the real tradeoff | Would they accept this friction on 30 applications a day? | They would not, and the whole gate needs to become a setting rather than a default |

## Participants

Six to ten people, recruited across the three segments defined in the [teardown](../../jobright-ai/teardown.md#1-product-overview), because I expect them to disagree:

- **Volume-first** (2 to 4): applying at high volume, optimizing for throughput
- **Quality-first** (2 to 3): professionals who cannot afford AI-sounding or false material
- **Constraint-heavy** (2 to 3): visa, salary floor, or location constraints where one wrong field disqualifies

I am constraint-heavy myself, so this segment is the one where I most need to hear from others rather than confirm myself.

**How segment results may and may not be read.** This sample size supports qualitative usability discovery. With two or three participants per segment it cannot establish statistically reliable differences between groups, how common any behavior is in a population, or which segment "prefers" what. What it can surface is contrasting behavior worth investigating: a usability risk that appears in one segment and not another, a hypothesis for later quantitative research, or a design assumption that holds for one kind of user and breaks for another. **Segment patterns from this study are directional observations, not population estimates**, and any finding stated segment-by-segment carries that meaning.

## Protocol (about 20 minutes each)

Screen share, think-aloud, no leading questions. I do not explain the interface first; if it needs explaining, that is a finding.

1. **Context (2 min).** "You are applying to a job through an AI agent. Get this application to the point where you would be comfortable submitting it."
2. **Task 1, the pauses (5 min).** Let them hit the referral and salary pauses cold. Watch: do they understand why it stopped? Do they look for a way to skip it?
3. **Task 2, the resume diff (6 min).** The invented "12 cohorts / adopted playbook" claim is the heart of the test. Watch: do they notice it is unsupported? Do they approve, edit, or reject? What do they do when the acknowledgment appears?
4. **Comprehension probe (2 min), immediately after they act on the invented claim.** Open neutrally with **"What did the action you just took mean?"**, then follow the branch matching what they actually did. Asking "what did approving that mean" of someone who rejected would be both confusing and leading.

   | If they | Follow-up | Listening for |
   |---|---|---|
   | **Approved** | "What does the system now know about that sentence?" | That approval authorized the claim without verifying it; that nothing independent backs it; that the record shows it as their assertion |
   | **Edited** | "What does the system now know about the sentence you changed?" | That editing changed who is asserting the claim, not whether evidence exists; that their wording is user-asserted unless they supplied evidence for it |
   | **Rejected** | "Why did you reject it?" then "What do you think would have happened if you had approved it?" | Whether the rejection came from understanding provenance or from something else entirely, such as tone or wording preference |

   Nothing about provenance, evidence, or authorization is explained until after these answers are recorded. Teaching the concept first tests my explanation rather than the interface.
5. **Task 3, the verdict (2 min).** "What is this panel telling you? What would you do next?"
6. **Debrief (3 min).** "What did you think about each pause?" Then: "Which of them, if any, would you keep, change, make optional, or remove?" Then: "Was there anywhere you expected the agent to behave differently?"

Every debrief question is phrased to accept "none," "all of them," or "no" as a complete answer. A question the participant cannot disagree with is not a question.

## What I measure

- Time to resolve each pause, and whether resolution was one tap or an escape attempt
- Whether the invented claim is caught unprompted, and what they do with it
- **Comprehension of the acknowledgment**, coded from the probe in step 4 rather than inferred from reading time. Time on the text is recorded too, but as a weak signal: a participant can stare at a warning and misread it, or skim it and grasp it exactly

  | Code | What the participant conveys |
  |---|---|
  | Full understanding | The claim has no supporting evidence; approving or editing authorizes it without making it verified; the system records it as their assertion |
  | Partial understanding | Grasps that something is unsupported, but not what their action does to its status |
  | Action misunderstood as verification | Believes approving, or rewriting, made the claim confirmed, checked, or backed by the system |
  | Provenance distinction not noticed | No awareness that provenance differed between this change and the other one |

  Coded from what the participant says, never from which button they pressed. **Rejecting is not scored as understanding**: a participant can reject an invented claim because the sentence reads badly, or because they dislike embellishment generally, without ever registering that the system tracks where a claim came from. That is what the "what would have happened if you had approved it" follow-up is for. Counts across six to ten participants are reported as descriptive usability findings ("four of eight read approval as verification"), never as rates in a population.
- Unprompted mentions of provenance concepts, in their own words
- Stated willingness to accept this friction at their real application volume
- Contrasting behavior between segments, as hypotheses for later research rather than measured differences

## What would change the design

Stated in advance, so the test can actually fail:

- If most participants code as *action misunderstood as verification* or *provenance distinction not noticed*, the warning is theater regardless of how long they looked at it, and the answer is to block the unsupported claim outright rather than warn about it.
- If the pauses draw consistently different reactions from volume-first and constraint-heavy participants, that is a hypothesis that the gate should be a risk-tolerance setting rather than a default, which contradicts how I built it. With two or three people per segment it would be a lead to test, not a conclusion to ship.
- If nobody can articulate what the provenance labels mean, the six-state model is too fine-grained for a consumer surface and needs to collapse to two states: "we can back this up" and "we cannot."
- If people catch the invented claim without any help, the diff view is doing less work than I assumed and the priority shifts toward fields users cannot verify at all.

## Findings

Not yet run. When findings land here, the v2 to v3 changelog in the [prototype README](./README.md) records what changed and what I got wrong.
