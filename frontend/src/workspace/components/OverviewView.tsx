import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import type { TaskRun } from '../types';
import styles from './OverviewView.module.css';

interface OverviewViewProps {
  runs: TaskRun[];
  activeRun?: TaskRun;
  onNewTask: () => void;
  onSelectRun: (run: TaskRun) => void;
  onViewActiveRun?: () => void;
}

export function OverviewView({
  runs,
  activeRun,
  onNewTask,
  onSelectRun,
  onViewActiveRun,
}: OverviewViewProps) {
  const hasActiveOrCompletedRun =
    activeRun &&
    activeRun.status !== 'Ready' &&
    activeRun.status !== 'idle';

  return (
    <div className={styles.container}>
      <div className={styles.welcomeArea}>
        <h1 className={styles.heading}>Welcome to CaffiPilot</h1>
        <p className={styles.description}>
          Turn a software-engineering issue into a verified patch.
        </p>

        <div className={styles.ctaRow}>
          <Button variant="primary" size="md" onClick={onNewTask}>
            + New Task
          </Button>
        </div>
      </div>

      {/* Active Run Session Card */}
      {hasActiveOrCompletedRun && (
        <div className={styles.activeRunCard}>
          <div className={styles.activeRunLeft}>
            <div className={styles.activeRunHeader}>
              <Badge
                variant={
                  activeRun.status === 'Verified'
                    ? 'verified'
                    : activeRun.status === 'RUNNING'
                      ? 'running'
                      : activeRun.status === 'Recovered'
                        ? 'info'
                        : 'neutral'
                }
              >
                {activeRun.status === 'Verified'
                  ? 'VERIFIED'
                  : typeof activeRun.status === 'string'
                    ? activeRun.status.toUpperCase()
                    : 'RUNNING'}
              </Badge>
              <span className={styles.activeRunTask}>{activeRun.title}</span>
            </div>
            <span className={styles.activeRunMeta}>
              {activeRun.repo} &bull; {activeRun.branch} &bull; Phase: {activeRun.phase}
            </span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onViewActiveRun || (() => onSelectRun(activeRun))}
          >
            {activeRun.status === 'Verified' ? 'View Result' : 'View Run'}
          </Button>
        </div>
      )}

      <div className={styles.recentSection}>
        <div className={styles.recentTitle}>Recent Runs</div>

        {!runs || runs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyTitle}>No previous runs</div>
            <p className={styles.emptySubtitle}>Start a new task to begin an autonomous run.</p>
          </div>
        ) : (
          <div className={styles.runsList}>
            {runs.map((run) => (
              <div
                key={run.id}
                className={styles.runRow}
                onClick={() => onSelectRun(run)}
                title="View Run details"
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
    </div>
  );
}
