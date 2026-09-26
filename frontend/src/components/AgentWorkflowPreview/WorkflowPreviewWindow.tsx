import { Badge } from '../Badge/Badge';
import { INTERNAL_SEVEN_STEPS, type WorkflowStageData } from './workflowData';
import styles from './AgentWorkflowPreview.module.css';

interface WorkflowPreviewWindowProps {
  stage: WorkflowStageData;
  highlightedTarget?: string | null;
}

export function WorkflowPreviewWindow({ stage, highlightedTarget }: WorkflowPreviewWindowProps) {
  return (
    <div
      id={`preview-panel-${stage.id}`}
      role="tabpanel"
      className={styles.previewContainer}
      aria-label={`Preview of ${stage.title}`}
    >
      {/* 1. Window Application Chrome Header */}
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <div className={styles.topbarDots} aria-hidden="true">
            <div className={`${styles.topbarDot} ${styles.dotRed}`} />
            <div className={`${styles.topbarDot} ${styles.dotYellow}`} />
            <div className={`${styles.topbarDot} ${styles.dotGreen}`} />
          </div>
          <span className={styles.topbarBrand}>
            Caffi<span className={styles.topbarBrandAccent}>Pilot</span>
          </span>
        </div>

        <div className={styles.topbarBreadcrumb}>
          <span className={styles.breadcrumbBranch} aria-hidden="true">⑂</span>
          <span className={styles.breadcrumbRepo}>ecommerce-app</span>
          <span className={styles.breadcrumbSlash}>/</span>
          <span className={styles.breadcrumbBranchName}>main</span>
        </div>

        <div className={styles.topbarRight}>
          <Badge variant={stage.badge}>{stage.badgeText}</Badge>
        </div>
      </div>

      {/* 2. Internal 7-Step Product Progress Bar (Target for "CLEAR PROGRESS") */}
      <div
        className={`${styles.internalProgressTrack} ${
          highlightedTarget === 'timeline' ? styles.targetHighlight : ''
        }`}
        aria-label="Workflow progress track"
      >
        <div className={styles.internalProgressSteps}>
          {INTERNAL_SEVEN_STEPS.map((stepName, stepIdx) => {
            const isCompleted = stage.internalStepIndex > stepIdx;
            const isCurrent = stage.internalStepIndex === stepIdx;

            return (
              <div
                key={stepName}
                className={`${styles.internalStepItem} ${
                  isCurrent ? styles.internalStepActive : ''
                } ${isCompleted ? styles.internalStepComplete : ''}`}
              >
                <span className={styles.internalStepDot} />
                <span className={styles.internalStepText}>{stepName}</span>
                {stepIdx < INTERNAL_SEVEN_STEPS.length - 1 && (
                  <span className={styles.internalStepDivider} aria-hidden="true">→</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Main Workspace Body (Agent Activity + Repo/Plan/Diff + Subdued Telemetry) */}
      <div className={styles.previewBody}>
        {/* Navigation Sidebar */}
        <div className={styles.sidebar} aria-hidden="true">
          <div className={`${styles.sidebarIcon} ${styles.sidebarActive}`} title="Active Task">⚡</div>
          <div className={styles.sidebarIcon} title="Files">📁</div>
          <div className={styles.sidebarIcon} title="Tests">🧪</div>
          <div className={styles.sidebarIcon} title="Verification">🛡️</div>
        </div>

        {/* Center Main Stage Content */}
        <div className={styles.mainContent}>
          {/* Issue Context Header */}
          <div className={styles.taskHeader}>
            <div className={styles.taskTitle}>
              <span className={styles.taskIssue}>#412</span>
              <span>Fix duplicate cart items on rapid clicks</span>
            </div>
            <span className={styles.taskModule}>src/cart/cartService.ts</span>
          </div>

          {/* Activity Feed Area (Target for "REAL-TIME ACTIVITY") */}
          <div
            className={`${styles.activityArea} ${
              highlightedTarget === 'activity' ? styles.targetHighlight : ''
            }`}
            key={stage.id}
          >
            {/* Phase Subtitle */}
            <div className={styles.phaseLabelRow}>
              <span className={styles.phaseLabelTag}>STAGE {stage.stepNum}</span>
              <span className={styles.phaseLabelText}>{stage.phaseLabel}</span>
            </div>

            {/* Optional Repo Tree Context (Target for "LIVE REPOSITORY VIEW") */}
            {stage.repoContext && (
              <div
                className={`${styles.treeViewBox} ${
                  highlightedTarget === 'repo' ? styles.targetHighlight : ''
                }`}
              >
                <div className={styles.treeViewHeader}>REPOSITORY CONTEXT</div>
                <div className={styles.treeFiles}>
                  {stage.repoContext.files.map((file, i) => (
                    <div
                      key={`file-${i}`}
                      className={`${styles.treeLine} ${
                        file.highlighted ? styles.treeLineHighlighted : ''
                      }`}
                      style={{ paddingLeft: `${file.indent * 14 + 8}px` }}
                    >
                      <span className={styles.treeIcon} aria-hidden="true">
                        {file.isFolder ? '📁' : '📄'}
                      </span>
                      <span className={styles.treeName}>{file.name}</span>
                      {file.tag && (
                        <span className={styles.treeTag}>{file.tag}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional Plan & Diff (when plan & modify) */}
            {stage.plan && (
              <div className={styles.planBox}>
                <div className={styles.planHeader}>IMPLEMENTATION PLAN</div>
                <div className={styles.planList}>
                  {stage.plan.map((p, idx) => (
                    <div key={`plan-${idx}`} className={styles.planItem}>
                      <span className={styles.planBullet}>›</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stage.diff && (
              <div className={styles.diffBox}>
                <div className={styles.diffTop}>
                  <span className={styles.diffFile}>{stage.diff.file}</span>
                  <span className={styles.diffStat}>{stage.diff.stats}</span>
                </div>
                <div className={styles.diffDel}>
                  <span className={styles.diffSign}>-</span>
                  <span>{stage.diff.del}</span>
                </div>
                <div className={styles.diffAdd}>
                  <span className={styles.diffSign}>+</span>
                  <span>{stage.diff.add}</span>
                </div>
              </div>
            )}

            {/* Optional Verification Checklist */}
            {stage.verification && (
              <div className={styles.verifyBox}>
                <div className={styles.verifyHeader}>EVIDENCE CHECKLIST</div>
                <div className={styles.verifyGrid}>
                  {stage.verification.map((v, i) => (
                    <div key={`ver-${i}`} className={styles.verifyRow}>
                      <span className={styles.verifyCheck}>✓</span>
                      <span className={styles.verifyLabel}>{v.label}</span>
                      <span className={styles.verifyStatus}>{v.status}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.verifiedProofPill}>
                  <span className={styles.verifiedDot} />
                  <span className={styles.verifiedText}>STATUS: VERIFIED</span>
                  <span className={styles.verifiedMeta}>Proof bundle ready for PR</span>
                </div>
              </div>
            )}

            {/* Activity Stream Lines (Observable agent actions) */}
            <div className={styles.activityLines}>
              {stage.activity.map((item, idx) => (
                <div
                  key={`${stage.id}-${idx}`}
                  className={`${styles.activityLine} ${
                    item.highlight ? styles.activityHighlight : ''
                  }`}
                >
                  <span
                    className={`${styles.lineIcon} ${
                      item.icon === '✓'
                        ? styles.check
                        : item.icon === '→'
                          ? styles.arrow
                          : styles.diamond
                    }`}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </span>
                  <span className={styles.lineText}>{item.text}</span>
                  {item.meta && (
                    <span className={styles.lineMeta}>{item.meta}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Secondary Subdued Telemetry Strip */}
        <div className={styles.agentPanel}>
          <div className={styles.agentPanelTitle}>SESSION TELEMETRY</div>
          <div className={styles.agentEntries}>
            {stage.agentState.map((entry) => (
              <div key={entry.label} className={styles.agentEntry}>
                <span className={styles.agentEntryLabel}>{entry.label}</span>
                <span
                  className={`${styles.agentEntryValue} ${
                    entry.highlight ? styles.agentHighlight : ''
                  }`}
                >
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Bottom Terminal Output (Target for "DETAILED OUTPUT") */}
      <div
        className={`${styles.terminal} ${
          highlightedTarget === 'terminal' ? styles.targetHighlight : ''
        }`}
        key={`term-${stage.id}`}
      >
        <div className={styles.terminalHeader}>
          <div className={styles.terminalTitle}>▸ Terminal — sandbox-01</div>
          <div className={styles.terminalStatus}>LIVE EXECUTION</div>
        </div>
        <div className={styles.terminalLines}>
          {stage.terminal.map((t, idx) => (
            <div
              key={`term-line-${idx}`}
              className={`${styles.terminalLine} ${styles[t.type] || styles.output}`}
            >
              {t.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
