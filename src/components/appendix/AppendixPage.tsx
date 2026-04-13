import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './AppendixPage.module.css';

interface AppendixSection {
  title: string;
  description: string;
  content: string;
}

const sections: AppendixSection[] = [
  {
    title: 'Project Brief & Background',
    description: 'How the project was scoped and what problem it addresses',
    content: 'This section will contain the project brief, including the problem statement, target users, and success metrics for the Decision Transparency Portal. Group members should add their analysis of the case context and how it informed the project scope.',
  },
  {
    title: 'Data Model',
    description: 'Entity descriptions and relationships',
    content: 'This section will contain the entity-relationship diagram and descriptions of the five key entities: Algorithm Decision, Explanation, Fairness Audit, Interaction, and Appeal. Group members should explain how the data model informed the demo design.',
  },
  {
    title: 'User Testing',
    description: 'Testing methodology and key findings',
    content: 'This section will contain the user testing plan, participant profiles, task results, and the five action items that emerged from testing. Group members should explain how findings shaped the final design decisions.',
  },
  {
    title: 'Product Backlog & Sprint Planning',
    description: 'Prioritization approach and story selection',
    content: 'This section will contain the prioritized product backlog, sprint plan, and explanation of what was built versus deferred. Group members should describe the prioritization criteria and trade-offs made.',
  },
  {
    title: 'Change Management',
    description: 'Stakeholder analysis summary',
    content: 'This section will contain the stakeholder analysis, change management one-pager, and how stakeholder needs influenced the portal design. Group members should explain the four stakeholder groups and their concerns.',
  },
  {
    title: 'Technical Approach',
    description: 'Technology choices and architecture rationale',
    content: 'This section will contain the technology stack choices, architecture decisions, and how the demo was built. Group members should explain the key ADRs (tab navigation, CSS approach, chart library, explanation tiers) and their rationale.',
  },
];

export function AppendixPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Appendix</h1>
      {sections.map((section, index) => {
        const isExpanded = expandedIndex === index;
        return (
          <div key={index} className={styles.sectionCard}>
            <button
              className={styles.sectionHeader}
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
            >
              <div className={styles.sectionNumber}>{index + 1}</div>
              <div className={styles.sectionInfo}>
                <div className={styles.sectionName}>{section.title}</div>
                <div className={styles.sectionDescription}>{section.description}</div>
              </div>
              <ChevronDown
                size={16}
                className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
              />
            </button>
            {isExpanded && (
              <div className={styles.sectionContent}>
                <div className={styles.placeholderText}>{section.content}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
