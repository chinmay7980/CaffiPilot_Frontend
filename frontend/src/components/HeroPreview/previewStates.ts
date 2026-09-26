/* ============================================================
   CAFFIPILOT PREVIEW — State Machine Data
   ============================================================
   6 Coherent States with 100% internal consistency:
   1. TASK: READY (FIND)
   2. ANALYSIS: RUNNING (FIND)
   3. EXECUTION: RUNNING (FIX)
   4. RECOVERY: RECOVERING (RECOVERY)
   5. VERIFICATION: VERIFYING (VERIFY)
   6. COMPLETE: VERIFIED (COMPLETE)
   ============================================================ */

export type PreviewPhase =
  | 'task'
  | 'analysis'
  | 'execution'
  | 'recovery'
  | 'verification'
  | 'complete';

export interface ActivityLine {
  icon: '✓' | '→' | '✕' | '◆' | '◎' | '✔' | 'ⓧ';
  text: string;
  status?: string;
  highlight?: boolean;
  file?: string;
  time?: string;
}

export interface TerminalLine {
  text: string;
  type?: 'command' | 'output' | 'success' | 'error' | 'muted';
}

export interface AgentStateEntry {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface VerificationItem {
  label: string;
  passed: boolean;
}

export interface PreviewState {
  phase: PreviewPhase;
  phaseLabel: string;
  phaseProgress: [boolean, boolean, boolean]; // Find, Fix, Verify
  taskTitle: string;
  statusLabel: string;
  statusVariant: 'idle' | 'active' | 'success' | 'error' | 'info';
  activityLines: ActivityLine[];
  terminalLines: TerminalLine[];
  agentState: AgentStateEntry[];
  currentAction?: string;
  verificationItems?: VerificationItem[];
  verified?: boolean;
}

export const PREVIEW_STATES: PreviewState[] = [
  // ──────────────────────────────────────────────
  // STATE 1 — TASK (READY)
  // ──────────────────────────────────────────────
  {
    phase: 'task',
    phaseLabel: 'Task Initialization',
    phaseProgress: [false, false, false],
    taskTitle: 'Fix duplicate cart items',
    statusLabel: 'READY',
    statusVariant: 'idle',
    activityLines: [
      { icon: '◆', text: 'Task #412 received', status: 'ingested' },
      { icon: '◆', text: 'Repository ready — ecommerce-app / main', status: '642 files' },
      { icon: '→', text: 'Waiting to begin...', highlight: true },
    ],
    terminalLines: [
      { text: '$ caffipilot task --issue 412', type: 'command' },
      { text: 'Cloning ecommerce-app repository...', type: 'output' },
      { text: 'Environment initialized and sandbox ready', type: 'muted' },
    ],
    agentState: [
      { label: 'Phase', value: 'Ready' },
      { label: 'Repository', value: 'ecommerce-app' },
      { label: 'Branch', value: 'main' },
      { label: 'Target', value: 'cartService.ts' },
    ],
    currentAction: 'Waiting to begin analysis...',
  },

  // ──────────────────────────────────────────────
  // STATE 2 — ANALYSIS / FIND (RUNNING)
  // ──────────────────────────────────────────────
  {
    phase: 'analysis',
    phaseLabel: 'Repository Exploration',
    phaseProgress: [false, false, false],
    taskTitle: 'Fix duplicate cart items',
    statusLabel: 'RUNNING',
    statusVariant: 'active',
    activityLines: [
      { icon: '✓', text: 'Issue understood & context bounded', time: '0.4s' },
      { icon: '✓', text: 'Repository explored — 42 files indexed', time: '1.2s' },
      { icon: '→', text: 'Finding relevant files...', highlight: true, time: '2.1s' },
    ],
    terminalLines: [
      { text: '$ caffipilot find --scope src/cart/', type: 'command' },
      { text: 'Scanning AST call graph for mutateCart dispatches...', type: 'output' },
      { text: 'Identified: src/cart/cartService.ts (AST score: 0.94)', type: 'success' },
    ],
    agentState: [
      { label: 'Phase', value: 'Find' },
      { label: 'Files Scanned', value: '42' },
      { label: 'Candidates', value: '3 files' },
      { label: 'Dependencies', value: '18 mapped' },
    ],
    currentAction: 'Finding relevant files...',
  },

  // ──────────────────────────────────────────────
  // STATE 3 — EXECUTION / FIX (RUNNING)
  // ──────────────────────────────────────────────
  {
    phase: 'execution',
    phaseLabel: 'Patch Application',
    phaseProgress: [true, false, false],
    taskTitle: 'Fix duplicate cart items',
    statusLabel: 'RUNNING',
    statusVariant: 'active',
    activityLines: [
      { icon: '✓', text: 'Relevant files identified' },
      { icon: '→', text: 'Reading cartService.ts', file: 'cartService.ts' },
      { icon: '→', text: 'Applying patch', highlight: true },
      { icon: '→', text: 'Adding regression test', highlight: true },
    ],
    terminalLines: [
      { text: '$ git diff --stat src/cart/cartService.ts', type: 'command' },
      { text: ' 1 file changed, 14 insertions(+), 8 deletions(-)', type: 'output' },
      { text: '$ pytest tests/cart/test_cart.py -v', type: 'command' },
      { text: 'Running test_concurrent_click_deduplication...', type: 'output' },
    ],
    agentState: [
      { label: 'Phase', value: 'Fix' },
      { label: 'Target', value: 'cartService.ts' },
      { label: 'Diff', value: '+14 / -8' },
      { label: 'Tests Added', value: '1 regression' },
    ],
    currentAction: 'Executing test suite against candidate patch...',
  },

  // ──────────────────────────────────────────────
  // STATE 4 — TEST FAILURE / RECOVERY (RECOVERING)
  // ──────────────────────────────────────────────
  {
    phase: 'recovery',
    phaseLabel: 'Failure Recovery',
    phaseProgress: [true, true, false],
    taskTitle: 'Fix duplicate cart items',
    statusLabel: 'RECOVERING',
    statusVariant: 'error',
    activityLines: [
      { icon: '✕', text: 'Tests failed — 2 failures', highlight: true, time: '1m 31s' },
      { icon: '→', text: 'Analyzing failure', time: '1m 45s' },
      { icon: '→', text: 'Updating context', time: '1m 58s' },
      { icon: '→', text: 'Retrying patch...', highlight: true, time: '2m 03s' },
    ],
    terminalLines: [
      { text: '$ pytest tests/cart.test.py', type: 'command' },
      { text: 'FAILED test_duplicate_merge_unauthenticated', type: 'error' },
      { text: 'AssertionError: expected 60, got 20', type: 'error' },
      { text: 'Analyzing failure and retrying...', type: 'output' },
    ],
    agentState: [
      { label: 'Phase', value: 'Recovery', highlight: true },
      { label: 'Attempt', value: '1 / 2' },
      { label: 'Failures', value: '2 detected' },
      { label: 'Strategy', value: 'MUTEX_TOKEN' },
    ],
    currentAction: 'Analyzing failure...',
  },

  // ──────────────────────────────────────────────
  // STATE 5 — VERIFICATION (VERIFYING)
  // ──────────────────────────────────────────────
  {
    phase: 'verification',
    phaseLabel: 'Evidence Verification',
    phaseProgress: [true, true, false],
    taskTitle: 'Fix duplicate cart items',
    statusLabel: 'VERIFYING',
    statusVariant: 'active',
    activityLines: [
      { icon: '✓', text: 'Targeted tests', status: 'PASS' },
      { icon: '→', text: 'Full test suite (47 tests)', highlight: true },
      { icon: '→', text: 'Lint & AST verification' },
      { icon: '→', text: 'Build check' },
    ],
    terminalLines: [
      { text: '$ pytest tests/ -v', type: 'command' },
      { text: 'Targeted tests: PASSED (12/12 in 1.4s)', type: 'success' },
      { text: 'Running full regression test suite...', type: 'output' },
    ],
    agentState: [
      { label: 'Phase', value: 'Verify' },
      { label: 'Target Tests', value: '12 / 12' },
      { label: 'Full Suite', value: 'Running' },
      { label: 'Linter', value: 'Checking' },
    ],
    currentAction: 'Running verification...',
  },

  // ──────────────────────────────────────────────
  // STATE 6 — COMPLETE (VERIFIED)
  // ──────────────────────────────────────────────
  {
    phase: 'complete',
    phaseLabel: 'Verified Complete',
    phaseProgress: [true, true, true],
    taskTitle: 'Fix duplicate cart items',
    statusLabel: 'VERIFIED',
    statusVariant: 'success',
    activityLines: [
      { icon: '✓', text: 'Targeted tests', status: 'PASS' },
      { icon: '✓', text: 'Full test suite (47/47)', status: 'PASS' },
      { icon: '✓', text: 'Lint & types clean', status: 'PASS' },
      { icon: '✓', text: 'Build verified', status: 'PASS' },
      { icon: '✓', text: 'Final verification complete', highlight: true },
    ],
    terminalLines: [
      { text: '$ caffipilot verify --bundle-proof', type: 'command' },
      { text: 'Proof bundle created: patch.diff + test-execution.log', type: 'success' },
      { text: '47 passed in 4.12s — 0 regressions', type: 'success' },
      { text: 'STATUS: VERIFIED', type: 'success' },
    ],
    agentState: [
      { label: 'Phase', value: 'Complete', highlight: true },
      { label: 'Status', value: 'Verified' },
      { label: 'Pass Rate', value: '100% (47/47)' },
      { label: 'Proof', value: 'Ready for PR' },
    ],
    currentAction: 'Verification complete',
    verified: true,
  },
];

export const STATE_DURATIONS: Record<PreviewPhase, number> = {
  task: 3500,
  analysis: 3500,
  execution: 3500,
  recovery: 4500,
  verification: 3500,
  complete: 4500,
};
