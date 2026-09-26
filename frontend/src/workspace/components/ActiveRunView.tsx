import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import type { TaskRun, ActiveRunTab, RunState, RunDataSource } from '../types';
import { MockRunDataSource } from '../runAdapter';
import { RunPhaseBar } from './RunPhaseBar';
import { AgentActivityFeed } from './AgentActivityFeed';
import { AgentStatePanel } from './AgentStatePanel';
import { TerminalPanel } from './TerminalPanel';
import { DiffPanel } from './DiffPanel';
import { TestPanel } from './TestPanel';
import { VerificationPanel } from './VerificationPanel';
import styles from './ActiveRunView.module.css';

interface ActiveRunViewProps {
  run: TaskRun;
  dataSource?: RunDataSource | null;
  onStopRun: () => void;
  onResumeRun?: () => void;
  onFinish?: () => void;
  onNewTask?: () => void;
}

export function ActiveRunView({
  run,
  dataSource,
  onStopRun,
  onResumeRun,
  onFinish,
  onNewTask,
}: ActiveRunViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveRunTab>('activity');

  // Fallback RunDataSource instance if not supplied by WorkspaceShell
  const localDataSourceRef = useRef<RunDataSource | null>(null);
  if (!dataSource && !localDataSourceRef.current) {
    localDataSourceRef.current = new MockRunDataSource({
      id: run.id,
      task: run.title,
      repository: run.repo,
      branch: run.branch,
      issueNumber: '#412',
    });
  }

  const activeDataSource = dataSource || localDataSourceRef.current;
  const [runState, setRunState] = useState<RunState>(() =>
    activeDataSource
      ? activeDataSource.getRun()
      : {
          id: run.id,
          task: run.title,
          repository: run.repo,
          branch: run.branch,
          issueNumber: '#412',
          phase: 'find',
          status: 'running',
          iteration: 1,
          maxIterations: 12,
          filesInspected: 0,
          filesChanged: 0,
          toolCalls: 0,
          recoveryAttempts: 0,
          currentAction: 'Initializing run environment',
          activity: [],
          changedFiles: [],
          tests: [],
          verification: [],
          terminalLines: [],
        }
  );

  useEffect(() => {
    if (!activeDataSource) return;
    setRunState(activeDataSource.getRun());
    const unsubscribe = activeDataSource.subscribe((updated) => {
      setRunState(updated);
    });
    return () => {
      unsubscribe();
    };
  }, [activeDataSource]);

  const isVerified = runState.status === 'verified' || runState.phase === 'complete';
  const isRecovering = runState.phase === 'recovery' || runState.status === 'recovering';
  const isStopped = runState.status === 'stopped';

  const handleTogglePause = () => {
    if (!activeDataSource) return;
    if (isStopped) {
      activeDataSource.resume();
      if (onResumeRun) onResumeRun();
    } else {
      activeDataSource.stop();
      onStopRun();
    }
  };

  const handleFinish = () => {
    if (onFinish) {
      onFinish();
    } else {
      onStopRun();
    }
  };

  // Test suite stats
  const targetedSuite = runState.tests.find((s) => s.id === 'targeted');
  const fullSuite = runState.tests.find((s) => s.id === 'full');
  const totalTestsPassed =
    fullSuite?.status === 'passed'
      ? fullSuite.passed
      : targetedSuite?.status === 'passed'
        ? targetedSuite.passed
        : targetedSuite?.passed || 0;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.runHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.taskTitle}>
            <span>{runState.task}</span>
            <Badge
              variant={
                isVerified
                  ? 'verified'
                  : isStopped
                    ? 'failed'
                    : isRecovering
                      ? 'info'
                      : runState.status === 'failed'
                        ? 'failed'
                        : 'running'
              }
            >
              {isVerified
                ? 'VERIFIED'
                : isRecovering
                  ? 'RECOVERING'
                  : isStopped
                    ? 'STOPPED'
                    : runState.status.toUpperCase()}
            </Badge>
          </div>
          <span className={styles.repoMeta}>
            {runState.repository} &bull; {runState.branch} &bull; Issue {runState.issueNumber || '#412'}
          </span>
        </div>

        <div className={styles.headerRight}>
          <RunPhaseBar
            phase={runState.phase}
            isRecovering={isRecovering}
            isVerified={isVerified}
          />

          {isVerified ? (
            <Button variant="primary" size="sm" onClick={handleFinish}>
              Finish
            </Button>
          ) : (
            <Button
              variant={isStopped ? 'primary' : 'ghost'}
              size="sm"
              onClick={handleTogglePause}
            >
              {isStopped ? 'Resume Run' : 'Stop Run'}
            </Button>
          )}
        </div>
      </div>

      {/* Completion Banner when Verified */}
      {isVerified && (
        <div className={styles.completionBanner}>
          <div className={styles.completionLeft}>
            <span className={styles.completionBadge}>VERIFIED</span>
            <span className={styles.completionText}>
              ✓ Autonomous verification succeeded &bull; 47 tests passed &bull; 2 files changed &bull; 1 recovery attempt
            </span>
          </div>

          <div className={styles.completionActions}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('diff')}
            >
              View Diff
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('tests')}
            >
              View Tests
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab('verification')}
            >
              View Verification
            </Button>
            <Button variant="primary" size="sm" onClick={onNewTask || handleFinish}>
              New Task
            </Button>
          </div>
        </div>
      )}

      {/* Tab Nav */}
      <div className={styles.tabNav}>
        <div className={styles.tabButtonsGroup}>
          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'activity' ? styles.active : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            <span>Activity</span>
            <span className={styles.tabPill}>{runState.activity.length}</span>
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'diff' ? styles.active : ''}`}
            onClick={() => setActiveTab('diff')}
          >
            <span>Diff</span>
            {runState.changedFiles.length > 0 && (
              <span className={styles.tabPill}>+{runState.changedFiles.length}</span>
            )}
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'tests' ? styles.active : ''}`}
            onClick={() => setActiveTab('tests')}
          >
            <span>Tests</span>
            {targetedSuite?.status === 'failed' ? (
              <span className={`${styles.tabPill} ${styles.tabPillDanger}`}>
                {targetedSuite.failed} failed
              </span>
            ) : targetedSuite?.status === 'passed' ? (
              <span className={`${styles.tabPill} ${styles.tabPillSuccess}`}>
                {isVerified ? '47/47' : '14/14'}
              </span>
            ) : null}
          </button>

          <button
            type="button"
            className={`${styles.tabButton} ${activeTab === 'verification' ? styles.active : ''}`}
            onClick={() => setActiveTab('verification')}
          >
            <span>Verification</span>
            {isVerified && (
              <span className={`${styles.tabPill} ${styles.tabPillSuccess}`}>
                ✓
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Middle Body */}
      <div className={styles.runBody}>
        <div className={styles.tabContent}>
          {activeTab === 'activity' && (
            <AgentActivityFeed
              events={runState.activity}
              onViewTests={() => setActiveTab('tests')}
              onViewDiff={() => setActiveTab('diff')}
            />
          )}

          {activeTab === 'diff' && (
            <DiffPanel diffFiles={runState.changedFiles} />
          )}

          {activeTab === 'tests' && (
            <TestPanel testSuites={runState.tests} />
          )}

          {activeTab === 'verification' && (
            <VerificationPanel
              isVerified={isVerified}
              checks={runState.verification}
              metrics={{
                testsPassed: totalTestsPassed,
                filesChanged: runState.filesChanged,
                recoveryAttempts: runState.recoveryAttempts || 1,
              }}
              onViewDiff={() => setActiveTab('diff')}
              onViewTests={() => setActiveTab('tests')}
              onViewVerification={() => setActiveTab('verification')}
              onNewTask={onNewTask || handleFinish}
              onFinish={handleFinish}
            />
          )}
        </div>

        {/* Compact Right Panel: Agent State & Focused Context */}
        <AgentStatePanel
          phase={runState.phase}
          currentAction={runState.currentAction}
          iteration={`${runState.iteration} / ${runState.maxIterations}`}
          filesInspected={runState.filesInspected}
          filesChanged={runState.filesChanged}
          toolCalls={runState.toolCalls}
          recoveryAttempts={runState.recoveryAttempts}
        />
      </div>

      {/* Terminal Bottom Panel */}
      <TerminalPanel
        lines={runState.terminalLines}
        status={
          runState.status === 'running'
            ? 'RUNNING'
            : runState.status === 'verified'
              ? 'Verified'
              : runState.status === 'stopped'
                ? 'STOPPED'
                : 'Ready'
        }
      />
    </div>
  );
}
