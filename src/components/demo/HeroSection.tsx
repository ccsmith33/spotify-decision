import styles from './HeroSection.module.css';

export function HeroSection() {
  return (
    <div className={styles.hero}>
      <div className={styles.tag}>TRANSPARENCY PORTAL</div>
      <h1 className={styles.title}>Algorithmic Transparency</h1>
      <p className={styles.subtitle}>
        Understand how your music recommendations are made, how we ensure fairness,
        and how to challenge decisions you disagree with.
      </p>
    </div>
  );
}
