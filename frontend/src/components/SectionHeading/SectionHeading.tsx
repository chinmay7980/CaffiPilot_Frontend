import type { ReactNode } from 'react';
import styles from './SectionHeading.module.css';

interface SectionHeadingProps {
  label?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  label,
  title,
  subtitle,
  centered = false,
  className = '',
}: SectionHeadingProps) {
  const cls = [
    styles.heading,
    centered ? styles.centered : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cls}>
      {label && (
        <div className={styles.label}>
          <span className={styles.labelDot} />
          {label}
        </div>
      )}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
}
