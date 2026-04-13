import { useState } from 'react';
import type { DetailLevel, AppealFormData } from '../../data/types';
import { decisions, explanations } from '../../data/decisions';
import { recommendations } from '../../data/recommendations';
import { fairnessAudits } from '../../data/fairness';
import { appeals } from '../../data/appeals';
import { glossaryTerms } from '../../data/glossary';
import { HeroSection } from './HeroSection';
import { GlossaryPanel } from './GlossaryPanel';
import { DecisionCard } from './DecisionCard';
import { RecommendationList } from './RecommendationList';
import { TransparencyControls } from './TransparencyControls';
import { FairnessSection } from './FairnessSection';
import { DecisionHistory } from './DecisionHistory';
import { AppealSection } from './AppealSection';
import styles from './DemoPage.module.css';

interface DemoPageProps {
  detailLevel: DetailLevel;
  onDetailLevelChange: (level: DetailLevel) => void;
}

export function DemoPage({ detailLevel, onDetailLevelChange }: DemoPageProps) {
  const [glossaryExpanded, setGlossaryExpanded] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const decisionCardData = [
    { decision: decisions[0], explanation: explanations[0] },
    { decision: decisions[1], explanation: explanations[1] },
    { decision: decisions[2], explanation: explanations[2] },
  ];

  const handleAppealSubmit = (_data: AppealFormData) => {
    // Mock submission - handled in AppealSection
  };

  return (
    <div className={styles.page}>
      <HeroSection />

      <GlossaryPanel
        terms={glossaryTerms}
        isExpanded={glossaryExpanded}
        onToggle={() => setGlossaryExpanded(prev => !prev)}
      />

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>How Your Recommendations Work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--spacing-base)' }}>
          {decisionCardData.map(({ decision, explanation }) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              explanation={explanation}
              detailLevel={detailLevel}
            />
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Recent Recommendations</h2>
        <RecommendationList recommendations={recommendations} detailLevel={detailLevel} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Transparency Controls</h2>
        <TransparencyControls
          detailLevel={detailLevel}
          onDetailLevelChange={onDetailLevelChange}
          notificationsEnabled={notificationsEnabled}
          onNotificationsToggle={() => setNotificationsEnabled(prev => !prev)}
        />
      </div>

      <div className={styles.section}>
        <FairnessSection audits={fairnessAudits} />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Decision History</h2>
        <DecisionHistory decisions={decisions} detailLevel={detailLevel} />
      </div>

      <div className={styles.section} id="appeal-section">
        <h2 className={styles.sectionTitle}>Challenge a Decision</h2>
        <AppealSection existingAppeals={appeals} onSubmit={handleAppealSubmit} />
      </div>
    </div>
  );
}
