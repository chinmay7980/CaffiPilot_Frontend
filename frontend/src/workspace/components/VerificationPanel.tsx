import { Button } from '../../components/Button/Button';
import type { VerificationCheck } from '../types';
import styles from './ActiveRunView.module.css';

interface VerificationPanelProps {
  isVerified: boolean;
  checks: VerificationCheck[];
  metrics: {
    testsPassed: number;
    filesChanged: number;
    recoveryAttempts: number;
    coverage?: string;
  };
  onViewDiff: () => void;
  onViewTests: () => void;
  onViewVerification?: () => void;
  onNewTask?: () => void;
  onFinish: () => void;
}

export function VerificationPanel({
  isVerified,
  checks,
  metrics,
  onViewDiff,
  onViewTests,
  onViewVerification,
  onNewTask,
  onFinish,
}: VerificationPanelProps) {
  if (!checks || checks.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
          Waiting for verification
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Verification criteria will be evaluated after patches and tests execute.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.verificationContainer}>
      {/* Hero Card */}
      <div className={styles.verifiedHeroCard}>
        <div className={styles.verifiedHeadline}>
          <span>Autonomous Verification</span>
          {isVerified ? (
            <span className={styles.verifiedBadgeBig}>VERIFIED</span>
          ) : (
            <span className={styles.runningBadgeBig}>EVALUATING CHECKS</span>
          )}
        </div>

        <p className={styles.verifiedDesc}>
          {isVerified
            ? 'Fix successfully completed. All required targeted assertions, regression test suites, static diagnostics, and production build checks have passed without errors.'
            : 'Evaluating repository checks to ensure no regressions or collateral side-effects were introduced.'}
        </p>

        {isVerified && (
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: '4px 0 14px 0' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>Issue: </span>
            <strong style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-mono)' }}>
              #412 &mdash; Fix duplicate cart items
            </strong>
          </div>
        )}

        {/* Verification Metrics Row */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <span className={styles.metricNum}>{metrics.testsPassed}</span>
            <span className={styles.metricLabel}>Tests Passed</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricNum}>{metrics.filesChanged}</span>
            <span className={styles.metricLabel}>Files Changed</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricNum}>{metrics.recoveryAttempts}</span>
            <span className={styles.metricLabel}>Recovery Attempt</span>
          </div>

          <div className={styles.metricCard}>
            <span className={styles.metricNum}>{isVerified ? '✓' : '...'}</span>
            <span className={styles.metricLabel}>Verification Complete</span>
          </div>
        </div>

        {/* Section 12 & 17: Actions when Verified */}
        {isVerified && (
          <div className={styles.finalActionsRow}>
            <Button variant="ghost" size="sm" onClick={onViewDiff}>
              View Diff
            </Button>
            <Button variant="ghost" size="sm" onClick={onViewTests}>
              View Tests
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onViewVerification || (() => {})}
            >
              View Verification
            </Button>
            <Button variant="primary" size="sm" onClick={onNewTask || onFinish}>
              New Task
            </Button>
          </div>
        )}
      </div>

      {/* State-Driven Verification Checklist (Section 10 & 11) */}
      <div className={styles.verificationChecklist}>
        {checks.map((chk) => {
          const isPassed = chk.status === 'passed';
          const isFailed = chk.status === 'failed';
          const isRunning = chk.status === 'running';

          return (
            <div key={chk.id} className={styles.checkRow}>
              <div className={styles.checkLeft}>
                <span
                  className={
                    isPassed
                      ? styles.checkIconPassed
                      : isFailed
                        ? styles.checkIconFailed
                        : isRunning
                          ? styles.checkIconRunning
                          : styles.checkIconPending
                  }
                >
                  {isPassed ? '✓' : isFailed ? '✕' : isRunning ? '●' : '○'}
                </span>

                <div>
                  <div className={styles.checkTitle}>{chk.label}</div>
                  {chk.detail && (
                    <div className={styles.checkSubtitle}>{chk.detail}</div>
                  )}
                </div>
              </div>

              <div>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: isPassed
                      ? 'var(--color-success)'
                      : isFailed
                        ? 'var(--color-danger)'
                        : isRunning
                          ? 'var(--color-accent)'
                          : 'var(--color-text-muted)',
                  }}
                >
                  {isPassed
                    ? 'Verified'
                    : isFailed
                      ? 'Failed'
                      : isRunning
                        ? 'Checking...'
                        : 'Pending'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
