import { Badge } from '../../components/Badge/Badge';
import type { TaskRun } from '../types';
import styles from './OverviewView.module.css';

interface RunHistoryViewProps {
  runs: TaskRun[];
  onSelectRun: (run: TaskRun) => void;
}

export function RunHistoryView({ runs, onSelectRun }: RunHistoryViewProps) {
  return (
    <div className={styles.container}>
      <div className={styles.welcomeArea}>
        <h1 className={styles.heading}>Run History</h1>
        <p className={styles.description}>
          All past autonomous engineering sessions, verification traces, and execution proofs.
        </p>
      </div>

      {!runs || runs.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>No previous runs</div>
          <p className={styles.emptySubtitle}>Completed autonomous runs will appear here.</p>
        </div>
      ) : (
        <div className={styles.runsList}>
        {runs.map((run) => (
          <div
            key={run.id}
            className={styles.runRow}
            onClick={() => onSelectRun(run)}
            title="Inspect Run"
          >
            <div className={styles.runLeft}>
              <span className={styles.runTaskTitle}>{run.title}</span>
              <span className={styles.runRepoMeta}>
                {run.repo} &bull; {run.branch}
              </span>
            </div>

            <div className={styles.runRight}>
              <span className={styles.runTimestamp}>{run.timestamp}</span>
              <Badge
                variant={
                  run.status === 'Verified'
                    ? 'verified'
                    : run.status === 'Recovered'
                      ? 'info'
                      : run.status === 'RUNNING'
                        ? 'running'
                        : 'neutral'
                }
              >
                {run.status}
              </Badge>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}
