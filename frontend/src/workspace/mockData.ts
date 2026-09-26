import type { Repository, TaskRun, IssueAnalysisData, ImplementationPlanData } from './types';

export const INITIAL_REPOSITORIES: Repository[] = [
  {
    id: 'ecommerce-app',
    name: 'ecommerce-app',
    language: 'TypeScript',
    branch: 'main',
    branches: ['main', 'develop', 'feature/cart'],
    status: 'Indexed',
    filesCount: 642,
  },
  {
    id: 'backend-api',
    name: 'backend-api',
    language: 'Python',
    branch: 'main',
    branches: ['main', 'develop', 'release/v2'],
    status: 'Ready',
    filesCount: 418,
  },
  {
    id: 'portfolio',
    name: 'portfolio',
    language: 'Next.js',
    branch: 'main',
    branches: ['main', 'develop'],
    status: 'Ready',
    filesCount: 124,
  },
  {
    id: 'auth-service',
    name: 'auth-service',
    language: 'Go',
    branch: 'main',
    branches: ['main', 'develop', 'fix/oauth-token'],
    status: 'Ready',
    filesCount: 95,
  },
];

export const INITIAL_RUNS: TaskRun[] = [
  {
    id: 'run-412',
    title: 'Fix duplicate cart items',
    repo: 'ecommerce-app',
    branch: 'main',
    status: 'Verified',
    phase: 'VERIFY',
    timestamp: '12m ago',
    iteration: '4 / 12',
    filesInspected: 42,
    filesChanged: 2,
    toolCalls: 14,
  },
  {
    id: 'run-398',
    title: 'Fix authentication refresh bug',
    repo: 'backend-api',
    branch: 'main',
    status: 'Recovered',
    phase: 'VERIFY',
    timestamp: '2h ago',
    iteration: '6 / 12',
    filesInspected: 18,
    filesChanged: 3,
    toolCalls: 22,
  },
];

export const DEFAULT_ANALYSIS_DATA: IssueAnalysisData = {
  issueNumber: '#412',
  title: 'Fix duplicate cart items',
  repo: 'ecommerce-app',
  branch: 'main',
  problem: 'Users can add the same product multiple times to the cart.',
  expectedBehavior:
    'Existing cart item quantity should increase instead of creating another line item.',
  detectedArea: 'Cart service',
  understanding:
    'The agent has identified the cart insertion path and the existing regression-test location.',
  relevantFiles: [
    {
      path: 'src/cart/cartService.ts',
      relevance: 'Highly relevant',
      notes: 'Contains addItem() mutation and duplicate check logic',
    },
    {
      path: 'src/cart/cartController.ts',
      relevance: 'Relevant',
      notes: 'HTTP endpoint dispatching cart actions',
    },
    {
      path: 'tests/cart.test.ts',
      relevance: 'Highly relevant',
      notes: 'Existing regression suite for item quantity assertion',
    },
    {
      path: 'src/cart/types.ts',
      relevance: 'Related',
      notes: 'CartItem and CartState interface declarations',
    },
  ],
};

export const DEFAULT_PLAN_DATA: ImplementationPlanData = {
  issueNumber: '#412',
  title: 'Fix duplicate cart items',
  repo: 'ecommerce-app',
  branch: 'main',
  objective:
    'Prevent duplicate cart line items when the same product is added repeatedly.',
  expectedBehavior:
    'Increase the quantity of the existing line item instead of creating another line item.',
  steps: [
    {
      number: '01',
      title: 'Inspect cart insertion logic',
      description: 'Understand how products are currently added to the cart.',
      files: ['src/cart/cartService.ts'],
      status: 'Proposed',
    },
    {
      number: '02',
      title: 'Trace duplicate-item path',
      description: 'Follow the request through the cart service and controller.',
      files: ['src/cart/cartController.ts'],
      status: 'Proposed',
    },
    {
      number: '03',
      title: 'Review existing tests',
      description: 'Identify current coverage and missing regression scenarios.',
      files: ['tests/cart.test.ts'],
      status: 'Proposed',
    },
    {
      number: '04',
      title: 'Modify cart behavior',
      description:
        'Update the insertion logic so an existing item is incremented instead of duplicated.',
      files: ['src/cart/cartService.ts'],
      status: 'Proposed',
    },
    {
      number: '05',
      title: 'Add regression test',
      description: 'Add coverage for repeated additions of the same product.',
      files: ['tests/cart.test.ts'],
      status: 'Proposed',
    },
    {
      number: '06',
      title: 'Run targeted tests',
      description: 'Validate the cart behavior against the relevant test suite.',
      files: ['tests/cart.test.ts'],
      status: 'Proposed',
    },
    {
      number: '07',
      title: 'Run verification',
      description: 'Run broader checks and inspect final changes.',
      status: 'Proposed',
    },
  ],
  relevantFiles: [
    {
      path: 'src/cart/cartService.ts',
      role: 'Primary modification',
    },
    {
      path: 'src/cart/cartController.ts',
      role: 'Related route handler',
    },
    {
      path: 'tests/cart.test.ts',
      role: 'Regression coverage',
    },
  ],
};
