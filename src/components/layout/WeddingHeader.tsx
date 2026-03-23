import styles from './WeddingHeader.module.css';

interface WeddingHeaderProps {
  title: string;
  subtitle?: string;
  compact?: boolean;
}

export function WeddingHeader({ title, subtitle, compact }: WeddingHeaderProps) {
  return (
    <header className={`${styles.header} ${compact ? styles.compact : ''}`}>
      {!compact && <div className={styles.ornament}>&#10047;</div>}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {!compact && (
        <div className={styles.divider}>
          <span className={styles.line} />
          <span className={styles.heart}>&hearts;</span>
          <span className={styles.line} />
        </div>
      )}
    </header>
  );
}
