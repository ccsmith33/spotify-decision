# Team-Level Sprint Plan
> Source: 2_Team_Level_Sprint_Plan.pdf

## Algorithmic Fairness & Transparency Portal -- Sprint 1

Music Streaming Platform | 2-Week Sprint | Agile Scrum

| Metric | Value |
|---|---|
| Stories Selected | 5 |
| Points Committed | 34 |
| Team Capacity (pts) | 35 |
| Capacity Utilised | 97% |

> 34 pts committed | 97% utilisation | within 30-35 pt velocity range

---

## Sprint Goal

> "Establish a functional foundation of the Transparency Portal that enables users to understand automated decisions, view high-level fairness practices, and initiate an appeal -- delivering core transparency value by the end of the sprint."

---

## Sprint Board -- Selected User Stories

| # | Story Title | Persona | Priority | SP | Status |
|---|---|---|---|---|---|
| 1 | Portal Overview -- understand automated decisions | End User | Must Have | 5 | To Do |
| 2 | Plain-Language Recommendation Explanation | End User | Must Have | 8 | To Do |
| 3 | Data Factors Influencing Recommendations | End User | Must Have | 8 | To Do |
| 4 | Fairness & Oversight Section | End User | Must Have | 5 | To Do |
| 5 | Appeal Submission Flow | End User | Must Have | 8 | To Do |
| | **SPRINT TOTAL** | | | **34** | |

---

## Story Detail & Acceptance Criteria

### Story 1 | 5 pts | Must Have -- Portal Overview

*As a user, I want to understand what automated decisions the platform makes so that I know why content is recommended to me.*

**Acceptance Criteria:**
1. Informational portal page is live
2. Explains at least 3 types of automated decisions
3. Uses plain language (no jargon)
4. Reviewed and approved by legal

### Story 2 | 8 pts | Must Have -- Plain-Language Recommendation Explanation

*As a user, I want a plain-language explanation of how recommendations work so that I can understand them without technical knowledge.*

**Acceptance Criteria:**
1. Explanation displayed on user-facing page
2. Covers top 3 recommendation signals
3. Passes readability review (Flesch-Kincaid grade 8 or below)
4. Legal sign-off obtained

### Story 3 | 8 pts | Must Have -- Data Factors Influencing Recommendations

*As a user, I want to see what data factors influence my recommendations so that I understand what impacts my experience.*

**Acceptance Criteria:**
1. List of personalization signals visible to user
2. Each factor has a short description
3. Linked from recommendation explanation page
4. Data factors validated by engineering

### Story 4 | 5 pts | Must Have -- Fairness & Oversight Section

*As a user, I want to access a fairness and oversight section so that I can see how the platform ensures fair outcomes.*

**Acceptance Criteria:**
1. Static section is accessible from main portal nav
2. Describes at least 2 fairness practices
3. Links to appeal process
4. Approved by product owner

### Story 5 | 8 pts | Must Have -- Appeal Submission Flow

*As a user, I want to submit an appeal if I feel a decision is unfair so that I can request human review.*

**Acceptance Criteria:**
1. Submission form is live and functional
2. User receives confirmation on submit
3. Appeal is routed to review queue
4. Error states handled gracefully

---

## Team Definition of Done (DoD)

All sprint stories must satisfy the following team-wide Definition of Done before they can be marked complete and presented at the Sprint Review.

| Area | Criterion |
|---|---|
| Code & Build | Code is written, reviewed by at least one peer, and merged to the main branch. |
| Testing | Unit tests written and passing; functional testing completed against acceptance criteria. |
| Legal Review | Any user-facing copy (especially explanation text) has received legal sign-off. |
| UX Sign-Off | UI changes reviewed and approved by the design lead. |
| Accessibility | New UI components meet WCAG 2.1 AA accessibility standards. |
| Documentation | Any new features or APIs are documented for internal team reference. |
| Demo-Ready | Story can be demonstrated live at the Sprint Review without additional setup. |

---

## Deferred to Sprint 2+ (Not in This Sprint)

The following backlog items were reviewed but deliberately excluded from Sprint 1 to keep the commitment realistic and avoid unresolved dependencies.

| Story | Priority | Reason for Deferral |
|---|---|---|
| #6 -- Audit Logs (13 pts) | Must Have | Legal/compliance requirements not yet finalized; schema undefined. |
| #7 -- Explanation Metadata (13 pts) | Must Have | Architecture decision pending; legal IP constraints unresolved. |
| #8 -- Fairness Metrics (8 pts) | Should Have | Stakeholder alignment on fairness definition still in progress. |
| #9 -- Glossary / Definitions (5 pts) | Should Have | Lower priority; depends on core portal being stable first. |
| #10 -- Appeal Status Tracking (5 pts) | Should Have | Blocked on appeal submission (#5) being live and tested. |
