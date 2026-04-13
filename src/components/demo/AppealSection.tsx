import { useState } from 'react';
import type { Appeal, AppealFormData } from '../../data/types';
import styles from './AppealSection.module.css';

interface AppealSectionProps {
  existingAppeals: Appeal[];
  onSubmit: (data: AppealFormData) => void;
}

const statusStyles: Record<Appeal['status'], string> = {
  submitted: styles.statusSubmitted,
  under_review: styles.statusUnderReview,
  resolved: styles.statusResolved,
  escalated: styles.statusEscalated,
};

const statusLabels: Record<Appeal['status'], string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  resolved: 'Resolved',
  escalated: 'Escalated',
};

const categoryLabels: Record<Appeal['category'], string> = {
  recommendation_quality: 'Recommendation Quality',
  visibility_bias: 'Visibility Bias',
  content_filtering: 'Content Filtering',
  ranking_fairness: 'Ranking Fairness',
};

export function AppealSection({ existingAppeals, onSubmit }: AppealSectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const [category, setCategory] = useState<Appeal['category']>('recommendation_quality');
  const [description, setDescription] = useState('');
  const [desiredOutcome, setDesiredOutcome] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ category, description, desiredOutcome });
    setSubmitted(true);
    setDescription('');
    setDesiredOutcome('');
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>Submit an Appeal</h3>
          {submitted && (
            <div className={styles.successMessage}>
              Appeal submitted successfully. You will receive a response within 5-7 business days.
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>What type of decision are you challenging?</label>
              <select
                className={styles.select}
                value={category}
                onChange={e => setCategory(e.target.value as Appeal['category'])}
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Describe the issue</label>
              <textarea
                className={styles.textarea}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Explain what happened and why you believe the decision was unfair..."
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>What outcome would you like?</label>
              <textarea
                className={styles.textarea}
                value={desiredOutcome}
                onChange={e => setDesiredOutcome(e.target.value)}
                placeholder="Describe the change you would like to see..."
                style={{ minHeight: '60px' }}
              />
            </div>

            <button type="submit" className={styles.submitButton}>Submit Appeal</button>
          </form>
        </div>

        <div className={styles.processCard}>
          <h3 className={styles.processTitle}>How the Appeal Process Works</h3>
          <ol className={styles.steps}>
            <li className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Submit Your Concern</div>
                <div className={styles.stepDescription}>
                  Describe the decision you want reviewed and what outcome you are looking for.
                </div>
              </div>
            </li>
            <li className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Human Review</div>
                <div className={styles.stepDescription}>
                  A member of our review team examines your concern, the algorithm's decision, and your listening data.
                </div>
              </div>
            </li>
            <li className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Decision</div>
                <div className={styles.stepDescription}>
                  The reviewer determines whether an adjustment is warranted. Timeline: 5-7 business days.
                </div>
              </div>
            </li>
            <li className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>Resolution</div>
                <div className={styles.stepDescription}>
                  You receive the outcome via your account email with full details.
                </div>
              </div>
            </li>
          </ol>

          <div className={styles.outcomesBox}>
            <div className={styles.outcomesTitle}>After Review, You Will Receive:</div>
            <ul className={styles.outcomesList}>
              <li>The review decision and reasoning</li>
              <li>Specific actions taken (if any adjustments were made)</li>
              <li>Explanation of how the decision was evaluated</li>
              <li>How to escalate if you are dissatisfied with the outcome</li>
            </ul>
          </div>
        </div>

        <div className={styles.previousAppeals}>
          <h3 className={styles.previousTitle}>Your Previous Appeals</h3>
          {existingAppeals.map(appeal => (
            <div key={appeal.id} className={styles.appealItem}>
              <div className={styles.appealHeader}>
                <span className={`${styles.statusBadge} ${statusStyles[appeal.status]}`}>
                  {statusLabels[appeal.status]}
                </span>
                <span className={styles.appealDate}>
                  {new Date(appeal.submittedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                  })}
                </span>
                <span className={styles.appealDate}>{categoryLabels[appeal.category]}</span>
              </div>
              <p className={styles.appealDescription}>{appeal.description}</p>
              {appeal.resolution && (
                <div className={styles.appealResolution}>
                  <strong>Resolution:</strong> {appeal.resolution}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
