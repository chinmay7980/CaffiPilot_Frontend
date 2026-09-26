import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeVariant = 'verified' | 'running' | 'failed' | 'info' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  dot?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({
  variant = 'neutral',
  dot = true,
  children,
  className = '',
}: BadgeProps) {
  const cls = [styles.badge, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={cls}>
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
