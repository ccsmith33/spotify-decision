import {
  GraduationCap,
  Calendar,
  Clock,
  FileText,
  Database,
  FileBarChart,
  Megaphone,
} from 'lucide-react';
import styles from './AppendixPage.module.css';

const paragraphs = [
  "Our final website was really shaped by how this project developed over the semester. At the beginning, the case was pretty open-ended, so a big part of our work was figuring out what the actual problem was before we could build a solution. Early on, we had to think through fairness, transparency, trust, and accountability, not just from the company's side but from the user's side too. That helped us realize this could not just be a website full of technical AI language. It needed to explain automated decisions in a way normal people could actually understand.",
  "A lot of the middle assignments helped us narrow down what actually needed to be in the site. The backlog especially helped us prioritize the most important features, like plain-language explanations, showing what affects recommendations, having a fairness and oversight section, and giving users a way to appeal decisions they feel are unfair. That made the final product feel a lot more focused, because we were not just adding random pages — we were building around the features that seemed most important to the problem.",
  "The data modeling work also helped shape the final website more than it might seem at first. It forced us to think through what the system would need behind the scenes in order for the site to make sense. Breaking things up into areas like algorithmic decisions, explanations, fairness audits, and appeals helped give structure to the final product. That is a big reason why the website ended up with clear sections for recommendation transparency, fairness metrics, decision history, and challenging a decision instead of just one vague \"AI info\" page.",
  "Overall, the semester's assignments helped us move from a broad idea to a much more complete and realistic website. Instead of just making something that looked good, we were constantly using earlier work to justify what belonged in the portal and how it should function. Things like planning, process thinking, and change management made us think beyond the prototype itself and more about how something like this would actually be rolled out and used in a real organization. So the final website really reflects the whole semester process of understanding the problem, narrowing the priorities, and turning that into a more practical solution.",
];

const relatedAppendices = [
  {
    icon: FileText,
    title: 'Prioritized Product Backlog',
    subtitle: 'MoSCoW ranked · 11 stories',
    accent: 'P0 Must-Have',
  },
  {
    icon: Database,
    title: 'Data Model (ERD)',
    subtitle: '7 entities · decisions, appeals, audits',
    accent: 'Architecture',
  },
  {
    icon: FileBarChart,
    title: 'Usability Test Report',
    subtitle: 'April 1–3, 2026 · 3 personas · 4 tasks',
    accent: 'Validation',
  },
  {
    icon: Megaphone,
    title: 'Rollout & Stakeholder Plan',
    subtitle: 'Phased deployment · change management',
    accent: 'Delivery',
  },
];

export function AppendixPage() {
  return (
    <div className={styles.page}>
      <div className={styles.heroGlow} aria-hidden="true" />

      <header className={styles.heroHeader}>
        <div className={styles.tagRow}>
          <span className={styles.kindTag}>
            <GraduationCap size={13} strokeWidth={2.5} />
            Editorial · Reflection
          </span>
        </div>
        <h1 className={styles.title}>Project Reflection</h1>
        <p className={styles.subtitle}>How the semester shaped the portal</p>
        <div className={styles.metaRow}>
          <span className={styles.metaItem}>
            <Calendar size={13} strokeWidth={2} />
            MIS 430 · Spring 2026
          </span>
          <span className={styles.metaDot} aria-hidden="true" />
          <span className={styles.metaItem}>Final Project</span>
          <span className={styles.metaDot} aria-hidden="true" />
          <span className={styles.metaItem}>
            <Clock size={13} strokeWidth={2} />
            4 min read
          </span>
        </div>
        <div className={styles.eqDivider} aria-hidden="true">
          <span /><span /><span /><span /><span /><span /><span /><span />
        </div>
      </header>

      <article className={styles.essay}>
        {paragraphs.map((paragraph, index) => (
          <div key={index} className={styles.paragraphWrap}>
            {index > 0 && <div className={styles.sectionDivider} aria-hidden="true" />}
            <p
              className={
                index === 0
                  ? `${styles.paragraph} ${styles.paragraphLead}`
                  : styles.paragraph
              }
            >
              {paragraph}
            </p>
          </div>
        ))}

        <aside className={styles.pullQuote}>
          <span className={styles.pullQuoteMark} aria-hidden="true">&ldquo;</span>
          <p className={styles.pullQuoteText}>
            We were constantly using earlier work to justify what belonged in the portal and how it
            should function.
          </p>
          <p className={styles.pullQuoteAttrib}>— Project reflection</p>
        </aside>
      </article>

      <section className={styles.relatedSection}>
        <div className={styles.relatedHeader}>
          <h2 className={styles.relatedTitle}>Related Appendices</h2>
          <p className={styles.relatedHint}>
            Supporting artifacts referenced throughout this reflection
          </p>
        </div>
        <div className={styles.relatedGrid}>
          {relatedAppendices.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className={styles.relatedCard}>
                <span className={styles.relatedIcon}>
                  <Icon size={22} strokeWidth={2} />
                </span>
                <div className={styles.relatedBody}>
                  <p className={styles.relatedCardTitle}>{item.title}</p>
                  <p className={styles.relatedCardSubtitle}>{item.subtitle}</p>
                </div>
                <span className={styles.relatedAccent}>{item.accent}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
