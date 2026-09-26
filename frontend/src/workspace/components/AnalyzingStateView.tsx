import { useEffect, useState } from 'react';
import styles from './IssueAnalysisView.module.css';

interface AnalyzingStateViewProps {
  onComplete: () => void;
}

export function AnalyzingStateView({ onComplete }: AnalyzingStateViewProps) {
  const [stage, setStage] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setStage(2), 600);
    const timer2 = setTimeout(() => setStage(3), 1200);
    const timer3 = setTimeout(() => onComplete(), 1800);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className={styles.analyzingContainer}>
      <div className={styles.analyzingCard}>
        <div className={styles.analyzingTitle}>Analyzing Issue...</div>

        <div className={styles.stagesList}>
          <div className={styles.stageRow}>
            <span className={styles.stageCheck}>✓</span>
            <span>Understanding issue</span>
          </div>

          <div className={styles.stageRow}>
            {stage >= 2 ? (
              <span className={styles.stageCheck}>✓</span>
            ) : (
              <span className={styles.stageArrow}>→</span>
            )}
            <span style={{ opacity: stage >= 2 ? 1 : 0.8 }}>
              Inspecting repository context
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
              Identifying relevant files
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
