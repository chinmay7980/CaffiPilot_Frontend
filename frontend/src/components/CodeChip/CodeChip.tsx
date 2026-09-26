import type { ReactNode } from 'react';
import styles from './CodeChip.module.css';

interface CodeChipProps {
  children: ReactNode;
  className?: string;
}

export function CodeChip({ children, className = '' }: CodeChipProps) {
  return (
    <code className={`${styles.chip} ${className}`.trim()}>
      {children}
    </code>
  );
}
