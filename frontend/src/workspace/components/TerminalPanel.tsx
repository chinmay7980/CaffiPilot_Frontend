import { useEffect, useRef } from 'react';
import type { RunStatus } from '../types';
import styles from './ActiveRunView.module.css';

interface TerminalLine {
  type: 'cmd' | 'out' | 'err' | 'ok';
  text: string;
}

interface TerminalPanelProps {
  lines: TerminalLine[];
  status: RunStatus;
}

export function TerminalPanel({ lines, status }: TerminalPanelProps) {
  const terminalBodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
    }
  }, [lines]);

  const s = String(status).toLowerCase();
  const statusText =
    s === 'running'
      ? '● ACTIVE'
      : s === 'verified'
        ? '✓ VERIFIED'
        : s === 'stopped'
          ? '■ STOPPED'
          : s === 'recovering'
            ? '● RECOVERING'
            : '● READY';

  const statusColor =
    s === 'running'
      ? 'var(--color-accent)'
      : s === 'verified'
        ? 'var(--color-success)'
        : s === 'stopped'
          ? 'var(--color-danger)'
          : s === 'recovering'
            ? '#f59e0b'
            : 'var(--color-text-muted)';

  return (
    <div className={styles.terminalPanel}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalTitle}>
          <span>▸</span> Terminal — sandbox-01
        </div>
        <div className={styles.terminalStatusTag} style={{ color: statusColor }}>
          {statusText}
        </div>
      </div>

      <div ref={terminalBodyRef} className={styles.terminalBody}>
        {lines.map((line, idx) => (
          <div key={idx} className={`${styles.terminalLine} ${styles[line.type]}`}>
            {line.text}
          </div>
        ))}
      </div>
    </div>
  );
}
