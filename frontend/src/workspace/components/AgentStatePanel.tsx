import type { RunPhase } from '../types';
import styles from './ActiveRunView.module.css';

interface AgentStatePanelProps {
  phase: RunPhase;
  currentAction: string;
  iteration: string;
  filesInspected: number;
  filesChanged: number;
  toolCalls: number;
  recoveryAttempts: number;
}

export function AgentStatePanel({
  phase,
  currentAction,
  iteration,
  filesInspected,
  filesChanged,
  toolCalls,
  recoveryAttempts,
}: AgentStatePanelProps) {
  const p = String(phase).toLowerCase();
  const displayPhase = String(phase).toUpperCase();

  return (
    <aside className={styles.agentStatePanel}>
      {/* Current Agent Execution State */}
      <div className={styles.stateSection}>
        <div className={styles.statePanelTitle}>Agent State</div>

        <div className={styles.stateEntry}>
          <span className={styles.stateLabel}>Current Phase</span>
          <span
            className={`${styles.stateValue} ${
              p === 'recovery'
                ? styles.stateValueHighlight
                : p === 'complete' || p === 'verify'
                  ? styles.stateValue
                  : ''
            }`}
          >
            {displayPhase}
          </span>
        </div>

        <div className={styles.stateEntry}>
          <span className={styles.stateLabel}>Iteration</span>
          <span className={styles.stateValue}>{iteration}</span>
        </div>

        <div className={styles.stateEntry}>
          <span className={styles.stateLabel}>Files Inspected</span>
          <span className={styles.stateValue}>{filesInspected}</span>
        </div>

        <div className={styles.stateEntry}>
          <span className={styles.stateLabel}>Files Changed</span>
          <span className={styles.stateValue}>{filesChanged}</span>
        </div>

        <div className={styles.stateEntry}>
          <span className={styles.stateLabel}>Tool Calls</span>
          <span className={styles.stateValue}>{toolCalls}</span>
        </div>

        <div className={styles.stateEntry}>
          <span className={styles.stateLabel}>Recovery Attempts</span>
          <span
            className={`${styles.stateValue} ${
              recoveryAttempts > 0 ? styles.stateValueHighlight : ''
            }`}
          >
            {recoveryAttempts}
          </span>
        </div>
      </div>

      {/* Current Observable Action */}
      <div className={styles.stateSection}>
        <div className={styles.currentActionBox}>
          <span className={styles.actionLabel}>Current Action</span>
          <span className={styles.actionText}>{currentAction}</span>
        </div>
      </div>

      {/* Focused Context (Section 6) */}
      <div className={styles.stateSection}>
        <div className={styles.statePanelTitle}>Focused Context</div>

        <div className={styles.contextList}>
          <div className={styles.contextCard}>
            <span className={styles.contextPath}>src/cart/cartService.ts</span>
            <span className={styles.contextRole}>Primary</span>
          </div>

          <div className={styles.contextCard}>
            <span className={styles.contextPath}>src/cart/cartController.ts</span>
            <span className={styles.contextRole}>Related</span>
          </div>

          <div className={styles.contextCard}>
            <span className={styles.contextPath}>tests/cart.test.ts</span>
            <span className={styles.contextRole}>Regression coverage</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
