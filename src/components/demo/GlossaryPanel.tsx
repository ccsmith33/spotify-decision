import { ChevronDown, BookOpen } from 'lucide-react';
import type { GlossaryTerm } from '../../data/types';
import styles from './GlossaryPanel.module.css';

interface GlossaryPanelProps {
  terms: GlossaryTerm[];
  isExpanded: boolean;
  onToggle: () => void;
}

export function GlossaryPanel({ terms, isExpanded, onToggle }: GlossaryPanelProps) {
  return (
    <div className={styles.panel}>
      <button className={styles.toggle} onClick={onToggle}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BookOpen size={16} />
          Need help with terms? Open glossary
        </span>
        <ChevronDown
          size={16}
          className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}
        />
      </button>
      {isExpanded && (
        <div className={styles.content}>
          {terms.map(term => (
            <div key={term.term} className={styles.termCard}>
              <div className={styles.termName}>{term.term}</div>
              <div className={styles.termDefinition}>{term.definition}</div>
              <div className={styles.termExample}>{term.example}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
