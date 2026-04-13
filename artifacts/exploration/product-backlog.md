# Prioritized Product Backlog
> Source: 1_Prioritized_Product_Backlog.pdf

## Algorithmic Fairness & Transparency Portal -- Sprint 1

Music Streaming Platform | Agile Scrum | MoSCoW Prioritization

| Metric | Value |
|---|---|
| Total Stories | 10 |
| Must Have | 7 |
| Should Have | 3 |
| Total Story Points | 78 |

- **Must Have** -- Critical; sprint cannot succeed without it
- **Should Have** -- High value; include if capacity allows
- **SP** = Story Points (Fibonacci: 5 / 8 / 13)

---

## Part 1 -- Prioritized Product Backlog (MoSCoW, Highest to Lowest Priority)

| # | User Story | Acceptance / So That | Priority | SP |
|---|---|---|---|---|
| 1 | As a **user**, I want to **understand what automated decisions the platform makes** | so that I know why content is recommended to me. | Must Have | 5 |
| 2 | As a **user**, I want a **plain-language explanation of how recommendations work** | so that I can understand them without technical knowledge. | Must Have | 8 |
| 3 | As a **user**, I want to **see what data factors influence my recommendations** | so that I understand what impacts my experience. | Must Have | 8 |
| 4 | As a **user**, I want to **access a fairness and oversight section** | so that I can see how the platform ensures fair outcomes. | Must Have | 5 |
| 5 | As a **user**, I want to **submit an appeal if I feel a decision is unfair** | so that I can request human review. | Must Have | 8 |
| 6 | As a **compliance officer**, I want **audit logs of automated decisions** | so that I can verify fairness and compliance. | Must Have | 13 |
| 7 | As an **engineer**, I want to **generate explanation metadata from the system** | so that transparency features are supported. | Must Have | 13 |
| 8 | As a **user**, I want to **view fairness metrics** (e.g., independent artist visibility) | so that I can evaluate platform fairness. | Should Have | 8 |
| 9 | As a **user**, I want **clear definitions of technical terms** (e.g., algorithm, ranking logic) | so that I am not confused. | Should Have | 5 |
| 10 | As a **user**, I want to **understand what happens after I submit an appeal** | so that I know what to expect. | Should Have | 5 |

> *Items 6 & 7 (audit logs and explanation metadata) are Must Have for the project but are deferred to Sprint 2 due to high complexity (13 pts each) and unresolved legal/architectural dependencies. They remain at the top of the backlog for prioritization purposes.*

---

## Part 2 -- Story Point Estimates & Estimation Approach

Our team used **relative estimation** with a modified Fibonacci sequence (5, 8, 13) to reflect increasing levels of effort, complexity, uncertainty, and risk. The team first agreed on an anchor story before sizing all other items.

### Anchor Story -- 5 Points

**Story #1:** "As a user, I want to understand what automated decisions the platform makes so that I know why content is recommended to me."

**Why chosen as anchor:** This story is foundational, predominantly UI and content-focused, involves no significant backend work, and has clear and unambiguous requirements. It represents the smallest meaningful unit of deliverable value on this project -- making it an ideal calibration point against which all other stories are measured relatively.

### Point Scale Reference

| Points | Effort / Complexity Level | Characteristics | Stories |
|---|---|---|---|
| 5 | Low | UI/content-focused; clear requirements; minimal integration or backend work | #1, #4, #9, #10 |
| 8 | Moderate | UX design + logic + some integration; moderate ambiguity in requirements | #2, #3, #5, #8 |
| 13 | High | Backend-heavy; architectural decisions; legal/compliance constraints; high uncertainty | #6, #7 |

### Hardest Items to Estimate & Why

**#6 -- Audit Logs (13 pts)**
This story was the most difficult to estimate due to high legal uncertainty. Data retention requirements, access control rules, and the format of audit records are all subject to regulatory interpretation that has not yet been finalized. The backend schema is unclear, and close collaboration with legal and compliance teams will be required before implementation can begin.

**#7 -- Explanation Metadata (13 pts)**
Generating explanation metadata from the recommendation system requires balancing technical accuracy with legal and intellectual property constraints. It is unclear how much of the underlying model logic can be exposed, and the architecture for surfacing this data has not yet been decided. Both factors create significant estimation uncertainty.

**#8 -- Fairness Metrics (8 pts)**
The concept of 'fairness' lacks a universally agreed definition in this context. Without stakeholder alignment on what metrics to display (e.g., genre diversity, independent artist share, geographic representation), it is difficult to scope the feature accurately. The estimate reflects the assumption of a high-level display only, pending that alignment.

### Per-Story Estimation Rationale

| # | SP | Estimation Rationale |
|---|---|---|
| 1 | 5 | Foundational, UI/content-focused with minimal backend work. Chosen as anchor story. |
| 2 | 8 | Requires UX design, copywriting, and legal review of explanation language. |
| 3 | 8 | Moderate complexity: must surface personalization signals in accessible language. |
| 4 | 5 | Static content page; low backend dependency, clear acceptance criteria. |
| 5 | 8 | Involves form design, submission logic, and routing to a review queue. |
| 6 | 13 | High complexity: legal data retention constraints, unclear schema, backend-heavy. Deferred. |
| 7 | 13 | Architectural risk: must balance technical accuracy with legal/IP limits. Deferred. |
| 8 | 8 | Difficult to scope without stakeholder alignment on what 'fairness' means numerically. |
| 9 | 5 | Glossary page; low complexity once core portal is in place. |
| 10 | 5 | Dependent on appeal submission (item 5) being live first. |
