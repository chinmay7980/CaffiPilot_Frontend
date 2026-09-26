export interface Repository {
  id: string;
  name: string;
  language: string;
  branch: string;
  branches: string[];
  status: 'Ready' | 'Active' | 'Indexed';
  filesCount: number;
}

export type RunPhase =
  | 'find'
  | 'fix'
  | 'test'
  | 'recovery'
  | 'verify'
  | 'complete'
  | 'FIND'
  | 'FIX'
  | 'TEST'
  | 'RECOVERY'
  | 'VERIFY'
  | 'COMPLETE';

export type RunStatus =
  | 'idle'
  | 'running'
  | 'failed'
  | 'recovering'
  | 'verified'
  | 'stopped'
  | 'Ready'
  | 'RUNNING'
  | 'Verified'
  | 'Recovered'
  | 'STOPPED'
  | 'Failed';

export interface RunEvent {
  id: string;
  timestamp: string;
  type:
    | 'task'
    | 'search'
    | 'read'
    | 'edit'
    | 'test'
    | 'failure'
    | 'recovery'
    | 'verify'
    | 'success';
  icon: '✓' | '→' | '✕' | '◆';
  message: string;
  details?: string;
}

export interface DiffLine {
  type: 'context' | 'addition' | 'deletion';
  oldLine?: number;
  newLine?: number;
  content: string;
}

export interface DiffHunk {
  oldStart: number;
  newStart: number;
  header?: string;
  lines: DiffLine[];
}

export interface DiffFile {
  path: string;
  status: 'modified' | 'added' | 'deleted';
  additions: number;
  deletions: number;
  hunks: DiffHunk[];
}

export interface TestCase {
  id: string;
  name: string;
  status: 'queued' | 'running' | 'passed' | 'failed';
  duration?: string;
  error?: {
    expected: string;
    received: string;
    file: string;
    line: number;
    message: string;
  };
  output?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  command: string;
  status: 'queued' | 'running' | 'passed' | 'failed';
  passed: number;
  failed: number;
  total: number;
  duration?: string;
  cases: TestCase[];
  output?: string[];
}

export interface VerificationCheck {
  id: string;
  label:
    | 'Targeted Tests'
    | 'Full Test Suite'
    | 'Lint'
    | 'Build'
    | 'Final Diff'
    | string;
  title?: string;
  subtitle?: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  detail?: string;
}

export interface RunState {
  id: string;
  task: string;
  repository: string;
  branch: string;
  issueNumber?: string;
  phase: RunPhase;
  status: RunStatus;
  iteration: number;
  maxIterations: number;
  filesInspected: number;
  filesChanged: number;
  toolCalls: number;
  recoveryAttempts: number;
  currentAction: string;
  activity: RunEvent[];
  changedFiles: DiffFile[];
  tests: TestSuite[];
  verification: VerificationCheck[];
  terminalLines: Array<{ type: 'cmd' | 'out' | 'err' | 'ok'; text: string }>;
}

export interface RunDataSource {
  getRun(): RunState;
  subscribe(callback: (run: RunState) => void): () => void;
  stop(): void;
  resume(): void;
}

export interface TaskRun {
  id: string;
  title: string;
  repo: string;
  branch: string;
  status: RunStatus;
  phase: RunPhase;
  timestamp: string;
  currentAction?: string;
  iteration?: string;
  filesInspected?: number;
  filesChanged?: number;
  toolCalls?: number;
  recoveryAttempts?: number;
  activity?: RunEvent[];
}

export interface RelevantFile {
  path: string;
  relevance: 'Highly relevant' | 'Relevant' | 'Related';
  notes?: string;
}

export interface TaskState {
  repository: string;
  branch: string;
  issueNumber?: string;
  title: string;
  description: string;
  analysisStatus: 'idle' | 'analyzing' | 'complete';
  planStatus: 'idle' | 'generating' | 'ready' | 'approved' | 'rejected';
  runStatus: 'idle' | 'running' | 'completed';
}

export interface IssueAnalysisData {
  issueNumber: string;
  title: string;
  repo: string;
  branch: string;
  problem: string;
  expectedBehavior: string;
  detectedArea: string;
  understanding: string;
  relevantFiles: RelevantFile[];
}

export interface PlanStep {
  number: string;
  title: string;
  description: string;
  files?: string[];
  status: 'Proposed' | 'In Progress' | 'Completed';
}

export interface ImplementationPlanData {
  issueNumber: string;
  title: string;
  repo: string;
  branch: string;
  objective: string;
  expectedBehavior: string;
  steps: PlanStep[];
  relevantFiles: Array<{ path: string; role: string }>;
}

export type WorkspaceView =
  | 'overview'
  | 'new-task'
  | 'analysis'
  | 'plan'
  | 'active-run'
  | 'repositories'
  | 'history'
  | 'settings';

export type ActiveRunTab = 'activity' | 'diff' | 'tests' | 'verification';
