import { useEffect, useState } from 'react';
import styles from './IssueAnalysisView.module.css';

interface PlanGenerationStateViewProps {
  onComplete: () => void;
}

export function PlanGenerationStateView({ onComplete }: PlanGenerationStateViewProps) {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const t1 = setTimeout(() => setStage(2), 500);
    const t2 = setTimeout(() => setStage(3), 1000);
    const t3 = setTimeout(() => onComplete(), 1500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <div className={styles.analyzingContainer}>
      <div className={styles.analyzingCard}>
        <div className={styles.analyzingTitle}>Preparing implementation plan...</div>

        <div className={styles.stagesList}>
          <div className={styles.stageRow}>
            <span className={styles.stageCheck}>✓</span>
            <span>Reviewing issue analysis</span>
          </div>

          <div className={styles.stageRow}>
            {stage >= 2 ? (
              <span className={styles.stageCheck}>✓</span>
            ) : (
              <span className={styles.stageArrow}>→</span>
            )}
            <span style={{ opacity: stage >= 2 ? 1 : 0.8 }}>
              Mapping affected code & dependencies
            </span>
          </div>

          <div className={styles.stageRow}>
            {stage >= 3 ? (
              <span className={styles.stageCheck}>✓</span>
            ) : stage === 2 ? (
              <span className={styles.stageArrow}>→</span>
            ) : (
              <span style={{ opacity: 0.4 }}>○</span>
            )}
            <span style={{ opacity: stage >= 3 ? 1 : stage === 2 ? 0.8 : 0.4 }}>
              Determining implementation steps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
