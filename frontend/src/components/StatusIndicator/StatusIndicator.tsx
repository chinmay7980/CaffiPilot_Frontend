import styles from './StatusIndicator.module.css';

type StatusVariant = 'success' | 'error' | 'active' | 'idle' | 'info';

interface StatusIndicatorProps {
  variant?: StatusVariant;
  label: string;
  className?: string;
}

export function StatusIndicator({
  variant = 'idle',
  label,
  className = '',
}: StatusIndicatorProps) {
  const cls = [styles.indicator, styles[variant], className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={cls}>
      <span className={styles.dot} />
      {label}
    </span>
  );
}
