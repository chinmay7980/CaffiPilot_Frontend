import type {
  RunState,
  RunDataSource,
  DiffFile,
  TestSuite,
  VerificationCheck,
} from './types';

export const INITIAL_DIFF_FILES: DiffFile[] = [
  {
    path: 'src/cart/cartService.ts',
    status: 'modified',
    additions: 19,
    deletions: 7,
    hunks: [
      {
        oldStart: 40,
        newStart: 40,
        header: '@@ -40,15 +40,27 @@ class CartService',
        lines: [
          { type: 'context', oldLine: 40, newLine: 40, content: 'export class CartService {' },
          { type: 'context', oldLine: 41, newLine: 41, content: '  private items: Map<string, CartItem> = new Map();' },
          { type: 'context', oldLine: 42, newLine: 42, content: '' },
          { type: 'deletion', oldLine: 43, content: '-  public addItem(product: Product, quantity = 1): CartItem {' },
          { type: 'deletion', oldLine: 44, content: '-    const id = generateId();' },
          { type: 'deletion', oldLine: 45, content: '-    const item = { id, product, quantity, subtotal: product.price * quantity };' },
          { type: 'deletion', oldLine: 46, content: '-    this.items.set(id, item);' },
          { type: 'deletion', oldLine: 47, content: '-    return item;' },
          { type: 'deletion', oldLine: 48, content: '-  }' },
          { type: 'deletion', oldLine: 49, content: '-' },
          { type: 'addition', newLine: 43, content: '+  public addItem(product: Product, quantity = 1): CartItem {' },
          { type: 'addition', newLine: 44, content: '+    // Check if an existing line item already holds this product' },
          { type: 'addition', newLine: 45, content: '+    const existing = Array.from(this.items.values()).find(' },
          { type: 'addition', newLine: 46, content: '+      (item) => item.product.id === product.id' },
          { type: 'addition', newLine: 47, content: '+    );' },
          { type: 'addition', newLine: 48, content: '+' },
          { type: 'addition', newLine: 49, content: '+    if (existing) {' },
          { type: 'addition', newLine: 50, content: '+      existing.quantity += quantity;' },
          { type: 'addition', newLine: 51, content: '+      existing.subtotal = existing.quantity * product.price;' },
          { type: 'addition', newLine: 52, content: '+      this.items.set(existing.id, existing);' },
          { type: 'addition', newLine: 53, content: '+      return existing;' },
          { type: 'addition', newLine: 54, content: '+    }' },
          { type: 'addition', newLine: 55, content: '+' },
          { type: 'addition', newLine: 56, content: '+    const id = generateId();' },
          { type: 'addition', newLine: 57, content: '+    const item = { id, product, quantity, subtotal: product.price * quantity };' },
          { type: 'addition', newLine: 58, content: '+    this.items.set(id, item);' },
          { type: 'addition', newLine: 59, content: '+    return item;' },
          { type: 'addition', newLine: 60, content: '+  }' },
          { type: 'context', oldLine: 50, newLine: 61, content: '' },
          { type: 'context', oldLine: 51, newLine: 62, content: '  public getCartTotal(): number {' },
          { type: 'context', oldLine: 52, newLine: 63, content: '    return Array.from(this.items.values())' },
          { type: 'context', oldLine: 53, newLine: 64, content: '      .reduce((sum, item) => sum + item.subtotal, 0);' },
          { type: 'context', oldLine: 54, newLine: 65, content: '  }' },
        ],
      },
    ],
  },
  {
    path: 'tests/cart.test.ts',
    status: 'modified',
    additions: 15,
    deletions: 0,
    hunks: [
      {
        oldStart: 24,
        newStart: 24,
        header: '@@ -24,10 +24,25 @@ Cart Service Test Suite',
        lines: [
          { type: 'context', oldLine: 24, newLine: 24, content: '  it("adds a single item to cart", () => {' },
          { type: 'context', oldLine: 25, newLine: 25, content: '    const cart = new CartService();' },
          { type: 'context', oldLine: 26, newLine: 26, content: '    cart.addItem(mockProductA, 1);' },
          { type: 'context', oldLine: 27, newLine: 27, content: '    expect(cart.getItems()).toHaveLength(1);' },
          { type: 'context', oldLine: 28, newLine: 28, content: '  });' },
          { type: 'context', oldLine: 29, newLine: 29, content: '' },
          { type: 'addition', newLine: 30, content: '+  it("increments quantity and subtotal when same product added twice", () => {' },
          { type: 'addition', newLine: 31, content: '+    const cart = new CartService();' },
          { type: 'addition', newLine: 32, content: '+    cart.addItem(mockProductA, 1);' },
          { type: 'addition', newLine: 33, content: '+    cart.addItem(mockProductA, 2);' },
          { type: 'addition', newLine: 34, content: '+' },
          { type: 'addition', newLine: 35, content: '+    const items = cart.getItems();' },
          { type: 'addition', newLine: 36, content: '+    expect(items).toHaveLength(1);' },
          { type: 'addition', newLine: 37, content: '+    expect(items[0].quantity).toBe(3);' },
          { type: 'addition', newLine: 38, content: '+    expect(items[0].subtotal).toBe(mockProductA.price * 3);' },
          { type: 'addition', newLine: 39, content: '+    expect(cart.getCartTotal()).toBe(mockProductA.price * 3);' },
          { type: 'addition', newLine: 40, content: '+  });' },
          { type: 'context', oldLine: 30, newLine: 41, content: '' },
          { type: 'context', oldLine: 31, newLine: 42, content: '  it("removes item from cart", () => {' },
          { type: 'context', oldLine: 32, newLine: 43, content: '    const cart = new CartService();' },
        ],
      },
    ],
  },
];

export const INITIAL_TEST_SUITES: TestSuite[] = [
  {
    id: 'targeted',
    name: 'Targeted Tests',
    command: 'pytest tests/cart.test.py',
    status: 'queued',
    passed: 0,
    failed: 0,
    total: 14,
    duration: '--',
    cases: [
      { id: 'c1', name: 'test_empty_cart_initialization', status: 'queued' },
      { id: 'c2', name: 'test_single_item_addition', status: 'queued' },
      { id: 'c3', name: 'test_duplicate_addition_increments_qty', status: 'queued' },
      { id: 'c4', name: 'test_total_calculation_with_multiples', status: 'queued' },
      { id: 'c5', name: 'test_item_removal_resets_subtotal', status: 'queued' },
    ],
    output: ['Targeted suite queued for execution...'],
  },
  {
    id: 'full',
    name: 'Full Test Suite',
    command: 'pytest',
    status: 'queued',
    passed: 0,
    failed: 0,
    total: 47,
    duration: '--',
    cases: [
      { id: 'f1', name: 'test_auth_service_sessions', status: 'queued' },
      { id: 'f2', name: 'test_catalog_pagination', status: 'queued' },
      { id: 'f3', name: 'test_checkout_pipeline', status: 'queued' },
      { id: 'f4', name: 'test_order_persistence', status: 'queued' },
    ],
    output: ['Full repository regression suite queued...'],
  },
  {
    id: 'lint',
    name: 'Lint & Static Diagnostics',
    command: 'eslint src/ && tsc --noEmit',
    status: 'queued',
    passed: 0,
    failed: 0,
    total: 2,
    duration: '--',
    cases: [
      { id: 'l1', name: 'eslint-recommended', status: 'queued' },
      { id: 'l2', name: 'typescript-strict-check', status: 'queued' },
    ],
    output: ['Static analysis awaiting trigger...'],
  },
  {
    id: 'build',
    name: 'Production Build',
    command: 'vite build',
    status: 'queued',
    passed: 0,
    failed: 0,
    total: 1,
    duration: '--',
    cases: [
      { id: 'b1', name: 'bundle-compilation-and-treeshake', status: 'queued' },
    ],
    output: ['Production artifact build awaiting trigger...'],
  },
];

export const INITIAL_VERIFICATION_CHECKS: VerificationCheck[] = [
  {
    id: 'targeted',
    label: 'Targeted Tests',
    status: 'pending',
    detail: '14 / 14 required assertions in tests/cart.test.py',
  },
  {
    id: 'full',
    label: 'Full Test Suite',
    status: 'pending',
    detail: '47 / 47 repository test scenarios',
  },
  {
    id: 'lint',
    label: 'Lint',
    status: 'pending',
    detail: 'Zero ESLint warnings & TypeScript clean diagnostics',
  },
  {
    id: 'build',
    label: 'Build',
    status: 'pending',
    detail: 'Production artifact bundle compilation',
  },
  {
    id: 'diff',
    label: 'Final Diff',
    status: 'pending',
    detail: 'AST-aligned unified patch verification without regressions',
  },
];

export class MockRunDataSource implements RunDataSource {
  private runState: RunState;
  private subscribers: Set<(run: RunState) => void> = new Set();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private currentStep = 0;
  private isStopped = false;

  constructor(initialData?: Partial<RunState>) {
    this.runState = {
      id: initialData?.id || 'run-active',
      task: initialData?.task || 'Fix duplicate cart items',
      repository: initialData?.repository || 'ecommerce-app',
      branch: initialData?.branch || 'main',
      issueNumber: initialData?.issueNumber || '#412',
      phase: 'find',
      status: 'running',
      iteration: 1,
      maxIterations: 12,
      filesInspected: 0,
      filesChanged: 0,
      toolCalls: 0,
      recoveryAttempts: 0,
      currentAction: 'Starting repository exploration',
      activity: [
        {
          id: 'evt-init-1',
          timestamp: '10:14:02',
          type: 'task',
          icon: '✓',
          message: `Task received: issue ${initialData?.issueNumber || '#412'}`,
        },
        {
          id: 'evt-init-2',
          timestamp: '10:14:03',
          type: 'task',
          icon: '✓',
          message: 'Implementation plan approved',
        },
        {
          id: 'evt-init-3',
          timestamp: '10:14:05',
          type: 'search',
          icon: '→',
          message: 'Beginning autonomous repository exploration',
        },
      ],
      changedFiles: [],
      tests: INITIAL_TEST_SUITES,
      verification: INITIAL_VERIFICATION_CHECKS,
      terminalLines: [
        { type: 'cmd', text: '$ caffipilot run --scope ecommerce-app' },
        { type: 'out', text: 'Connecting to isolated sandbox container sandbox-01...' },
        { type: 'ok', text: '✓ Mounted ecommerce-app (main) on /workspace' },
      ],
    };

    this.startSimulation();
  }

  public getRun(): RunState {
    return { ...this.runState };
  }

  public subscribe(callback: (run: RunState) => void): () => void {
    this.subscribers.add(callback);
    callback(this.getRun());
    return () => {
      this.subscribers.delete(callback);
    };
  }

  public stop(): void {
    this.isStopped = true;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.updateState({ status: 'stopped' });
  }

  public resume(): void {
    if (!this.isStopped) return;
    this.isStopped = false;
    this.updateState({ status: 'running' });
    this.scheduleNextStep(800);
  }

  private updateState(partial: Partial<RunState>): void {
    this.runState = { ...this.runState, ...partial };
    for (const callback of this.subscribers) {
      callback(this.getRun());
    }
  }

  private startSimulation(): void {
    this.scheduleNextStep(1200);
  }

  private scheduleNextStep(delay: number): void {
    if (this.isStopped || this.currentStep >= 14) return;

    this.timer = setTimeout(() => {
      this.executeStep(this.currentStep);
      this.currentStep++;
      if (this.currentStep < 14 && !this.isStopped) {
        this.scheduleNextStep(1500);
      }
    }, delay);
  }

  private executeStep(step: number): void {
    switch (step) {
      case 0:
        // FIND: Search code
        this.updateState({
          phase: 'find',
          currentAction: 'Searching code for cart insertion',
          filesInspected: 2,
          toolCalls: 3,
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s0',
              timestamp: '10:14:08',
              type: 'search',
              icon: '→',
              message: 'Searching repository for cart insertion logic',
              details: 'ripgrep pattern: addItem( | CartItem | cart.push',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'cmd', text: '$ rg "addItem\\(" src/' },
            { type: 'out', text: 'src/cart/cartService.ts:43:  public addItem(product: Product, quantity = 1)' },
            { type: 'out', text: 'src/cart/cartController.ts:28:    const item = cartService.addItem(body.product)' },
          ],
        });
        break;

      case 1:
        // FIND: Read relevant files
        this.updateState({
          phase: 'find',
          currentAction: 'Reading relevant files',
          filesInspected: 4,
          toolCalls: 5,
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s1',
              timestamp: '10:14:11',
              type: 'read',
              icon: '✓',
              message: 'Found src/cart/cartService.ts & tests/cart.test.ts',
              details: 'Identified missing duplicate-id check in addItem mutation and missing test coverage.',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'cmd', text: '$ ast-grep --pattern "addItem($$$)" src/cart/' },
            { type: 'ok', text: '✓ Parsed CartService AST structure and call graph dependencies' },
          ],
        });
        break;

      case 2:
        // FIND: Context built
        this.updateState({
          phase: 'find',
          currentAction: 'Focused context established',
          toolCalls: 6,
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s2',
              timestamp: '10:14:14',
              type: 'task',
              icon: '✓',
              message: 'Focused context established (3 files indexed)',
              details: 'cartService.ts (primary), cartController.ts (related), cart.test.ts (regression)',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'ok', text: '✓ Focused context: 3 files, 642 tokens mapped into patch plan' },
          ],
        });
        break;

      case 3:
        // FIX: Edit cartService.ts
        this.updateState({
          phase: 'fix',
          iteration: 2,
          currentAction: 'Applying implementation patch to cartService.ts',
          filesChanged: 1,
          toolCalls: 7,
          changedFiles: [INITIAL_DIFF_FILES[0]],
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s3',
              timestamp: '10:14:17',
              type: 'edit',
              icon: '→',
              message: 'Applying patch to src/cart/cartService.ts',
              details: 'Updated addItem() to find existing line item by product id and increment quantity.',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'cmd', text: '$ patch src/cart/cartService.ts << EOF' },
            { type: 'ok', text: '✓ Hunk #1 applied successfully at line 43 (+19, -7 lines)' },
          ],
        });
        break;

      case 4:
        // FIX: Edit regression tests in cart.test.ts
        this.updateState({
          phase: 'fix',
          currentAction: 'Adding regression test to tests/cart.test.ts',
          filesChanged: 2,
          toolCalls: 8,
          changedFiles: INITIAL_DIFF_FILES,
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s4',
              timestamp: '10:14:20',
              type: 'edit',
              icon: '✓',
              message: 'Added regression test in tests/cart.test.ts',
              details: 'Added "increments quantity and subtotal when same product added twice"',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'cmd', text: '$ patch tests/cart.test.ts << EOF' },
            { type: 'ok', text: '✓ Hunk #1 applied successfully at line 30 (+15 lines)' },
          ],
        });
        break;

      case 5:
        // TEST: Run targeted tests -> FAILS!
        {
          const targetedSuite: TestSuite = {
            id: 'targeted',
            name: 'Targeted Tests',
            command: 'pytest tests/cart.test.py',
            status: 'failed',
            passed: 12,
            failed: 2,
            total: 14,
            duration: '1.42s',
            cases: [
              { id: 'c1', name: 'test_empty_cart_initialization', status: 'passed', duration: '0.04s' },
              { id: 'c2', name: 'test_single_item_addition', status: 'passed', duration: '0.06s' },
              {
                id: 'c3',
                name: 'test_duplicate_addition_increments_qty',
                status: 'failed',
                duration: '0.12s',
                error: {
                  expected: 'items[0].subtotal == 60',
                  received: 'items[0].subtotal == 20',
                  file: 'tests/cart.test.ts',
                  line: 38,
                  message: 'AssertionError: Line item quantity was incremented but subtotal was not recalculated.',
                },
              },
              {
                id: 'c4',
                name: 'test_total_calculation_with_multiples',
                status: 'failed',
                duration: '0.11s',
                error: {
                  expected: 'getCartTotal() == 60',
                  received: 'getCartTotal() == 20',
                  file: 'tests/cart.test.ts',
                  line: 39,
                  message: 'AssertionError: Cart grand total mismatch due to stale item subtotal.',
                },
              },
              { id: 'c5', name: 'test_item_removal_resets_subtotal', status: 'passed', duration: '0.05s' },
            ],
            output: [
              '$ pytest tests/cart.test.py',
              'tests/cart.test.py::test_empty_cart_initialization PASSED',
              'tests/cart.test.py::test_single_item_addition PASSED',
              'FAILED tests/cart.test.py::test_duplicate_addition_increments_qty',
              '  AssertionError: items[0].subtotal == 60 != 20',
              'FAILED tests/cart.test.py::test_total_calculation_with_multiples',
              '========================= 2 failed, 12 passed in 1.42s =========================',
            ],
          };

          this.updateState({
            phase: 'test',
            status: 'failed',
            currentAction: 'Targeted tests failed (2 failures)',
            toolCalls: 9,
            tests: [targetedSuite, ...this.runState.tests.slice(1)],
            verification: this.runState.verification.map((v) =>
              v.id === 'targeted' ? { ...v, status: 'failed', detail: '2 failed, 12 passed' } : v
            ),
            activity: [
              ...this.runState.activity,
              {
                id: 'evt-s5',
                timestamp: '10:14:23',
                type: 'failure',
                icon: '✕',
                message: '2 targeted tests failed (AssertionError in subtotal calculation)',
                details: 'tests/cart.test.ts:38 Expected subtotal 60, received 20 (subtotal was not recalculated on existing item)',
              },
            ],
            terminalLines: [
              ...this.runState.terminalLines,
              { type: 'cmd', text: '$ pytest tests/cart.test.py' },
              { type: 'err', text: 'FAILED tests/cart.test.py::test_duplicate_addition_increments_qty' },
              { type: 'err', text: '  AssertionError: items[0].subtotal == 60 != 20' },
              { type: 'err', text: '========================= 2 failed, 12 passed in 1.42s =========================' },
            ],
          });
        }
        break;

      case 6:
        // RECOVERY: Analyze failure
        this.updateState({
          phase: 'recovery',
          status: 'recovering',
          iteration: 3,
          recoveryAttempts: 1,
          currentAction: 'Analyzing failed assertions & updating strategy',
          toolCalls: 10,
          verification: this.runState.verification.map((v) =>
            v.id === 'targeted' ? { ...v, status: 'running', detail: 'Retrying with corrective patch...' } : v
          ),
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s6',
              timestamp: '10:14:26',
              type: 'recovery',
              icon: '→',
              message: 'Autonomous recovery: analyzing failure output & recalculating subtotal',
              details: 'Detected that existing.subtotal was not updated when existing.quantity was incremented in CartService.',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'out', text: '▶ CaffiPilot autonomous recovery initiated (Attempt 1/3)' },
            { type: 'out', text: 'Analyzing AST delta for line item mutator in CartService.addItem...' },
            { type: 'ok', text: 'Resolution: Add explicit subtotal recalculation: existing.subtotal = existing.quantity * product.price' },
          ],
        });
        break;

      case 7:
        // RECOVERY: Apply corrective patch
        this.updateState({
          phase: 'recovery',
          currentAction: 'Applying corrective patch to cartService.ts',
          toolCalls: 12,
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s7',
              timestamp: '10:14:29',
              type: 'edit',
              icon: '✓',
              message: 'Corrective patch applied: subtotal now recalculates on quantity increment',
              details: 'Updated existing.subtotal = existing.quantity * product.price in cartService.ts.',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'cmd', text: '$ patch src/cart/cartService.ts << EOF' },
            { type: 'ok', text: '✓ Corrective patch applied: existing.subtotal recalculation verified' },
          ],
        });
        break;

      case 8:
        // RETEST: Targeted tests PASS
        {
          const targetedPassed: TestSuite = {
            id: 'targeted',
            name: 'Targeted Tests',
            command: 'pytest tests/cart.test.py',
            status: 'passed',
            passed: 14,
            failed: 0,
            total: 14,
            duration: '1.18s',
            cases: [
              { id: 'c1', name: 'test_empty_cart_initialization', status: 'passed', duration: '0.04s' },
              { id: 'c2', name: 'test_single_item_addition', status: 'passed', duration: '0.05s' },
              { id: 'c3', name: 'test_duplicate_addition_increments_qty', status: 'passed', duration: '0.08s' },
              { id: 'c4', name: 'test_total_calculation_with_multiples', status: 'passed', duration: '0.07s' },
              { id: 'c5', name: 'test_item_removal_resets_subtotal', status: 'passed', duration: '0.04s' },
            ],
            output: [
              '$ pytest tests/cart.test.py',
              'tests/cart.test.py::test_empty_cart_initialization PASSED',
              'tests/cart.test.py::test_single_item_addition PASSED',
              'tests/cart.test.py::test_duplicate_addition_increments_qty PASSED',
              'tests/cart.test.py::test_total_calculation_with_multiples PASSED',
              '============================== 14 passed in 1.18s ==============================',
            ],
          };

          this.updateState({
            phase: 'test',
            status: 'running',
            iteration: 4,
            currentAction: 'Targeted tests passing (14 / 14)',
            toolCalls: 13,
            tests: [targetedPassed, ...this.runState.tests.slice(1)],
            verification: this.runState.verification.map((v) =>
              v.id === 'targeted' ? { ...v, status: 'passed', detail: '14 / 14 passed' } : v
            ),
            activity: [
              ...this.runState.activity,
              {
                id: 'evt-s8',
                timestamp: '10:14:32',
                type: 'success',
                icon: '✓',
                message: '14 targeted tests passed (14/14 passing)',
                details: 'All 14 unit and regression scenarios in tests/cart.test.py passed successfully.',
              },
            ],
            terminalLines: [
              ...this.runState.terminalLines,
              { type: 'cmd', text: '$ pytest tests/cart.test.py' },
              { type: 'ok', text: 'tests/cart.test.py::test_duplicate_addition_increments_qty PASSED' },
              { type: 'ok', text: 'tests/cart.test.py::test_total_calculation_with_multiples PASSED' },
              { type: 'ok', text: '============================== 14 passed in 1.18s ==============================' },
            ],
          });
        }
        break;

      case 9:
        // VERIFY: Full test suite passes
        {
          const fullPassed: TestSuite = {
            id: 'full',
            name: 'Full Test Suite',
            command: 'pytest',
            status: 'passed',
            passed: 47,
            failed: 0,
            total: 47,
            duration: '3.84s',
            cases: [
              { id: 'f1', name: 'test_auth_service_sessions', status: 'passed', duration: '0.42s' },
              { id: 'f2', name: 'test_catalog_pagination', status: 'passed', duration: '0.38s' },
              { id: 'f3', name: 'test_checkout_pipeline', status: 'passed', duration: '0.85s' },
              { id: 'f4', name: 'test_order_persistence', status: 'passed', duration: '0.51s' },
            ],
            output: [
              '$ pytest',
              '============================== 47 passed in 3.84s ==============================',
            ],
          };

          this.updateState({
            phase: 'verify',
            currentAction: 'Running full test suite',
            toolCalls: 14,
            tests: [this.runState.tests[0], fullPassed, ...this.runState.tests.slice(2)],
            verification: this.runState.verification.map((v) =>
              v.id === 'full' ? { ...v, status: 'passed', detail: '47 / 47 passed' } : v
            ),
            activity: [
              ...this.runState.activity,
              {
                id: 'evt-s9',
                timestamp: '10:14:35',
                type: 'verify',
                icon: '✓',
                message: 'Full test suite passed: 47/47 tests green',
                details: 'All repository test suites executed without regressions.',
              },
            ],
            terminalLines: [
              ...this.runState.terminalLines,
              { type: 'cmd', text: '$ pytest' },
              { type: 'ok', text: '============================== 47 passed in 3.84s ==============================' },
            ],
          });
        }
        break;

      case 10:
        // VERIFY: Lint passes
        {
          const lintPassed: TestSuite = {
            id: 'lint',
            name: 'Lint & Static Diagnostics',
            command: 'eslint src/ && tsc --noEmit',
            status: 'passed',
            passed: 2,
            failed: 0,
            total: 2,
            duration: '1.05s',
            cases: [
              { id: 'l1', name: 'eslint-recommended', status: 'passed', duration: '0.45s' },
              { id: 'l2', name: 'typescript-strict-check', status: 'passed', duration: '0.60s' },
            ],
            output: [
              '$ eslint src/ && tsc --noEmit',
              '✔ No ESLint warnings or errors',
              '✔ TypeScript diagnostics clean (0 issues)',
            ],
          };

          this.updateState({
            phase: 'verify',
            currentAction: 'Running static analysis and lint diagnostics',
            toolCalls: 15,
            tests: [
              this.runState.tests[0],
              this.runState.tests[1],
              lintPassed,
              this.runState.tests[3],
            ],
            verification: this.runState.verification.map((v) =>
              v.id === 'lint' ? { ...v, status: 'passed', detail: 'No issues detected' } : v
            ),
            activity: [
              ...this.runState.activity,
              {
                id: 'evt-s10',
                timestamp: '10:14:38',
                type: 'verify',
                icon: '✓',
                message: 'Lint & type check passed (0 errors, 0 warnings)',
                details: 'ESLint and TypeScript strict checks completed with zero diagnostics.',
              },
            ],
            terminalLines: [
              ...this.runState.terminalLines,
              { type: 'cmd', text: '$ eslint src/ && tsc --noEmit' },
              { type: 'ok', text: '✔ No ESLint warnings or errors' },
              { type: 'ok', text: '✔ TypeScript diagnostics clean (0 issues)' },
            ],
          });
        }
        break;

      case 11:
        // VERIFY: Build passes
        {
          const buildPassed: TestSuite = {
            id: 'build',
            name: 'Production Build',
            command: 'vite build',
            status: 'passed',
            passed: 1,
            failed: 0,
            total: 1,
            duration: '2.14s',
            cases: [
              { id: 'b1', name: 'bundle-compilation-and-treeshake', status: 'passed', duration: '2.14s' },
            ],
            output: [
              '$ vite build',
              'vite v8.3.1 building for production...',
              'dist/index.html   0.92 kB',
              'dist/assets/app.js 142.1 kB',
              '✓ build succeeded in 248ms',
            ],
          };

          this.updateState({
            phase: 'verify',
            currentAction: 'Verifying production artifact build',
            toolCalls: 16,
            tests: [
              this.runState.tests[0],
              this.runState.tests[1],
              this.runState.tests[2],
              buildPassed,
            ],
            verification: this.runState.verification.map((v) =>
              v.id === 'build' ? { ...v, status: 'passed', detail: 'Production build passed' } : v
            ),
            activity: [
              ...this.runState.activity,
              {
                id: 'evt-s11',
                timestamp: '10:14:41',
                type: 'verify',
                icon: '✓',
                message: 'Production build verified (dist bundle built)',
                details: 'Vite production bundle compiled and tree-shaken with zero runtime warnings.',
              },
            ],
            terminalLines: [
              ...this.runState.terminalLines,
              { type: 'cmd', text: '$ vite build' },
              { type: 'ok', text: '✓ build succeeded in 248ms' },
            ],
          });
        }
        break;

      case 12:
        // VERIFY: Final Diff verified
        this.updateState({
          phase: 'verify',
          currentAction: 'Verifying final unified diff',
          toolCalls: 17,
          verification: this.runState.verification.map((v) =>
            v.id === 'diff' ? { ...v, status: 'passed', detail: '2 files changed (+34, -7)' } : v
          ),
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s12',
              timestamp: '10:14:44',
              type: 'verify',
              icon: '✓',
              message: 'Final diff verified: 2 files changed (+34, -7)',
              details: 'Clean patch isolated to cartService.ts and tests/cart.test.ts without collateral changes.',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'cmd', text: '$ git diff --stat' },
            { type: 'ok', text: ' 2 files changed, 34 insertions(+), 7 deletions(-)' },
          ],
        });
        break;

      case 13:
        // COMPLETE: All checks passed
        this.updateState({
          phase: 'complete',
          status: 'verified',
          currentAction: 'Verification complete — task resolved',
          activity: [
            ...this.runState.activity,
            {
              id: 'evt-s13',
              timestamp: '10:14:46',
              type: 'success',
              icon: '✓',
              message: 'CaffiPilot verified the final patch',
              details: 'Task #412 resolved: Duplicate cart items merged into quantity increments with full test verification.',
            },
          ],
          terminalLines: [
            ...this.runState.terminalLines,
            { type: 'ok', text: '==================================================' },
            { type: 'ok', text: '✓ ALL VERIFICATION CHECKS PASSED — STATUS: VERIFIED' },
            { type: 'ok', text: '==================================================' },
          ],
        });
        break;
    }
  }
}
