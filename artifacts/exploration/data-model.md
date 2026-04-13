# Data Model: Music/Content Streaming Platform
> Source: Data Modeling Assignment.docx

---

## Key Design Decisions

The data model was designed to separate core system functionality from transparency and fairness features to better support the goals of the transparency portal. One key decision was to introduce an **Algorithm Decision** entity that exists independently from recommendations. This allows the system to track not just what content is shown to users, but also how and why those decisions are made. Additionally, an **Explanation** entity was created to support user-facing transparency by storing different levels of explanations without exposing proprietary algorithm details. A **Fairness_Audit** entity was also included to enable the organization to evaluate and monitor potential bias, particularly regarding concerns such as major label versus independent artist visibility. The inclusion of **Interaction** data supports the ability to analyze how engagement-driven algorithms influence outcomes. Finally, an **Appeal** entity was added to represent human-in-the-loop processes, allowing users to challenge automated decisions and improving accountability.

---

## Assumptions & Uncertainty

Several assumptions were made due to gaps in the case information:

- It is assumed that the platform collects and stores detailed user interaction data, such as plays, skips, and likes, which can be used to inform algorithmic decisions.
- It is also assumed that explanations can be generated in a way that provides meaningful insight to users without revealing sensitive or proprietary algorithmic logic.
- Another assumption is that fairness metrics, such as exposure balance or diversity scores, will be defined and measurable, even though the case does not specify how fairness should be evaluated.
- Additionally, it is assumed that a single algorithmic decision may have multiple associated explanations and fairness audits over time.
- There is also uncertainty around the level of data that can be stored or exposed due to legal and compliance constraints, which may impact how detailed explanations and audit records can be.

---

## How This Connects to the Case

This data model directly supports the goals of the Algorithmic Fairness and Transparency Portal by aligning with the key challenges identified in the case:

- The inclusion of the **Explanation** entity enables the system to provide users with clear, accessible information about how decisions affect their experience, addressing transparency concerns.
- The **Fairness_Audit** entity supports the evaluation of algorithmic outcomes, helping the organization monitor and address bias, such as disparities between major label versus independent artist visibility.
- The model also reflects stakeholder needs by balancing transparency with risk: compliance concerns are addressed through controlled explanation storage, while user trust is supported through explanations and appeal mechanisms.
- Furthermore, the model aligns with previously proposed transparency tiers by separating public-facing explanations, user-specific details, and internal audit data.
- Overall, this design ensures that the system can support both organizational accountability and user trust while remaining adaptable to evolving requirements and constraints.

---

## Entity Summary

Based on the design decisions described above, the data model includes the following key entities:

| Entity | Purpose |
|---|---|
| **Algorithm Decision** | Tracks what decisions were made, how, and why -- independent from recommendations |
| **Explanation** | Stores user-facing transparency content at different detail levels without exposing proprietary logic |
| **Fairness_Audit** | Enables monitoring and evaluation of algorithmic bias (e.g., major-label vs. independent artist visibility) |
| **Interaction** | Captures user engagement data (plays, skips, likes) to analyze algorithm-driven outcomes |
| **Appeal** | Represents human-in-the-loop review processes for users challenging automated decisions |

> Note: The original document contained an ER diagram image that could not be extracted as text. The diagram visually represents the relationships between these entities and the core platform data model.
