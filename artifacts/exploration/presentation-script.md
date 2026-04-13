# Presentation Script: Sprint 1 Plan
> Source: Script.docx

---

## Speaker 1 -- Introduction

Hi everyone, and today we're presenting our Agile Scrum plan for Sprint 1 of the Algorithmic Fairness and Transparency Portal for a music streaming platform. The purpose of this portal is to help users better understand how automated recommendations work, what factors influence those recommendations, and what they can do if they believe a decision was unfair. Our presentation covers two connected pieces: first, our prioritized product backlog, and second, our team-level sprint plan for the first two-week sprint.

## Speaker 2 -- Product Backlog Overview

Starting with the product backlog, we prioritized ten user stories using the MoSCoW method. Seven were classified as Must Have, and three were classified as Should Have. The highest-priority stories focus on the user experience of transparency: helping users understand automated decisions, giving a plain-language explanation of recommendations, showing data factors that influence recommendations, providing a fairness and oversight section, and allowing users to submit an appeal for human review. Together, these stories create the foundation of the portal and deliver immediate user value.

## Speaker 3 -- Estimation Approach

We also estimated all stories using a modified Fibonacci sequence of 5, 8, and 13 story points. Our anchor story was the portal overview, which we rated at 5 points because it is mostly UI and content focused, has low technical uncertainty, and is the smallest meaningful unit of value. Moderate-complexity stories such as the recommendation explanation, data factors page, and appeal flow were estimated at 8 points. The most difficult stories to estimate were audit logs and explanation metadata, both at 13 points, because they involve unresolved legal, architectural, and compliance questions.

## Speaker 1 -- Sprint 1 Selection

For Sprint 1, we selected five stories with a total of 34 points. These are: Portal Overview, Plain-Language Recommendation Explanation, Data Factors Influencing Recommendations, Fairness and Oversight Section, and Appeal Submission Flow. Our sprint goal is to establish a functional foundation of the portal that lets users understand automated decisions, view high-level fairness practices, and initiate an appeal by the end of the sprint. That goal keeps the sprint focused on a clear and coherent slice of functionality instead of spreading effort across unrelated features.

## Speaker 2 -- Sprint Capacity & Justification

This sprint commitment is realistic because our team capacity is 35 points, and we committed 34, which gives us 97 percent utilization and keeps us within our expected velocity range of 30 to 35 points. In other words, we pushed close to full capacity without overcommitting. We intentionally chose stories that are tightly connected from a user perspective, so the sprint delivers a usable transparency experience rather than isolated pieces. The selected work is also balanced across content, UX, and moderate functionality, which makes it achievable within a two-week sprint.

## Speaker 3 -- Acceptance Criteria

Each selected story also has clear acceptance criteria. For example, the portal overview must explain at least three types of automated decisions in plain language and be approved by legal. The recommendation explanation must cover the top three recommendation signals and pass a readability review. The appeal flow must include a live submission form, confirmation to the user, routing to a review queue, and graceful error handling. These acceptance criteria make the work measurable and help the team define exactly what "done" means for each story.

## Speaker 1 -- Definition of Done

Beyond story-level criteria, we also defined a team-wide Definition of Done. For any story to be complete, the code must be written, peer reviewed, and merged; tests must pass; legal sign-off is required for user-facing copy; UX must be approved by the design lead; accessibility standards must be met; documentation must be updated; and the story must be demo-ready for Sprint Review. This gives us consistency and makes sure quality is built into the sprint, not added at the end.

## Speaker 2 -- Deferred Items

We also made deliberate decisions about what not to include in Sprint 1. Audit logs, explanation metadata, fairness metrics, glossary definitions, and appeal status tracking were deferred to later sprints. Some of these were postponed because of unresolved legal and architecture dependencies, while others depended on core Sprint 1 features being completed first. Deferring those items was important because it kept the sprint realistic and protected the team from taking on too much uncertainty too early.

## Speaker 3 -- Closing

Overall, our backlog and sprint plan show a practical Agile approach: we prioritized the most valuable user-facing transparency features first, sized the work realistically, aligned the sprint to capacity, and left more complex or dependent items for future iterations. By the end of Sprint 1, the team should be able to demonstrate a working foundation of the Transparency Portal that gives users clarity, fairness visibility, and a path to appeal. That creates meaningful value early while setting up the project for stronger future sprints.
