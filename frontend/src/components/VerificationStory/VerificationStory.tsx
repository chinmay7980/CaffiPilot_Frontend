import { useEffect, useRef, useState } from 'react';
import { Section } from '../Section/Section';
import styles from './VerificationStory.module.css';

interface PipelineStep {
  id: string;
  num: string;
  label: string;
  shortLabel: string;
  status: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  { id: 'code', num: '01', label: 'CODE CHANGE', shortLabel: 'CODE', status: 'Applied' },
  { id: 'targeted', num: '02', label: 'TARGETED TESTS', shortLabel: 'TESTS', status: '14/14' },
  { id: 'suite', num: '03', label: 'FULL SUITE', shortLabel: 'SUITE', status: '47/47' },
  { id: 'lint_build', num: '04', label: 'LINT + BUILD', shortLabel: 'BUILD', status: 'Clean' },
  { id: 'diff', num: '05', label: 'FINAL DIFF', shortLabel: 'DIFF', status: '2 files' },
  { id: 'verified', num: '06', label: 'VERIFIED', shortLabel: 'PASS', status: 'Sealed' },
];

interface EvidenceCheck {
  id: string;
  label: string;
  scope: string;
  metric: string;
  badge: string;
  duration: string;
  summary: string;
  stageStep: number; // which pipeline step activates this check
}

const EVIDENCE_CHECKS: EvidenceCheck[] = [
  {
    id: 'targeted',
    label: 'Targeted tests',
    scope: 'tests/cart.test.ts',
    metric: '14 / 14 passed',
    badge: '14 PASSED',
    duration: '0.8s',
    summary: 'Direct unit assertions for duplicate cart item quantity logic',
    stageStep: 2,
  },
  {
    id: 'suite',
    label: 'Full test suite',
    scope: 'Entire repository test suite',
    metric: '47 / 47 passed',
    badge: '47 PASSED',
    duration: '4.1s',
    summary: 'Integration, checkout, and inventory regression checks verified',
    stageStep: 3,
  },
  {
    id: 'lint',
    label: 'Lint & static analysis',
    scope: 'eslint & typescript compiler',
    metric: 'No issues detected',
    badge: 'CLEAN',
    duration: '0.4s',
    summary: 'Zero warnings, zero type errors, strict formatting confirmed',
    stageStep: 4,
  },
  {
    id: 'build',
    label: 'Production build',
    scope: 'tsc -b && vite build',
    metric: 'Production build passed',
    badge: 'PASSED',
    duration: '1.2s',
    summary: 'Dist bundle generated without compilation warnings or budget flags',
    stageStep: 4,
  },
  {
    id: 'diff',
    label: 'Final diff review',
    scope: 'src/cart/cartService.ts, tests/cart.test.ts',
    metric: '2 files reviewed',
    badge: '+10 / -14',
    duration: '0.3s',
    summary: 'No unintended side effects or leaked secrets outside target scope',
    stageStep: 5,
  },
];

const TERMINAL_LINES = [
  { cmd: '$ caffipilot verify --suite all', type: 'command' },
  { text: '[0.8s] PASS tests/cart.test.ts — 14 / 14 targeted tests passed', type: 'success', step: 2 },
  { text: '[4.1s] PASS suite/regression.test.ts — 47 / 47 full suite passed', type: 'success', step: 3 },
  { text: '[0.4s] LINT static analysis clean — 0 errors, 0 warnings', type: 'info', step: 4 },
  { text: '[1.2s] BUILD production bundle compiled — dist/ verified', type: 'info', step: 4 },
  { text: '[0.3s] DIFF scoped patch validated — 2 files (+10/-14)', type: 'info', step: 5 },
  { text: '✓ VERIFIED — execution proof bundle sealed with PR #412', type: 'sealed', step: 6 },
];

export function VerificationStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(6); // Default to full verification
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);

  // Scroll entrance observer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActiveStep(6);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startSequence();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  const startSequence = () => {
    setIsAutoPlaying(true);
    setActiveStep(1);

    const stepTimings = [
      { step: 1, delay: 0 },
      { step: 2, delay: 650 },
      { step: 3, delay: 1350 },
      { step: 4, delay: 2050 },
      { step: 5, delay: 2750 },
      { step: 6, delay: 3500 },
    ];

    stepTimings.forEach(({ step, delay }) => {
      setTimeout(() => {
        setActiveStep(step);
        if (step === 6) {
          setIsAutoPlaying(false);
        }
      }, delay);
    });
  };

  const handleStepClick = (stepIndex: number) => {
    setIsAutoPlaying(false);
    setActiveStep(stepIndex);
  };

  const isVerifiedState = activeStep >= 6;
  const progressRatio = (Math.max(1, activeStep) - 1) / (PIPELINE_STEPS.length - 1);

  return (
    <Section id="verification" animate surface spacing="spacious" bordered>
      <div className={styles.container} ref={containerRef}>
        {/* Subtle Ambient Atmosphere Layer */}
        <div
          className={`${styles.atmosphereGlow} ${isVerifiedState ? styles.glowVerified : styles.glowProgress}`}
          aria-hidden="true"
        />

        {/* Section Intro */}
        <div className={styles.introBlock}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            PROOF BEFORE DONE
          </div>
          <h2 className={styles.heading}>
            Proof Before <span className={styles.headingAccent}>Done.</span>
          </h2>
          <p className={styles.subtitle}>
            A model's claim is not enough. CaffiPilot verifies the change through execution evidence.
          </p>
        </div>

        {/* Model Claim vs System Verdict Strip */}
        <div className={styles.contrastStrip} role="region" aria-label="Philosophy comparison">
          <div className={styles.contrastCol}>
            <span className={styles.contrastLabel}>MODEL SAYS</span>
            <div className={styles.contrastBoxMuted}>
              <span className={styles.contrastQuote}>"Patch complete. Fix applied."</span>
            </div>
          </div>

          <div className={styles.contrastDivider}>
            <span className={styles.contrastArrow}>→</span>
            <span className={styles.contrastRequire}>SHOW ME</span>
            <span className={styles.contrastArrow}>→</span>
          </div>

          <div className={styles.contrastCol}>
            <span className={styles.contrastLabel}>SYSTEM VERIFIES</span>
            <div className={styles.contrastBoxAccent}>
              <span className={styles.contrastVerdict}>
                {isVerifiedState ? '✓ Execution Evidence Confirmed' : 'Collecting Execution Evidence...'}
              </span>
            </div>
          </div>
        </div>

        {/* Evidence Pipeline Rail */}
        <div
          className={styles.pipelineWrap}
          role="tablist"
          aria-label="Verification evidence pipeline"
        >
          {/* Engineering Rail Track */}
          <div className={styles.pipelineRail} aria-hidden="true">
            <div
              className={`${styles.pipelineProgress} ${isVerifiedState ? styles.railVerified : ''}`}
              style={{ width: `${progressRatio * 100}%` }}
            />
            <div
              className={`${styles.pipelineSignalDot} ${isVerifiedState ? styles.dotVerified : ''}`}
              style={{ left: `${progressRatio * 100}%` }}
            />
          </div>

          <div className={styles.pipelineNodes}>
            {PIPELINE_STEPS.map((step, idx) => {
              const stepNumber = idx + 1;
              const isPast = activeStep > stepNumber;
              const isCurrent = activeStep === stepNumber;
              const isStepVerified = isVerifiedState && step.id === 'verified';

              return (
                <button
                  key={step.id}
                  type="button"
                  role="tab"
                  aria-selected={isCurrent}
                  aria-label={`Step ${step.num}: ${step.label} (${step.status})`}
                  className={`${styles.stepNode} ${isCurrent ? styles.stepCurrent : ''} ${
                    isPast ? styles.stepPast : ''
                  } ${isStepVerified ? styles.stepComplete : ''}`}
                  onClick={() => handleStepClick(stepNumber)}
                >
                  <span className={styles.stepNum}>{step.num}</span>
                  <div className={styles.stepCircle}>
                    {isPast || isStepVerified ? (
                      <span className={styles.stepCheck}>✓</span>
                    ) : isCurrent ? (
                      <span className={styles.stepActiveDot} />
                    ) : (
                      <span className={styles.stepWaitDot} />
                    )}
                  </div>
                  <span className={styles.stepLabel}>{step.label}</span>
                  <span className={styles.stepStatusBadge}>{step.status}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ============================================================
            MAIN EVIDENCE BUNDLE (Centerpiece 75-85% Desktop Width)
            ============================================================ */}
        <div className={styles.evidenceBundleCard}>
          {/* Card Header */}
          <div className={styles.bundleHeader}>
            <div className={styles.headerLeft}>
              <span className={`${styles.headerPulseDot} ${isVerifiedState ? styles.dotGreen : styles.dotAmber}`} />
              <div className={styles.bundleTitleWrap}>
                <span className={styles.bundleMainTitle}>Execution Evidence Bundle</span>
                <span className={styles.bundleSubTitle}>Verified against targeted sandbox container</span>
              </div>
            </div>

            <div className={styles.headerRight}>
              <span className={styles.metaRepo}>ecommerce-app</span>
              <span className={styles.metaDivider}>/</span>
              <span className={styles.metaIssue}>#412</span>
              <div className={`${styles.verifiedHeaderBadge} ${isVerifiedState ? styles.badgeActive : ''}`}>
                <span className={styles.badgeCheck}>✓</span>
                <span>{isVerifiedState ? 'VERIFIED' : 'VERIFYING'}</span>
              </div>
            </div>
          </div>

          {/* Evidence Rows */}
          <div className={styles.evidenceRowsList}>
            {EVIDENCE_CHECKS.map((check) => {
              const isChecked = activeStep >= check.stageStep;
              const isCurrentCheck = activeStep === check.stageStep;

              return (
                <div
                  key={check.id}
                  className={`${styles.evidenceRow} ${isChecked ? styles.rowChecked : styles.rowPending} ${
                    isCurrentCheck ? styles.rowCurrent : ''
                  }`}
                >
                  <div className={styles.rowLeft}>
                    <div className={`${styles.rowStatusIcon} ${isChecked ? styles.iconPassed : styles.iconWaiting}`}>
                      {isChecked ? '✓' : '→'}
                    </div>
                    <div className={styles.rowInfo}>
                      <div className={styles.rowTitleWrap}>
                        <span className={styles.rowLabel}>{check.label}</span>
                        <span className={styles.rowScope}>{check.scope}</span>
                      </div>
                      <span className={styles.rowSummary}>{check.summary}</span>
                    </div>
                  </div>

                  <div className={styles.rowRight}>
                    <span className={styles.rowDuration}>{check.duration}</span>
                    <span className={`${styles.rowMetricBadge} ${isChecked ? styles.metricPassed : styles.metricWaiting}`}>
                      {isChecked ? check.badge : 'PENDING'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Integrated Execution Terminal Strip */}
          <div className={styles.terminalStrip} aria-label="Terminal verification evidence">
            <div className={styles.terminalTopBar}>
              <div className={styles.terminalWindowControls}>
                <span className={styles.termDot} />
                <span className={styles.termDot} />
                <span className={styles.termDot} />
              </div>
              <span className={styles.terminalTitle}>▸ Terminal — sandbox-01 · verification execution</span>
              <span className={styles.terminalEnv}>bash · PAGER=cat</span>
            </div>

            <div className={styles.terminalBody}>
              {TERMINAL_LINES.map((line, i) => {
                if (line.step && activeStep < line.step) {
                  return null;
                }

                if (line.type === 'command') {
                  return (
                    <div key={i} className={styles.termCommandLine}>
                      <span className={styles.termPrompt}>{line.cmd}</span>
                    </div>
                  );
                }

                return (
                  <div key={i} className={`${styles.termOutputLine} ${styles[`term_${line.type}`]}`}>
                    <span>{line.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Verified Panel (Bottom of Bundle) */}
          <div className={`${styles.verifiedPanel} ${isVerifiedState ? styles.panelVerified : ''}`}>
            <div className={styles.panelLeft}>
              <div className={styles.heroVerifiedBadge}>
                <span className={styles.heroCheck}>✓</span>
                <span className={styles.heroBadgeText}>VERIFIED</span>
              </div>
              <div className={styles.panelTextWrap}>
                <div className={styles.panelHeadline}>All required checks passed.</div>
                <div className={styles.panelSubtext}>
                  Evidence bundle permanently sealed and archived with pull request.
                </div>
              </div>
            </div>

            <div className={styles.panelRightMeta}>
              <div className={styles.metaChip}>
                <span className={styles.chipKey}>ISSUE</span>
                <span className={styles.chipVal}>#412 — Fix duplicate cart items</span>
              </div>
              <div className={styles.metaChip}>
                <span className={styles.chipKey}>FILES</span>
                <span className={styles.chipVal}>2 reviewed (+10/-14)</span>
              </div>
              <div className={styles.metaChip}>
                <span className={styles.chipKey}>REGRESSIONS</span>
                <span className={styles.chipValSuccess}>0 detected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Final Philosophy Statement */}
        <p className={styles.philosophyNote}>
          "The model does not get to decide that it is finished.{' '}
          <span className={styles.philosophyHighlight}>Evidence determines completion.</span>"
        </p>

        {/* Replay action button */}
        <div className={styles.actionWrap}>
          <button
            type="button"
            className={styles.replayButton}
            onClick={startSequence}
            disabled={isAutoPlaying}
            aria-label="Replay verification sequence"
          >
            <span className={styles.replayIcon}>↻</span>
            <span>{isAutoPlaying ? 'Running verification checks...' : 'Replay verification proof'}</span>
          </button>
        </div>
      </div>
    </Section>
  );
}
