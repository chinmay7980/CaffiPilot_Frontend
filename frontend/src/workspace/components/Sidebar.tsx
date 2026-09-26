import type { WorkspaceView } from '../types';
import styles from './Sidebar.module.css';

interface SidebarProps {
  currentView: WorkspaceView;
  onSelectView: (view: WorkspaceView) => void;
  onNavigateLanding: () => void;
  hasAnalysis?: boolean;
  hasPlan?: boolean;
}

export function Sidebar({
  currentView,
  onSelectView,
  onNavigateLanding,
  hasAnalysis,
  hasPlan,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div>
        <button
          type="button"
          className={styles.brand}
          onClick={onNavigateLanding}
          title="Back to Landing Page"
        >
          <span className={styles.brandIcon}>☕</span>
          <span>
            Caffi<span className={styles.brandAccent}>Pilot</span>
          </span>
        </button>

        <nav className={styles.navSections}>
          {/* WORKSPACE */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionLabel}>Workspace</div>
            <button
              type="button"
              className={`${styles.navItem} ${currentView === 'overview' ? styles.active : ''}`}
              onClick={() => onSelectView('overview')}
            >
              <span className={styles.itemIcon}>◫</span>
              <span>Overview</span>
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${currentView === 'new-task' ? styles.active : ''}`}
              onClick={() => onSelectView('new-task')}
            >
              <span className={styles.itemIcon}>+</span>
              <span>New Task</span>
            </button>
            {(currentView === 'analysis' || hasAnalysis) && (
              <button
                type="button"
                className={`${styles.navItem} ${currentView === 'analysis' ? styles.active : ''}`}
                onClick={() => onSelectView('analysis')}
              >
                <span className={styles.itemIcon}>🔍</span>
                <span>Issue Analysis</span>
              </button>
            )}
            {(currentView === 'plan' || hasPlan) && (
              <button
                type="button"
                className={`${styles.navItem} ${currentView === 'plan' ? styles.active : ''}`}
                onClick={() => onSelectView('plan')}
              >
                <span className={styles.itemIcon}>📋</span>
                <span>Implementation Plan</span>
              </button>
            )}
            <button
              type="button"
              className={`${styles.navItem} ${currentView === 'active-run' ? styles.active : ''}`}
              onClick={() => onSelectView('active-run')}
            >
              <span className={styles.itemIcon}>⚡</span>
              <span>Active Run</span>
            </button>
          </div>

          {/* DEVELOPMENT */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionLabel}>Development</div>
            <button
              type="button"
              className={`${styles.navItem} ${currentView === 'repositories' ? styles.active : ''}`}
              onClick={() => onSelectView('repositories')}
            >
              <span className={styles.itemIcon}>⎔</span>
              <span>Repositories</span>
            </button>
            <button
              type="button"
              className={`${styles.navItem} ${currentView === 'history' ? styles.active : ''}`}
              onClick={() => onSelectView('history')}
            >
              <span className={styles.itemIcon}>◷</span>
              <span>Run History</span>
            </button>
          </div>

          {/* SYSTEM */}
          <div className={styles.sectionGroup}>
            <div className={styles.sectionLabel}>System</div>
            <button
              type="button"
              className={`${styles.navItem} ${currentView === 'settings' ? styles.active : ''}`}
              onClick={() => onSelectView('settings')}
            >
              <span className={styles.itemIcon}>⚙</span>
              <span>Settings</span>
            </button>
          </div>
        </nav>
      </div>

      <div className={styles.footerSection}>
        <div className={styles.githubStatus}>
          <span>GitHub</span>
          <div className={styles.statusIndicator}>
            <span className={styles.statusDot} />
            <span>Connected</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.backLink}
          onClick={onNavigateLanding}
        >
          ← Back to website
        </button>
      </div>
    </aside>
  );
}
