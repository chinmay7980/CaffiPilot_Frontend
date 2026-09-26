import { useState, useEffect } from 'react';
import { Button } from '../components/Button/Button';
import { Topbar } from './components/Topbar';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { NewTaskView } from './components/NewTaskView';
import { RepositoriesView } from './components/RepositoriesView';
import { IssueAnalysisView } from './components/IssueAnalysisView';
import { AnalyzingStateView } from './components/AnalyzingStateView';
import { PlanGenerationStateView } from './components/PlanGenerationStateView';
import { ImplementationPlanView } from './components/ImplementationPlanView';
import { ActiveRunView } from './components/ActiveRunView';
import { RunHistoryView } from './components/RunHistoryView';
import { SettingsView } from './components/SettingsView';
import { MockRunDataSource } from './runAdapter';
import {
  INITIAL_REPOSITORIES,
  INITIAL_RUNS,
  DEFAULT_ANALYSIS_DATA,
  DEFAULT_PLAN_DATA,
} from './mockData';
import type {
  WorkspaceView,
  Repository,
  TaskRun,
  TaskState,
  IssueAnalysisData,
  ImplementationPlanData,
  RunDataSource,
} from './types';
import styles from './WorkspaceShell.module.css';

interface WorkspaceShellProps {
  onNavigateLanding: () => void;
  initialSubRoute?: string;
}

export function WorkspaceShell({ onNavigateLanding, initialSubRoute }: WorkspaceShellProps) {
  const resolveInitialView = (sub?: string): WorkspaceView => {
    switch (sub) {
      case 'new-task':
      case 'task':
        return 'new-task';
      case 'analysis':
        return 'analysis';
      case 'plan':
        return 'plan';
      case 'active-run':
      case 'run':
        return 'active-run';
      case 'repositories':
        return 'repositories';
      case 'history':
        return 'history';
      case 'settings':
        return 'settings';
      default:
        return 'overview';
    }
  };

  const [currentView, setCurrentView] = useState<WorkspaceView>(() =>
    resolveInitialView(initialSubRoute)
  );
  const [repositories] = useState<Repository[]>(INITIAL_REPOSITORIES);
  const [selectedRepo, setSelectedRepo] = useState<Repository>(INITIAL_REPOSITORIES[0]);
  const [runs, setRuns] = useState<TaskRun[]>(INITIAL_RUNS);

  // Issue analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<IssueAnalysisData>(DEFAULT_ANALYSIS_DATA);

  // Implementation plan state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<ImplementationPlanData>(DEFAULT_PLAN_DATA);

  // Lifted RunDataSource instance
  const [activeRunDataSource, setActiveRunDataSource] = useState<RunDataSource | null>(null);

  // Active run state (CRITICAL RULE: NOT initialized / started until user approves the plan)
  const [activeRun, setActiveRun] = useState<TaskRun>({
    id: 'run-pending',
    title: 'Fix duplicate cart items',
    repo: 'ecommerce-app',
    branch: 'main',
    status: 'Ready',
    phase: 'FIND',
    timestamp: 'Idle',
  });

  useEffect(() => {
    if (initialSubRoute) {
      setCurrentView(resolveInitialView(initialSubRoute));
    }
  }, [initialSubRoute]);

  // Synchronize active run data source state & archive completed runs
  useEffect(() => {
    if (!activeRunDataSource) return;

    const unsubscribe = activeRunDataSource.subscribe((state) => {
      const isVerified = state.status === 'verified';
      const isStopped = state.status === 'stopped';
      const isRecovering = state.status === 'recovering';

      const updatedTaskRun: TaskRun = {
        id: state.id,
        title: state.task,
        repo: state.repository,
        branch: state.branch,
        status: isVerified
          ? 'Verified'
          : isStopped
            ? 'STOPPED'
            : isRecovering
              ? 'Recovered'
              : state.status === 'failed'
                ? 'Failed'
                : 'RUNNING',
        phase: (state.phase === 'complete' ? 'COMPLETE' : state.phase.toUpperCase()) as any,
        timestamp: 'Just now',
        iteration: `${state.iteration} / ${state.maxIterations}`,
        filesInspected: state.filesInspected,
        filesChanged: state.filesChanged,
        toolCalls: state.toolCalls,
        recoveryAttempts: state.recoveryAttempts,
        activity: state.activity,
      };

      setActiveRun(updatedTaskRun);

      if (isVerified) {
        setRuns((prev) => {
          const existingIdx = prev.findIndex((r) => r.id === state.id);
          const verifiedItem: TaskRun = {
            ...updatedTaskRun,
            status: 'Verified',
            phase: 'COMPLETE',
            timestamp: 'Just now',
          };
          if (existingIdx >= 0) {
            const next = [...prev];
            next[existingIdx] = verifiedItem;
            return next;
          }
          return [verifiedItem, ...prev];
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [activeRunDataSource]);

  const handleStartAnalysis = (taskState: TaskState) => {
    setIsAnalyzing(true);
    const issueNum = taskState.issueNumber || '#412';
    setCurrentAnalysis({
      ...DEFAULT_ANALYSIS_DATA,
      issueNumber: issueNum,
      title: taskState.title,
      repo: taskState.repository,
      branch: taskState.branch,
      problem: taskState.description,
    });
    setCurrentPlan({
      ...DEFAULT_PLAN_DATA,
      issueNumber: issueNum,
      title: taskState.title,
      repo: taskState.repository,
      branch: taskState.branch,
    });
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
    setCurrentView('analysis');
  };

  const handleGeneratePlan = () => {
    setIsGeneratingPlan(true);
  };

  const handlePlanGenerationComplete = () => {
    setIsGeneratingPlan(false);
    setCurrentView('plan');
  };

  const handleRejectPlan = () => {
    // Return to issue analysis without creating a new task
    setCurrentView('analysis');
  };

  const handleApprovePlan = () => {
    // Phase 5C approval flow: Initialize Active Run entry state only after approval
    const runId = `run-${Date.now().toString().slice(-4)}`;
    const ds = new MockRunDataSource({
      id: runId,
      task: currentPlan.title,
      repository: currentPlan.repo,
      branch: currentPlan.branch,
      issueNumber: currentPlan.issueNumber,
    });
    setActiveRunDataSource(ds);
    setActiveRun({
      id: runId,
      title: currentPlan.title,
      repo: currentPlan.repo,
      branch: currentPlan.branch,
      status: 'RUNNING',
      phase: 'FIND',
      timestamp: 'Just now',
      iteration: '1 / 12',
      filesInspected: 0,
      filesChanged: 0,
      toolCalls: 0,
      recoveryAttempts: 0,
      activity: [
        {
          id: 'evt-01',
          timestamp: '10:14:02',
          type: 'task',
          icon: '✓',
          message: `Task received: issue ${currentPlan.issueNumber}`,
        },
        {
          id: 'evt-02',
          timestamp: '10:14:03',
          type: 'task',
          icon: '✓',
          message: 'Plan approved',
        },
        {
          id: 'evt-03',
          timestamp: '10:14:05',
          type: 'search',
          icon: '→',
          message: 'Beginning repository exploration',
        },
      ],
    });
    setCurrentView('active-run');
  };

  const handleNewTask = () => {
    if (activeRunDataSource) {
      activeRunDataSource.stop();
      setActiveRunDataSource(null);
    }
    setActiveRun({
      id: 'run-pending',
      title: 'Fix duplicate cart items',
      repo: selectedRepo.name,
      branch: selectedRepo.branch,
      status: 'Ready',
      phase: 'FIND',
      timestamp: 'Idle',
    });
    setIsAnalyzing(false);
    setIsGeneratingPlan(false);
    setCurrentView('new-task');
  };

  const handleStopRun = () => {
    if (activeRunDataSource) {
      activeRunDataSource.stop();
    }
    setActiveRun((prev) => ({
      ...prev,
      status: 'STOPPED',
    }));
  };

  const handleResumeRun = () => {
    if (activeRunDataSource) {
      activeRunDataSource.resume();
    }
    setActiveRun((prev) => ({
      ...prev,
      status: 'RUNNING',
    }));
  };

  const handleSelectRun = (run: TaskRun) => {
    if (activeRunDataSource && run.id === activeRun.id) {
      setCurrentView('active-run');
      return;
    }
    setActiveRun(run);
    setCurrentView('active-run');
  };

  return (
    <div className={styles.shell}>
      <Topbar
        selectedRepo={selectedRepo}
        onOpenRepoSelector={() => setCurrentView('repositories')}
        activeTaskTitle={
          currentView === 'analysis'
            ? `${currentAnalysis.issueNumber} ${currentAnalysis.title}`
            : currentView === 'plan'
              ? `${currentPlan.issueNumber} ${currentPlan.title}`
              : currentView === 'active-run'
                ? activeRun.title
                : undefined
        }
        runStatus={
          currentView === 'active-run'
            ? activeRun.status === 'Verified'
              ? 'Verified'
              : activeRun.status === 'STOPPED'
                ? 'Ready'
                : activeRun.status === 'RUNNING'
                  ? 'RUNNING'
                  : 'Ready'
            : 'Ready'
        }
        onOpenSettings={() => setCurrentView('settings')}
      />

      <div className={styles.workspaceLayout}>
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          onNavigateLanding={onNavigateLanding}
          hasAnalysis={Boolean(currentAnalysis && currentAnalysis.problem)}
          hasPlan={Boolean(currentPlan && currentPlan.steps.length > 0)}
        />

        <main className={styles.mainArea}>
          {isAnalyzing ? (
            <div className={styles.viewPadding}>
              <AnalyzingStateView onComplete={handleAnalysisComplete} />
            </div>
          ) : isGeneratingPlan ? (
            <div className={styles.viewPadding}>
              <PlanGenerationStateView onComplete={handlePlanGenerationComplete} />
            </div>
          ) : currentView === 'active-run' ? (
            !activeRunDataSource && activeRun.status === 'Ready' ? (
              <div className={styles.viewPadding}>
                <div className={styles.fallbackCard}>
                  <div className={styles.fallbackIcon}>⚡</div>
                  <h2 className={styles.fallbackTitle}>
                    This run is not available in the current session.
                  </h2>
                  <p className={styles.fallbackDesc}>
                    Autonomous runs are initialized after an implementation plan is approved. You can explore repositories or start a new task.
                  </p>
                  <div className={styles.fallbackActions}>
                    <Button variant="primary" size="md" onClick={() => setCurrentView('new-task')}>
                      Start New Task
                    </Button>
                    <Button variant="ghost" size="md" onClick={() => setCurrentView('overview')}>
                      Return to Workspace
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <ActiveRunView
                run={activeRun}
                dataSource={activeRunDataSource}
                onStopRun={handleStopRun}
                onResumeRun={handleResumeRun}
                onFinish={() => setCurrentView('overview')}
                onNewTask={handleNewTask}
              />
            )
          ) : (
            <div className={styles.viewPadding}>
              {currentView === 'overview' && (
                <OverviewView
                  runs={runs}
                  activeRun={activeRunDataSource ? activeRun : undefined}
                  onNewTask={handleNewTask}
                  onSelectRun={handleSelectRun}
                  onViewActiveRun={() => setCurrentView('active-run')}
                />
              )}

              {currentView === 'new-task' && (
                <NewTaskView
                  repositories={repositories}
                  selectedRepo={selectedRepo}
                  onSelectRepo={setSelectedRepo}
                  onAnalyzeTask={handleStartAnalysis}
                  onCancel={() => setCurrentView('overview')}
                />
              )}

              {currentView === 'analysis' && (
                <IssueAnalysisView
                  analysis={currentAnalysis}
                  onBack={() => setCurrentView('new-task')}
                  onGeneratePlan={handleGeneratePlan}
                />
              )}

              {currentView === 'plan' && (
                <ImplementationPlanView
                  plan={currentPlan}
                  onBack={() => setCurrentView('analysis')}
                  onReject={handleRejectPlan}
                  onApprove={handleApprovePlan}
                />
              )}

              {currentView === 'repositories' && (
                <RepositoriesView
                  repositories={repositories}
                  selectedRepo={selectedRepo}
                  onSelectRepo={setSelectedRepo}
                  onNewTaskWithRepo={(repo) => {
                    setSelectedRepo(repo);
                    setCurrentView('new-task');
                  }}
                />
              )}

              {currentView === 'history' && (
                <RunHistoryView runs={runs} onSelectRun={handleSelectRun} />
              )}

              {currentView === 'settings' && <SettingsView />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
