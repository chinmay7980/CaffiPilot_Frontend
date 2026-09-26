import type { RunPhase } from '../types';
import styles from './ActiveRunView.module.css';

interface RunPhaseBarProps {
  phase: RunPhase;
  isRecovering: boolean;
  isVerified: boolean;
}

export function RunPhaseBar({ phase, isRecovering, isVerified }: RunPhaseBarProps) {
  const p = String(phase).toLowerCase();
  const isFindActive = p === 'find';
  const isFixActive = p === 'fix' || p === 'test';
  const isVerifyActive = p === 'verify' || p === 'complete';

  return (
    <div className={styles.phaseBar}>
      <span
        className={`${styles.phaseStep} ${isFindActive ? styles.active : ''} ${
          isFixActive || isVerifyActive ? styles.verified : ''
        }`}
      >
        FIND
      </span>

      <span className={styles.phaseArrow}>→</span>

      <span
        className={`${styles.phaseStep} ${
          isRecovering ? styles.recovery : isFixActive ? styles.active : ''
        } ${isVerifyActive ? styles.verified : ''}`}
      >
        {isRecovering ? 'RECOVERY' : 'FIX'}
      </span>

      <span className={styles.phaseArrow}>→</span>

      <span
        className={`${styles.phaseStep} ${
          isVerified ? styles.verified : isVerifyActive ? styles.active : ''
        }`}
      >
        {isVerified ? 'VERIFIED' : 'VERIFY'}
      </span>
    </div>
  );
}
