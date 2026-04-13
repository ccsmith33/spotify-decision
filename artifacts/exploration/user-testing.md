# User Testing
> Source: User Testing Plan.pdf, User Testing Results.pdf

---

## Part 1: User Testing Plan

**Algorithmic Fairness & Transparency Portal for a Music Recommendation Platform | MIS 430**

| Detail | Value |
|---|---|
| Testing method | Moderated, task-based usability testing with a think-aloud protocol |
| Participants | 3 non-MIS 430 / non-MIS 520 users who regularly use music streaming platforms |
| Session length | About 20-25 minutes per participant |
| Prototype focus | Transparency, fairness/oversight, and appeal/review flows in the portal |

**The point of this round is not to prove the portal is perfect.** It is to see whether normal users can actually understand what the portal is saying, where they get confused, and whether the experience builds trust without oversharing sensitive algorithm details. Because the platform is framed around a music platform, this plan focuses on recommendation transparency, artist visibility fairness, and user recourse if an automated outcome feels unfair.

### 1. Testing Goals

- Evaluate whether users understand, in plain language, what kinds of automated decisions the platform makes and why the portal exists.
- Test whether users can interpret recommendation explanations without expecting proprietary or individualized model logic that the company would not realistically disclose.
- See whether the fairness and oversight content feels meaningful -- especially around issues like major-label versus independent artist visibility -- rather than vague or performative.
- Determine whether users can easily find and understand the appeal / review process when they believe an automated decision affected their experience unfairly.

**Assumptions we are trying to validate or challenge:**

- Users will prefer high-level, plain-language explanations over technical detail.
- Users will understand the difference between explaining how the system works generally and justifying every individual recommendation.
- Aggregate fairness metrics and monitoring language will increase trust even if the platform does not reveal sensitive ranking logic.
- A visible, structured appeal path will make the portal feel more accountable.

### 2. Target Users

We will test with three people who are not current MIS 430 or MIS 520 students. We chose people who resemble the public-facing users of the platform rather than internal or technical stakeholders.

- Two frequent music streaming users (Spotify, Apple Music, YouTube Music, etc.) who regularly rely on recommendations, playlists, or ranked content.
- One more casual streaming user who still receives recommendations, but is less likely to understand algorithmic language or fairness terminology.
- If possible, at least one participant who cares about music discovery or independent artists, since our portal discusses visibility and fairness concerns in that area.

**Why these users:** The portal is public-facing, so the most important audience is everyday platform users. A mix of frequent and casual users helps us test whether the design works both for people who think about recommendations a lot and for people who just want a clear answer quickly.

### 3. Testing Approach

Each session will be moderated and conducted using a clickable prototype. We will ask participants to think aloud as they move through the portal. The moderator will avoid coaching unless the participant is completely stuck. After each task, the participant will be asked a short confidence question and one follow-up question in their own words.

- Format: one-on-one moderated sessions
- Length: about 20-25 minutes each
- Environment: laptop or desktop, in person or on a video call with screen sharing
- Data collected: notes, timing, task completion, confusion points, and post-task confidence ratings

### 4. Tasks / Scenarios

| Task | Scenario / Prompt | Why We Chose It | Success Criteria | Metrics |
|---|---|---|---|---|
| 1 | "You are a user who clicked a link asking why your recommendations and ranking on the platform work the way they do. Show me what this portal is for and what kinds of decisions it covers." | Tests first impression, scope clarity, and whether the homepage actually orients the user. | Participant can correctly identify at least two automated decision types and where they would go next, with no moderator help. | Completion (Y/N), time on task, wrong turns, confidence rating (1-5). |
| 2 | "Find the explanation for why a certain artist, playlist, or recommendation was shown to you. Then tell me, in your own words, what the explanation says." | Checks whether the explanation content is understandable and whether users can paraphrase it without expecting hidden model details. | Participant can explain the recommendation at a high level and identify at least one boundary about what is not disclosed. | Completion, paraphrase quality, hesitation points, confidence rating, notable quotes. |
| 3 | "Look at the fairness / oversight section and tell me what the platform is doing to make recommendations feel fair, especially for artist visibility." | Directly tests the strongest fairness concept in our version of the case: monitoring outcomes such as major-label versus independent artist exposure. | Participant can identify at least one fairness practice or metric and understands that it reflects monitoring at an aggregate level. | Completion, comprehension, misinterpretations, confidence rating, trust reaction. |
| 4 | "Imagine you feel a recommendation or ranking outcome was unfair. Show me how you would challenge it or request review." | Tests whether accountability and human-in-the-loop support are obvious, usable, and credible. | Participant can locate the appeal / review path, begin the flow, and describe what happens next. | Completion, time, navigation errors, confidence rating, perceived usefulness. |

### 5. Metrics and Observations

We will collect both performance metrics and qualitative observations. The performance metrics tell us whether users can actually complete the tasks. The qualitative notes tell us whether the portal feels clear, trustworthy, or evasive.

- **Task completion:** Whether the participant completes the task without intervention. This shows basic usability.
- **Time on task:** Helps reveal which flows are intuitive and which ones are slower than they should be.
- **Misclicks / wrong turns:** Shows where navigation labels, page hierarchy, or calls to action are unclear.
- **Confidence rating (1-5):** Asked after each task: "How confident are you that you understood what you just saw?" This helps separate completion from real understanding.
- **Paraphrase quality:** For explanation and fairness tasks, we will ask the participant to explain the content in their own words. If they cannot, the copy is not doing its job.
- **Trust / credibility reactions:** We will note comments like "this feels helpful," "this is too vague," or "this sounds like PR language." These reactions matter because the portal is supposed to build trust.

### 6. Success Criteria by Task

- **Task 1** is successful if at least 2 of 3 participants can explain the portal's purpose and name at least two automated decision areas it covers.
- **Task 2** is successful if at least 2 of 3 participants can paraphrase a recommendation explanation accurately and recognize that some proprietary logic is intentionally not disclosed.
- **Task 3** is successful if at least 2 of 3 participants can identify at least one fairness / oversight practice and do not mistake aggregate monitoring for a guarantee about every individual outcome.
- **Task 4** is successful if all 3 participants can find the appeal or review path with little friction and describe what the human review process appears to do.

**Overall round-level success:** The round will be considered successful if users can complete the core tasks, understand the portal in plain language, and generally describe it as clear and credible rather than confusing or evasive.

### 7. Planned Use of Results

- If users struggle to explain what the portal covers, we will revise the homepage hierarchy and introductory copy.
- If users understand the explanation page only after moderator help, we will simplify wording, add examples, and make disclosure boundaries more explicit.
- If the fairness section feels vague, we will tighten the language around what is being measured, why it matters, and how often it is reviewed.
- If users cannot distinguish between explanation content and fairness oversight content, we will separate those sections more clearly in the navigation and page design.
- If the appeal / review flow is hard to find or feels weak, we will redesign the call to action and make the next-step expectations more concrete.
- If users say the portal still feels like polished PR rather than transparency, we will revisit tone, specificity, and the balance between reassurance and useful information.

### 8. Session Notes Template

| Task | Completed? | What Happened | Key Quote / Takeaway |
|---|---|---|---|
| Task 1 | | | |
| Task 2 | | | |
| Task 3 | | | |
| Task 4 | | | |

**Overall impression:** What felt clear? What felt vague? Did the portal increase trust or mostly feel like careful wording?

---

## Part 2: User Testing Results

**Moderated Usability Testing -- Prototype v2.1**
Testing Dates: April 1-3, 2026 | Method: Task-based, think-aloud protocol | Participants: 3 | Sessions: 20-25 min each

### Testing Summary

| Metric | Value |
|---|---|
| Overall Verdict | **Partially Successful -- Clear Improvement Opportunities Identified** |
| Participants | 3 |
| Tasks Tested | 4 |
| Task Completion | 100% |
| Avg Confidence (1-5) | 3.92 |

Three participants with distinct streaming profiles completed four tasks covering portal orientation, recommendation explanations, fairness monitoring comprehension, and the appeal process. Sessions followed a moderated, think-aloud protocol, with each participant working through the Algorithmic Fairness & Transparency Portal prototype (v2.1). All tasks achieved 100% completion, though comprehension depth and confidence varied significantly between user types.

### Participant Profiles

| | Participant 1 | Participant 2 | Participant 3 |
|---|---|---|---|
| Age | 27 | 31 | 24 |
| Platform | Spotify (4-5x/week) | Apple Music (daily) | YouTube Music (2-3x/week) |
| Role | Software engineer | Freelance designer | Marketing coordinator |
| Tech Level | High -- familiar with algorithm concepts | Medium -- understands tech, no industry background | Low-to-medium -- less familiar with algorithm terminology |
| Profile | Power User -- Curates playlists, uses Discover Weekly, thinks strategically about recommendations | Music Discovery Focused -- Indie-focused, values artist independence and fair compensation | Casual User -- Passive listener, prefers simple explanations |

### Session Timing Summary

| Participant | Task 1: Orientation | Task 2: Explanation | Task 3: Fairness | Task 4: Appeal | Total |
|---|---|---|---|---|---|
| P1 | 2:15 | 2:50 | 2:30 | 2:05 | **9:40** |
| P2 | 2:45 | 3:15 | 3:20 | 2:35 | **11:55** |
| P3 | 3:20 | 4:40 | 4:10 | 3:40 | **15:50** |
| Average | 2:46 | 3:35 | 3:20 | 2:46 | **12:28** |

### Confidence Ratings (1-5 Scale)

| Participant | Task 1: Orientation | Task 2: Explanation | Task 3: Fairness | Task 4: Appeal | Average |
|---|---|---|---|---|---|
| P1 | 5 | 5 | 5 | 5 | **5.0** |
| P2 | 4 | 4 | 4 | 5 | **4.25** |
| P3 | 3 | 2 | 2 | 3 | **2.5** |
| Average | 4.0 | 3.67 | 3.67 | 4.33 | **3.92** |

Power and informed users (P1, P2) maintained high confidence (4-5) across all tasks. The casual user (P3) had significantly lower confidence (2-3), particularly on explanation and fairness comprehension tasks, correlating with terminology complexity and concept abstraction.

### Task Completion & Paraphrase Quality

| Task | Completion Rate | Avg Time | Key Observation |
|---|---|---|---|
| Task 1: Portal Orientation | 100% | 2:46 | All participants identified 2+ decision areas. Intuitive for all user types. |
| Task 2: Recommendation Explanation | 100% | 3:35 | Varying depth. P1: Excellent paraphrase. P2: Good. P3: Fair -- struggled with "proprietary." |
| Task 3: Fairness Comprehension | 100% | 3:20 | P3 confused aggregate monitoring with individual guarantee. Critical UX issue. |
| Task 4: Appeal Process | 100% | 2:46 | All found the process. P3 looked in Account Settings first. Post-review outcomes unclear. |

### Cross-Participant Patterns

**Pattern 1: Terminology Barrier for Casual Users**
P3 struggled with "proprietary ranking logic," "algorithmic weight," and "aggregate-level monitoring" across all tasks. Casual users needed moderator clarification on 3 of 4 tasks; power and music-focused users needed clarification on 0-1 tasks.

**Pattern 2: Desire for Concrete Data Over Targets**
All three participants independently requested actual performance numbers alongside targets. "Target: 15%" without current metrics created a perception of vagueness and reduced credibility of the fairness section.

**Pattern 3: Trust Increases with Specific Details**
Specific details in the appeal process -- "5-7 business days," "human review team," contact via account email -- increased trust across all user types. More specificity on post-review outcomes would further build confidence.

**Pattern 4: Power Users vs. Casual Users: Boundaries vs. Guarantees**
P1 and P2 appreciated transparent boundaries about what is not disclosed (proprietary logic). P3 sought personal guarantees instead, misunderstanding aggregate metrics as individual promises. The portal manages expectations for informed users but may confuse casual users.

### Key Findings

#### What Worked Well

**Homepage Orientation Is Intuitive**
100% of participants identified at least two decision areas covered by the portal. The two-section structure ("How Recommendations Work" and "Fairness & Oversight") effectively communicated scope. Time to understand ranged from 2:15 (power user) to 3:20 (casual user).

> "Oh, this is showing me how the algorithm makes decisions and also how fair it is to artists. I can see the two main paths here." -- Participant 1 (P1), Task 1

**Appeal Process Feels Accountable & Concrete**
All participants found the appeal/review section and understood the flow. Specific details like "5-7 business days" and "human review team" created trust. The structured process made the portal feel substantive rather than performative.

> "Good -- there's actually a human review process. Not just 'your complaint was logged.' There's a real person looking at it." -- Participant 1 (P1), Task 4

**High-Level Explanation Strategy Works for Informed Users**
Both P1 and P2 appreciated the decision to explain general system behavior without disclosing proprietary weights. They recognized this as honest boundary-setting and explicitly described the approach as "transparent" rather than evasive.

> "I like that they're being clear about what they ARE sharing and what they're NOT. That's more honest than pretending they'll explain the whole algorithm." -- Participant 1 (P1), Task 2

#### Where Users Struggled

**Algorithmic Terminology Is a Barrier for Casual Users**
"Proprietary ranking logic," "algorithmic weight," and "aggregate-level monitoring" created confusion for P3, who required moderator clarification on 3 of 4 tasks and ended with confidence ratings of 2-3 compared to P1 and P2's 4-5. The portal assumes moderate tech literacy that casual users do not consistently have.

> "Why can't they just tell me the weights? Is that like, the algorithm's secret?" -- Participant 3 (P3), Task 2

**Target Language Feels Vague Without Actual Metrics**
All three participants expressed desire to see current performance data alongside targets. Stating "Target: 15% independent artist exposure" without showing current performance creates a perception that the portal is aspirational rather than transparent.

> "What's the ACTUAL percentage right now? Are they hitting 15% or not? This feels a bit vague without the real numbers." -- Participant 2 (P2), Task 3

**Aggregate-Level Fairness Is Not Intuitive**
P3 initially interpreted "15% independent artist exposure" as a personal guarantee ("one in every seven songs for me") rather than a platform-wide metric. This is a critical misunderstanding of fairness monitoring scope that could undermine trust if unaddressed.

> "So they're saying 15% of my recommendations will be independent artists? That's... like, one in every seven songs?" -- Participant 3 (P3), Task 3

**Missing Post-Appeal Outcomes Information**
Both P1 and P2 asked "what happens after they review my appeal?" The portal explains how to submit but not what outcomes to expect. This gap reduces perceived accountability and leaves users uncertain about the process's real impact.

> "What I want to know is: what happens after they review? Do they tell me their decision? Do they fix it?" -- Participant 2 (P2), Task 4

### Session Notes

#### Participant 1 -- Power User (Spotify, age 27)

| Task | Completed? | What Happened | Key Quote / Takeaway |
|---|---|---|---|
| Task 1 | Yes | Navigated directly to homepage sections with no wrong turns. Identified recommendation algorithms, artist visibility monitoring, and ranking transparency within 2:15. Confidence: 5/5. | "This is showing me how the algorithm makes decisions and also how fair it is to artists. I can see the two main paths here." |
| Task 2 | Yes | Found explanation section immediately. Provided excellent paraphrase capturing both general factors and disclosure boundaries. Recognized proprietary logic as intentional boundary-setting. Confidence: 5/5. | "I like that they're being clear about what they ARE sharing and what they're NOT. That's more honest than pretending they'll explain the whole algorithm." |
| Task 3 | Yes | Engaged immediately with fairness content. Identified multiple practices (15% independent artist target, monthly audits, playlist diversity). Correctly understood aggregate-level monitoring. Noted absence of actual current metrics. Confidence: 5/5. | "I notice they say 'target: 15% or higher' but don't say what it actually is right now. I'd want to see the actual numbers." |
| Task 4 | Yes | Located appeal section with no navigation errors in 2:05. Understood the full flow: submit concern, human review, 5-7 day timeline. Appreciated the structured approach and specific commitments. Confidence: 5/5. | "Good -- there's actually a human review process. Not just 'your complaint was logged.' There's a real person looking at it." |

**Overall impression:** Portal feels transparent and honest. Clear structure, effective boundary-setting on proprietary information. Would feel more credible with actual performance metrics alongside targets. Increased trust overall.

#### Participant 2 -- Music Discovery Focused (Apple Music, age 31)

| Task | Completed? | What Happened | Key Quote / Takeaway |
|---|---|---|---|
| Task 1 | Yes | Briefly hovered over Account Settings before finding main portal sections (1 wrong turn). Identified recommendation explanations and artist fairness/visibility. Engaged with the fairness angle immediately. Confidence: 4/5. | "The fact that they're monitoring indie artist exposure specifically is good to know." |
| Task 2 | Yes | Found explanation section without issue. Good paraphrase capturing main factors. Initially focused more on "why did I get this" than disclosure boundaries. Recognized proprietary boundary after gentle moderator probe. Confidence: 4/5. | "So they're being transparent about the general approach but keeping the specific algorithm private. That seems reasonable." |
| Task 3 | Yes | Emotionally engaged with fairness content. Initially thought 15% was a per-user guarantee, self-corrected after reading further. Identified multiple fairness practices. Expressed desire for actual current metrics. Confidence: 4/5. | "What's the ACTUAL percentage right now? Are they hitting 15% or not? This feels a bit vague without the real numbers." |
| Task 4 | Yes | Found appeal section easily, no navigation errors. Understood the flow and appreciated the human review component. Wanted more detail on post-review outcomes. Confidence: 5/5. | "What I want to know is: what happens after they review? Do they tell me their decision? Do they fix it?" |

**Overall impression:** Portal addresses core concerns about artist fairness. Appreciated specific metrics and monthly audits. Fairness section could be stronger with real data. Appeal process feels credible but needs clarity on outcomes. Trust increased, but wants more substance.

#### Participant 3 -- Casual User (YouTube Music, age 24)

| Task | Completed? | What Happened | Key Quote / Takeaway |
|---|---|---|---|
| Task 1 | Yes (with hesitation) | Initially unclear whether to read intro text or click sections (1 wrong turn). Slower reading pace. Eventually identified "why recommendations appear" and "something about fairness" but with less precision than P1/P2. Confidence: 3/5. | "I'm not totally sure what the second section does yet, but I think it's about making sure artists are treated fairly." |
| Task 2 | Partial | Took longer to find explanation section. Re-read explanation twice. Confused by "proprietary ranking logic" and "weight." Asked moderator "why can't they tell me the weights?" After clarification, understood basic concept but remained uncertain. Confidence: 2/5. | "Oh okay, I think I get it now. They tell you the general reasons but not like, the exact math. That makes sense for keeping it secret I guess." |
| Task 3 | Partial | Struggled with fairness metrics. Misunderstood 15% independent artist exposure as a personal guarantee ("one in every seven songs for me"). Required moderator clarification to understand aggregate-level monitoring. Remained less confident even after explanation. Confidence: 2/5. | "I didn't really understand what they meant at first. The fairness stuff feels a bit technical." |
| Task 4 | Yes (with hesitation) | Looked in Account Settings first before finding Appeal section (1 wrong turn). Once located, understood the basic process. Felt the form was clear but uncertain about next steps after submission. Confidence: 3/5. | "It's not hard to use, but I had to look around a bit to find it. I wish it said more clearly what they'll do after they review." |

**Overall impression:** Portal is understandable at a surface level but feels too technical. Did not fully grasp aggregate fairness concept without help. Simpler language and concrete examples would make a significant difference. Portal felt more like careful wording than genuine transparency.

### Action Plan

Five prioritized improvements based on testing evidence. Three are rated HIGH priority (address before next testing round) and two are MEDIUM priority.

#### HIGH -- Action 1: Create a Terminology Glossary with Examples
Add an expandable glossary accessible from the portal header. Define terms like "algorithmic weight" and "aggregate monitoring" in plain language with concrete music examples. Place definitions inline in key sections, especially the fairness section.
*Evidence: P3 struggled with technical terminology on 3 of 4 tasks, requiring moderator clarification each time.*

#### HIGH -- Action 2: Display Current Metrics Alongside Targets
Modify fairness metrics to show actual current performance alongside targets (e.g., "Current: 12% | Target: 15% | Last Updated: April 1, 2026"). Include trend data and honest context when targets are missed.
*Evidence: All 3 participants independently requested actual numbers. P2: "This feels a bit vague without the real numbers."*

#### HIGH -- Action 3: Explicitly Explain Aggregate vs. Individual Fairness
Add a prominent callout in the fairness section clarifying that metrics measure platform-wide fairness, not per-user guarantees. Use visual examples showing the distinction between system-level monitoring and individual user experience.
*Evidence: P3 misunderstood 15% independent artist exposure as a personal guarantee -- a critical comprehension failure.*

#### MEDIUM -- Action 4: Clarify Post-Appeal Resolution Process
Update the appeal confirmation to explain post-review next steps: what the response will contain, whether adjustments will be made, and how to escalate if dissatisfied. Consider adding a sample response or case study.
*Evidence: P1 and P2 both asked "what happens after they review?" -- gap reduces accountability perception.*

#### MEDIUM -- Action 5: Improve Navigation Discoverability for Appeal Section
Add a prominent "Challenge a Decision" link in the fairness section footer and homepage navigation. Test with casual users to confirm improved discoverability.
*Evidence: P3 looked in Account Settings before finding Appeal section (3:40 vs. 2:05 for P1).*

### Participant Perceptions Summary

| | Participant 1 (P1) | Participant 2 (P2) | Participant 3 (P3) |
|---|---|---|---|
| Type | Power User | Music Discovery | Casual User |
| Avg Confidence | 5.0 | 4.25 | 2.5 |
| Summary | Portal feels transparent and honest. Appreciated boundary-setting on proprietary information. Wanted actual metrics alongside targets. | Portal addresses core concerns about artist fairness. Appreciated specific metrics and monthly audits. Wanted clearer data on current performance and broader appeal outcomes. | Portal is understandable but feels technical. Did not fully grasp aggregate fairness concept. Wanted simpler language and concrete guarantees about post-appeal outcomes. |

*Report Prepared: April 5, 2026 | Testing Coordinator: Research Team | Portal Version: Prototype v2.1 (March 2026)*
