export interface WorkflowFile {
  name: string;
  indent: number;
  isFolder?: boolean;
  highlighted?: boolean;
  tag?: string;
}

export interface WorkflowStageData {
  id: string;
  stepNum: string;
  title: string;
  description: string;
  internalStepIndex: number;
  badge: 'info' | 'running' | 'verified';
  badgeText: string;
  phaseLabel: string;
  repoContext?: {
    files: WorkflowFile[];
  };
  plan?: string[];
  diff?: {
    file: string;
    stats: string;
    del: string;
    add: string;
  };
  verification?: Array<{ label: string; status: string; passed: boolean }>;
  activity: Array<{ icon: '✓' | '→' | '◆'; text: string; highlight?: boolean; meta?: string }>;
  terminal: Array<{ text: string; type: 'command' | 'output' | 'success' | 'muted' }>;
  agentState: Array<{ label: string; value: string; highlight?: boolean }>;
}

export const INTERNAL_SEVEN_STEPS = [
  'Issue Received',
  'Exploration',
  'Context Identified',
  'Plan Generated',
  'Code Modified',
  'Tests Running',
  'Verification',
] as const;

export const WORKFLOW_STAGES: WorkflowStageData[] = [
  // ──────────────────────────────────────────────
  // STAGE 01 — Issue Received
  // ──────────────────────────────────────────────
  {
    id: 'issue',
    stepNum: '01',
    title: 'Issue Received',
    description: 'Reads and understands the issue.',
    internalStepIndex: 0,
    badge: 'info',
    badgeText: 'INGESTED',
    phaseLabel: 'Task Ingestion & Context Scoping',
    activity: [
      { icon: '◆', text: 'GitHub issue #412 ingested: "Fix duplicate cart items on rapid clicks"' },
      { icon: '◆', text: 'Scope bounded: frontend checkout module / state synchronizer' },
      { icon: '→', text: 'Provisioning isolated execution sandbox sandbox-01...', highlight: true },
    ],
    terminal: [
      { text: '$ caffipilot task --issue 412 --repo ecommerce-app', type: 'command' },
      { text: 'Cloning repo & provisioning isolated execution sandbox...', type: 'output' },
      { text: 'Workspace mounted at /workspace/ecommerce-app (branch: main)', type: 'muted' },
    ],
    agentState: [
      { label: 'Status', value: 'Ingested' },
      { label: 'Issue', value: '#412' },
      { label: 'Branch', value: 'main' },
      { label: 'Sandbox', value: 'sandbox-01' },
    ],
  },

  // ──────────────────────────────────────────────
  // STAGE 02 — Repository Exploration
  // ──────────────────────────────────────────────
  {
    id: 'explore',
    stepNum: '02',
    title: 'Repository Exploration',
    description: 'Explores the repository and finds relevant files.',
    internalStepIndex: 1,
    badge: 'running',
    badgeText: 'EXPLORING',
    phaseLabel: 'AST Symbol Graph & File Discovery',
    repoContext: {
      files: [
        { name: 'ecommerce-app', indent: 0, isFolder: true },
        { name: 'src', indent: 1, isFolder: true },
        { name: 'cart', indent: 2, isFolder: true },
        { name: 'cartService.ts', indent: 3, highlighted: true, tag: 'AST 0.94' },
        { name: 'cartController.ts', indent: 3 },
        { name: 'types.ts', indent: 3 },
        { name: 'tests', indent: 1, isFolder: true },
      ],
    },
    activity: [
      { icon: '✓', text: 'Indexed 642 files across 48 directories', meta: '0.8s' },
      { icon: '✓', text: 'Call graph traced for mutateCart dispatches', meta: '1.4s' },
      { icon: '→', text: 'Reading src/cart/cartService.ts (AST relevance: 0.94)...', highlight: true },
    ],
    terminal: [
      { text: '$ caffipilot ast-graph --entrypoint src/index.ts', type: 'command' },
      { text: 'Searching AST call graph for race conditions... Found 3 candidate files', type: 'output' },
      { text: 'Identified: src/cart/cartService.ts (relevance score: 0.94)', type: 'success' },
    ],
    agentState: [
      { label: 'Status', value: 'Exploring', highlight: true },
      { label: 'Files Scanned', value: '642' },
      { label: 'Candidates', value: '3 files' },
      { label: 'Dependencies', value: '18 mapped' },
    ],
  },

  // ──────────────────────────────────────────────
  // STAGE 03 — Context Identified
  // ──────────────────────────────────────────────
  {
    id: 'context',
    stepNum: '03',
    title: 'Context Identified',
    description: 'Builds focused code context.',
    internalStepIndex: 2,
    badge: 'running',
    badgeText: 'CONTEXT SET',
    phaseLabel: 'Bounded Context Window Assembly',
    repoContext: {
      files: [
        { name: 'ecommerce-app', indent: 0, isFolder: true },
        { name: 'src/cart/cartService.ts', indent: 1, highlighted: true, tag: 'PRIMARY' },
        { name: 'src/cart/cartStore.ts', indent: 1, tag: 'SECONDARY' },
        { name: 'tests/cart.test.ts', indent: 1, tag: 'TEST' },
      ],
    },
    activity: [
      { icon: '✓', text: 'Target isolated: src/cart/cartService.ts:140-175', meta: '2.1s' },
      { icon: '✓', text: 'Secondary dependency mapped: src/cart/cartStore.ts', meta: '2.4s' },
      { icon: '→', text: 'Bounded context window assembled (14 KB slice)...', highlight: true },
    ],
    terminal: [
      { text: '$ caffipilot context-pack --targets src/cart/', type: 'command' },
      { text: 'Compressed 14KB target slice into prompt context', type: 'output' },
      { text: 'Context budget: 4,820 tokens / 32,000 token limit', type: 'muted' },
    ],
    agentState: [
      { label: 'Status', value: 'Context Set' },
      { label: 'Target', value: 'cartService.ts' },
      { label: 'Slice Size', value: '14 KB' },
      { label: 'Tokens', value: '4,820' },
    ],
  },

  // ──────────────────────────────────────────────
  // STAGE 04 — Plan & Modify
  // ──────────────────────────────────────────────
  {
    id: 'plan',
    stepNum: '04',
    title: 'Plan & Modify',
    description: 'Creates a plan and applies the change.',
    internalStepIndex: 4,
    badge: 'running',
    badgeText: 'MODIFYING',
    phaseLabel: 'Reasoning, Patch Synthesis & Regression',
    plan: [
      '01 Inspect cart insertion logic & concurrency locks',
      '02 Wrap mutateCart in atomic request token barrier',
      '03 Add regression test for concurrent duplicate clicks',
    ],
    diff: {
      file: 'src/cart/cartService.ts',
      stats: '+14 / -8',
      del: 'duplicate item added directly to state',
      add: 'existing item quantity incremented with mutex token',
    },
    activity: [
      { icon: '✓', text: 'Implementation plan validated against repository conventions' },
      { icon: '✓', text: 'Applied patch to src/cart/cartService.ts (+14 / -8)' },
      { icon: '→', text: 'Running targeted test suite against candidate patch...', highlight: true },
    ],
    terminal: [
      { text: '$ git diff --stat src/cart/cartService.ts', type: 'command' },
      { text: '1 file changed, 14 insertions(+), 8 deletions(-)', type: 'output' },
      { text: '$ pytest tests/cart/test_cart.py -v', type: 'command' },
      { text: 'Running test_concurrent_click_deduplication...', type: 'output' },
    ],
    agentState: [
      { label: 'Status', value: 'Modifying', highlight: true },
      { label: 'Strategy', value: 'MUTEX_TOKEN' },
      { label: 'Diff Stat', value: '+14 / -8' },
      { label: 'Tests Added', value: '1 regression' },
    ],
  },

  // ──────────────────────────────────────────────
  // STAGE 05 — Verification
  // ──────────────────────────────────────────────
  {
    id: 'verify',
    stepNum: '05',
    title: 'Verification',
    description: 'Runs checks and confirms the result.',
    internalStepIndex: 6,
    badge: 'verified',
    badgeText: 'VERIFIED',
    phaseLabel: 'Evidence Verification & Proof Bundle',
    verification: [
      { label: 'Targeted Tests', status: 'PASS (12/12)', passed: true },
      { label: 'Full Regression Suite', status: 'PASS (47/47)', passed: true },
      { label: 'AST & Linter Check', status: '0 ERRORS', passed: true },
      { label: 'Clean Build Verification', status: 'SUCCESS', passed: true },
    ],
    activity: [
      { icon: '✓', text: 'Targeted tests: test_concurrent_click_deduplication PASSED' },
      { icon: '✓', text: 'Full test suite (47/47 tests) passed in 4.12s — 0 regressions' },
      { icon: '✓', text: 'Lint & type-checker clean execution' },
      { icon: '✓', text: 'Execution proof bundle ready for PR creation' },
    ],
    terminal: [
      { text: '$ pytest tests/ -v', type: 'command' },
      { text: '47 passed in 4.12s — 0 regressions', type: 'success' },
      { text: '$ caffipilot verify --bundle-proof', type: 'command' },
      { text: 'STATUS: VERIFIED — proof bundle generated: patch.diff + test.log', type: 'success' },
    ],
    agentState: [
      { label: 'Status', value: 'Verified', highlight: true },
      { label: 'Pass Rate', value: '100% (47/47)' },
      { label: 'Regressions', value: '0' },
      { label: 'Proof', value: 'Ready for PR' },
    ],
  },
];
