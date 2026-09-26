import { useEffect, useRef, useState } from 'react';
import { Section } from '../Section/Section';
import styles from './RecoveryStory.module.css';

type RecoveryStage = 'fail' | 'analyze' | 'adapt' | 'retry' | 'pass';

interface StageMeta {
  id: RecoveryStage;
  num: string;
  label: string;
  icon: string;
  statusText: string;
  colorVar: string;
}

const STAGES: StageMeta[] = [
  {
    id: 'fail',
    num: '01',
    label: 'FAIL',
    icon: '✕',
    statusText: 'Failure Detected',
    colorVar: 'fail',
  },
  {
    id: 'analyze',
    num: '02',
    label: 'ANALYZE',
    icon: '🔍',
    statusText: 'Investigating Root Cause',
    colorVar: 'analyze',
  },
  {
    id: 'adapt',
    num: '03',
    label: 'ADAPT',
    icon: '⚡',
    statusText: 'Updating Strategy',
    colorVar: 'adapt',
  },
  {
    id: 'retry',
    num: '04',
    label: 'RETRY',
    icon: '↻',
    statusText: 'Applying Corrective Patch',
    colorVar: 'retry',
  },
  {
    id: 'pass',
    num: '05',
    label: 'PASS',
    icon: '✓',
    statusText: 'Targeted Suite Verified',
    colorVar: 'pass',
  },
];

const TERMINAL_OUTPUTS: Record<
  RecoveryStage,
  Array<{ text: string; type: 'command' | 'output' | 'error' | 'success' | 'muted' }>
> = {
  fail: [
    { text: '$ pytest tests/cart/test_cart.py -v', type: 'command' },
    { text: 'FAILED tests/cart.test.ts:38 test_duplicate_item_quantity', type: 'error' },
    { text: 'AssertionError: Expected subtotal 60, but received 20', type: 'error' },
    { text: '2 failed, 12 passed in 1.42s', type: 'muted' },
  ],
  analyze: [
    { text: '$ caffipilot inspect-failure --trace tests/cart.test.ts:38', type: 'command' },
    { text: 'Tracing assertion failure: Expected 60, Received 20', type: 'output' },
    { text: 'Root cause isolated: mutateCart increments quantity without recalculating subtotal', type: 'output' },
    { text: 'Target isolated: src/cart/cartService.ts:140-175', type: 'muted' },
  ],
  adapt: [
    { text: '$ caffipilot adapt-strategy --target src/cart/cartService.ts', type: 'command' },
    { text: 'Previous strategy: increment item quantity only', type: 'output' },
    { text: 'New strategy: acquireCartMutex() + recalculateSubtotal() barrier', type: 'success' },
    { text: 'Context updated. Corrective diff synthesized.', type: 'muted' },
  ],
  retry: [
    { text: '$ caffipilot retry --strategy corrected', type: 'command' },
    { text: 'Applying patch to src/cart/cartService.ts (+4 / -1)...', type: 'output' },
    { text: 'Running 14 targeted regression tests against sandbox-01...', type: 'output' },
    { text: 'Executing test_duplicate_item_quantity...', type: 'muted' },
  ],
  pass: [
    { text: '$ pytest tests/cart/test_cart.py -v', type: 'command' },
    { text: '14 passed in 1.18s — 0 regressions', type: 'success' },
    { text: '$ caffipilot verify --bundle-proof', type: 'command' },
    { text: 'STATUS: VERIFIED — all checks passed. Ready for pull request.', type: 'success' },
  ],
};

const STAGE_DURATIONS: Record<RecoveryStage, number> = {
  fail: 2000,
  analyze: 2200,
  adapt: 2400,
  retry: 2200,
  pass: 3200,
};

export function RecoveryStory() {
  const [activeStage, setActiveStage] = useState<RecoveryStage>('fail');
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  // IntersectionObserver to activate automatic progression when visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.15 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calm automatic sequence progressing through the stages
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setActiveStage('pass');
      return;
    }

    const currentIdx = STAGES.findIndex((s) => s.id === activeStage);
    const duration = userInteracted ? 7000 : STAGE_DURATIONS[activeStage];

    const timer = setTimeout(() => {
      if (isVisibleRef.current) {
        const nextIdx = (currentIdx + 1) % STAGES.length;
        setActiveStage(STAGES[nextIdx].id);
        setUserInteracted(false);
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [activeStage, userInteracted]);

  const handleStageSelect = (stageId: RecoveryStage) => {
    setActiveStage(stageId);
    setUserInteracted(true);
  };

  const activeStageIdx = STAGES.findIndex((s) => s.id === activeStage);

  return (
    <Section id="recovery" animate surface spacing="spacious" bordered>
      <div className={styles.container} ref={containerRef}>
        {/* Subtle semantic ambient atmosphere (shifts softly with stage) */}
        <div
          className={`${styles.atmosphereGlow} ${styles[`glow_${activeStage}`]}`}
          aria-hidden="true"
        />

        {/* Section Intro: Technical Eyebrow, Main Heading, Supporting Copy */}
        <div className={styles.introBlock}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            AUTONOMOUS RECOVERY
          </div>
          <h2 className={styles.heading}>
            It doesn't stop at the <span className={styles.headingAccent}>first failure.</span>
          </h2>
          <p className={styles.subtitle}>
            When a patch fails, CaffiPilot investigates the failure, updates its
            context, changes its approach, and retries.
          </p>
        </div>

        {/* ============================================================
            CONNECTED RECOVERY FLOW STEPPER (FAIL -> ANALYZE -> ADAPT -> RETRY -> PASS)
            ============================================================ */}
        <div
          className={styles.recoveryStepperWrap}
          role="tablist"
          aria-label="Autonomous recovery stages"
        >
          {/* Engineering Rail sitting behind the nodes */}
          <div className={styles.stepperRail} aria-hidden="true">
            <div
              className={styles.stepperRailProgress}
              style={{ width: `${(activeStageIdx / (STAGES.length - 1)) * 100}%` }}
            />
            <div
              className={styles.stepperSignalDot}
              style={{ left: `${(activeStageIdx / (STAGES.length - 1)) * 100}%` }}
            />
          </div>

          <div className={styles.stepperNodes}>
            {STAGES.map((s, idx) => {
              const isActive = activeStage === s.id;
              const isPast = activeStageIdx > idx;

              return (
                <button
                  key={s.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`recovery-panel-${s.id}`}
                  aria-label={`Recovery step ${s.num}: ${s.label} (${s.statusText})`}
                  className={`${styles.stepButton} ${isActive ? styles.btnActive : ''} ${
                    isPast ? styles.btnPast : ''
                  }`}
                  onClick={() => handleStageSelect(s.id)}
                >
                  <span className={styles.stepNum}>{s.num}</span>
                  <div className={`${styles.stepNodeCircle} ${styles[`node_${s.colorVar}`]}`}>
                    <span className={styles.stepIcon} aria-hidden="true">{s.icon}</span>
                    {isActive && <div className={styles.pulseRing} aria-hidden="true" />}
                  </div>
                  <span className={styles.stepTitle}>{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            THREE-PANEL RECOVERY SHOWCASE:
            FIRST ATTEMPT (Fail)  ──►  AUTONOMOUS RECOVERY (Analyze/Adapt/Retry)  ──►  SECOND ATTEMPT (Pass)
            ============================================================ */}
        <div className={styles.showcaseGrid}>
          {/* ────────────────────────────────────────────────────────
              PANEL 1: FIRST ATTEMPT (FAILURE EVIDENCE)
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.narrativeCard} ${styles.failCard} ${
              activeStage === 'fail' ? styles.cardFocused : ''
            }`}
            onClick={() => handleStageSelect('fail')}
            role="region"
            aria-label="First attempt failure evidence"
          >
            <div className={styles.cardHeader}>
              <div className={styles.headerTitleWrap}>
                <span className={styles.phaseIndicator}>ATTEMPT 01</span>
                <span className={styles.cardTitle}>TEST FAILURE</span>
              </div>
              <span className={styles.badgeFail}>2 FAILURES DETECTED</span>
            </div>

            <div className={styles.evidenceBox}>
              <div className={styles.evidenceLine}>
                <span className={styles.evidenceLabel}>Failed Test</span>
                <span className={styles.evidenceValRed}>test_duplicate_item_quantity</span>
              </div>
              <div className={styles.evidenceLine}>
                <span className={styles.evidenceLabel}>Location</span>
                <span className={styles.evidenceFile}>tests/cart.test.ts:38</span>
              </div>
              <div className={styles.assertionRow}>
                <div className={styles.assertionBox}>
                  <span className={styles.assertLabel}>Expected</span>
                  <span className={styles.assertValExpected}>60</span>
                </div>
                <span className={styles.assertionVs}>≠</span>
                <div className={styles.assertionBox}>
                  <span className={styles.assertLabel}>Received</span>
                  <span className={styles.assertValReceived}>20</span>
                </div>
              </div>
            </div>

            <p className={styles.cardExplanation}>
              First attempt updated item quantity directly but failed to trigger
              subtotal recalculation.
            </p>
          </div>

          {/* ────────────────────────────────────────────────────────
              PANEL 2: AUTONOMOUS RECOVERY (ANALYZE / ADAPT / RETRY)
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.narrativeCard} ${styles.recoveryCard} ${
              activeStage === 'analyze' || activeStage === 'adapt' || activeStage === 'retry'
                ? styles.cardFocused
                : ''
            }`}
            onClick={() => handleStageSelect('adapt')}
            role="region"
            aria-label="Autonomous investigation and strategy adaptation"
          >
            <div className={styles.cardHeader}>
              <div className={styles.headerTitleWrap}>
                <span className={styles.phaseIndicatorAmber}>AUTONOMOUS RECOVERY</span>
                <span className={styles.cardTitle}>STRATEGY SHIFT</span>
              </div>
              <span className={styles.badgeAmber}>
                {activeStage === 'analyze'
                  ? 'ANALYZING FAILURE'
                  : activeStage === 'retry'
                    ? 'RETRYING PATCH'
                    : 'STRATEGY UPDATED'}
              </span>
            </div>

            {/* Investigation Flow Diagram */}
            <div className={styles.investigationFlow}>
              <div className={styles.flowNode}>
                <span className={styles.flowLabel}>ERROR</span>
                <span className={styles.flowValue}>AssertionError</span>
              </div>
              <span className={styles.flowArrow}>→</span>
              <div className={styles.flowNode}>
                <span className={styles.flowLabel}>TARGET</span>
                <span className={styles.flowValue}>cartService.ts</span>
              </div>
              <span className={styles.flowArrow}>→</span>
              <div className={styles.flowNode}>
                <span className={styles.flowLabel}>CAUSE</span>
                <span className={styles.flowValue}>subtotal logic</span>
              </div>
            </div>

            {/* Tiny Code Diff Fragment */}
            <div className={styles.diffBox}>
              <div className={styles.diffHeader}>
                <span className={styles.diffFile}>src/cart/cartService.ts</span>
                <span className={styles.diffStat}>+2 / -1</span>
              </div>
              <div className={styles.diffLines}>
                <div className={styles.diffDel}>
                  <span className={styles.diffSign}>-</span>
                  <span>quantity += item.quantity;</span>
                </div>
                <div className={styles.diffAdd}>
                  <span className={styles.diffSign}>+</span>
                  <span>quantity += item.quantity;</span>
                </div>
                <div className={styles.diffAdd}>
                  <span className={styles.diffSign}>+</span>
                  <span className={styles.diffHighlight}>recalculateSubtotal();</span>
                </div>
              </div>
            </div>

            {/* Strategy change explanation */}
            <div className={styles.strategyRow}>
              <div className={styles.strategyPrev}>
                <span className={styles.stratLabel}>Previous:</span>
                <span className={styles.stratText}>Increment quantity only</span>
              </div>
              <span className={styles.stratArrow}>➔</span>
              <div className={styles.strategyNew}>
                <span className={styles.stratLabel}>New:</span>
                <span className={styles.stratText}>Recalculate subtotal on mutate</span>
              </div>
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────
              PANEL 3: SECOND ATTEMPT (SUCCESS EVIDENCE)
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.narrativeCard} ${styles.passCard} ${
              activeStage === 'pass' ? styles.cardFocused : ''
            }`}
            onClick={() => handleStageSelect('pass')}
            role="region"
            aria-label="Second attempt success verification"
          >
            <div className={styles.cardHeader}>
              <div className={styles.headerTitleWrap}>
                <span className={styles.phaseIndicatorGreen}>ATTEMPT 02</span>
                <span className={styles.cardTitle}>VERIFICATION</span>
              </div>
              <span className={styles.badgeGreen}>✓ ALL TESTS PASSED</span>
            </div>

            <div className={styles.passEvidenceBox}>
              <div className={styles.passCheckItem}>
                <span className={styles.passCheckIcon}>✓</span>
                <span className={styles.passCheckText}>test_duplicate_item_quantity</span>
                <span className={styles.passCheckMeta}>PASSED</span>
              </div>
              <div className={styles.passCheckItem}>
                <span className={styles.passCheckIcon}>✓</span>
                <span className={styles.passCheckText}>test_concurrent_click_deduplication</span>
                <span className={styles.passCheckMeta}>PASSED</span>
              </div>
              <div className={styles.passCheckItem}>
                <span className={styles.passCheckIcon}>✓</span>
                <span className={styles.passCheckText}>Full regression suite (14 / 14)</span>
                <span className={styles.passCheckMeta}>100%</span>
              </div>
            </div>

            <div className={styles.verifiedProofRow}>
              <span className={styles.verifiedDot} />
              <span className={styles.verifiedTitle}>VERIFIED</span>
              <span className={styles.verifiedDesc}>Proof bundle generated. 0 regressions.</span>
            </div>
          </div>
        </div>

        {/* ============================================================
            SYNCHRONIZED TERMINAL OUTPUT (FOLLOWS ACTIVE STAGE)
            ============================================================ */}
        <div className={styles.terminalContainer}>
          <div className={styles.terminalHeader}>
            <div className={styles.terminalLeft}>
              <div className={styles.terminalDots} aria-hidden="true">
                <span className={`${styles.termDot} ${styles.dotRed}`} />
                <span className={`${styles.termDot} ${styles.dotYellow}`} />
                <span className={`${styles.termDot} ${styles.dotGreen}`} />
              </div>
              <span className={styles.terminalTitle}>▸ Terminal — sandbox-01</span>
            </div>
            <div className={styles.terminalStatus}>
              <span>STAGE:</span>
              <span className={styles.stageTag}>{activeStage.toUpperCase()}</span>
            </div>
          </div>

          <div className={styles.terminalBody} key={activeStage}>
            {TERMINAL_OUTPUTS[activeStage].map((line, idx) => (
              <div
                key={`term-${activeStage}-${idx}`}
                className={`${styles.termLine} ${styles[line.type] || styles.output}`}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
