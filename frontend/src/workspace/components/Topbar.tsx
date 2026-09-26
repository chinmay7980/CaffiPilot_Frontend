import type { Repository } from '../types';
import styles from './Topbar.module.css';

interface TopbarProps {
  selectedRepo: Repository;
  onOpenRepoSelector: () => void;
  activeTaskTitle?: string;
  runStatus: 'Ready' | 'RUNNING' | 'Verified';
  onOpenSettings: () => void;
}

export function Topbar({
  selectedRepo,
  onOpenRepoSelector,
  activeTaskTitle,
  runStatus,
  onOpenSettings,
}: TopbarProps) {
  const statusClass =
    runStatus === 'RUNNING'
      ? styles.statusRunning
      : runStatus === 'Verified'
        ? styles.statusVerified
        : styles.statusReady;

  return (
    <header className={styles.topbar}>
      <div className={styles.leftSection}>
        <button
          type="button"
          className={styles.repoBadge}
          onClick={onOpenRepoSelector}
          title="Switch Repository"
        >
          <span className={styles.repoIcon}>◫</span>
          <span>{selectedRepo.name}</span>
          <span className={styles.repoDivider}>/</span>
          <span className={styles.branchName}>{selectedRepo.branch}</span>
          <span style={{ fontSize: 9, opacity: 0.6, marginLeft: 2 }}>▼</span>
        </button>

        {activeTaskTitle && (
          <div className={styles.taskIndicator}>
            <span>Task:</span>
            <span className={styles.taskTitle}>{activeTaskTitle}</span>
          </div>
        )}
      </div>

      <div className={styles.rightSection}>
        <div className={`${styles.statusPill} ${statusClass}`}>
          <span className={styles.statusDot} />
          <span>● {runStatus}</span>
        </div>

        <button
          type="button"
          className={styles.profileButton}
          onClick={onOpenSettings}
          title="Settings"
          aria-label="Settings"
        >
          ⚙
        </button>
      </div>
    </header>
  );
}
