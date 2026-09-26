import { usePreviewStateMachine } from './usePreviewStateMachine';
import type { PreviewState, ActivityLine, TerminalLine } from './previewStates';
import styles from './HeroPreview.module.css';

/* ============================================================
   HeroPreview — The animated product-preview centerpiece
   ============================================================ */

export function HeroPreview() {
  const { currentState, isTransitioning } = usePreviewStateMachine();

  const fadeClass = isTransitioning ? styles.out : styles.in;

  return (
    <div className={styles.previewWrapper}>
      <PreviewTopbar state={currentState} />
      <div className={styles.previewBody}>
        <PreviewSidebar phase={currentState.phase} />
        <div className={styles.mainContent}>
          <TaskHeader state={currentState} />
          <PhaseBar state={currentState} />
          <div className={`${styles.contentFade} ${fadeClass}`} key={currentState.phase}>
            <ActivityArea state={currentState} />
          </div>
        </div>
        <AgentPanel state={currentState} fadeClass={fadeClass} />
      </div>
      <div className={`${styles.contentFade} ${fadeClass}`} key={`term-${currentState.phase}`}>
        <PreviewTerminal state={currentState} />
      </div>
    </div>
  );
}

/* ============================================================
   Sub-components
   ============================================================ */

function PreviewTopbar({ state }: { state: PreviewState }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <div className={styles.topbarDots}>
          <div className={`${styles.topbarDot} ${styles.dotRed}`} />
          <div className={`${styles.topbarDot} ${styles.dotYellow}`} />
          <div className={`${styles.topbarDot} ${styles.dotGreen}`} />
        </div>
        <span className={styles.topbarBrand}>
          Caffi<span className={styles.topbarBrandAccent}>Pilot</span>
        </span>
      </div>

      <div className={styles.topbarBreadcrumb}>
        <span className={styles.breadcrumbBranch}>⑂</span>
        <span>ecommerce-app</span>
        <span className={styles.breadcrumbSlash}>/</span>
        <span>main</span>
      </div>

      <div className={`${styles.statusBadge} ${styles[`status_${state.phase}`] || styles.status_active}`}>
        <span className={styles.statusDot} />
        <span>{state.statusLabel}</span>
      </div>
    </div>
  );
}

function PreviewSidebar({ phase }: { phase: string }) {
  const items = [
    { icon: '◫', id: 'overview' },
    { icon: '⚡', id: 'task' },
    { icon: '▶', id: 'run' },
    { icon: '📄', id: 'diff' },
    { icon: '⑂', id: 'branch' },
    { icon: '⚙', id: 'settings' },
  ];

  const activeMap: Record<string, string> = {
    task: 'task',
    analysis: 'task',
    execution: 'run',
    recovery: 'task',
    verification: 'diff',
    complete: 'run',
  };

  return (
    <div className={styles.sidebar}>
      {items.map((item) => (
        <div
          key={item.id}
          className={`${styles.sidebarIcon} ${
            activeMap[phase] === item.id ? styles.active : ''
          }`}
        >
          {item.icon}
        </div>
      ))}
    </div>
  );
}

function TaskHeader({ state }: { state: PreviewState }) {
  return (
    <div className={styles.taskHeader}>
      <div className={styles.taskTitle}>
        <span className={styles.taskIssue}>#412</span>
        <span className={styles.taskName}>{state.taskTitle}</span>
      </div>
    </div>
  );
}

function PhaseBar({ state }: { state: PreviewState }) {
  if (state.phase === 'recovery') {
    return (
      <div className={styles.phaseBar}>
        <div className={`${styles.phaseStep} ${styles.complete}`}>
          <span className={styles.phaseStepIcon}>✓</span> FIND
        </div>
        <div className={`${styles.phaseStep} ${styles.complete}`}>
          <span className={styles.phaseStepIcon}>✓</span> FIX
        </div>
        <div className={`${styles.phaseStep} ${styles.recoveryActive}`}>
          <span className={styles.phaseStepIcon}>◎</span> RECOVERY
        </div>
        <div className={`${styles.phaseStep} ${styles.dimmed}`}>
          VERIFY
        </div>
      </div>
    );
  }

  if (state.phase === 'complete') {
    return (
      <div className={styles.phaseBar}>
        <div className={`${styles.phaseStep} ${styles.complete}`}>
          <span className={styles.phaseStepIcon}>✓</span> FIND
        </div>
        <div className={`${styles.phaseStep} ${styles.complete}`}>
          <span className={styles.phaseStepIcon}>✓</span> FIX
        </div>
        <div className={`${styles.phaseStep} ${styles.complete}`}>
          <span className={styles.phaseStepIcon}>✓</span> VERIFIED
        </div>
      </div>
    );
  }

  return (
    <div className={styles.phaseBar}>
      <div className={`${styles.phaseStep} ${state.phaseProgress[0] ? styles.complete : styles.active}`}>
        {state.phaseProgress[0] && <span className={styles.phaseStepIcon}>✓</span>} FIND
      </div>
      <div className={`${styles.phaseStep} ${state.phaseProgress[1] ? styles.complete : state.phaseProgress[0] ? styles.active : styles.dimmed}`}>
        {state.phaseProgress[1] && <span className={styles.phaseStepIcon}>✓</span>} FIX
      </div>
      <div className={`${styles.phaseStep} ${state.phaseProgress[2] ? styles.complete : state.phaseProgress[1] ? styles.active : styles.dimmed}`}>
        {state.phaseProgress[2] && <span className={styles.phaseStepIcon}>✓</span>} VERIFY
      </div>
    </div>
  );
}

function ActivityArea({ state }: { state: PreviewState }) {
  return (
    <div className={styles.activityArea}>
      <div className={styles.activityHeader}>
        AGENT ACTIVITY
      </div>
      <div className={styles.activityList}>
        {state.activityLines.map((line, i) => (
          <ActivityLineRow key={`${state.phase}-${i}`} line={line} />
        ))}
      </div>

      {state.verified && (
        <div className={styles.verifiedBadgeLarge}>
          <span className={styles.phaseStepIcon}>✓</span>
          <span>ALL TESTS PASSING — VERIFIED</span>
        </div>
      )}
    </div>
  );
}

function ActivityLineRow({ line }: { line: ActivityLine }) {
  const iconClass =
    line.icon === '✓' || line.icon === '✔'
      ? styles.check
      : line.icon === '✕' || line.icon === 'ⓧ'
        ? styles.cross
        : line.icon === '◎'
          ? styles.recovering
          : line.icon === '→'
            ? styles.arrow
            : styles.diamond;

  return (
    <div className={styles.activityLine}>
      <div className={styles.activityLineLeft}>
        <span className={`${styles.lineIcon} ${iconClass}`}>
          {line.icon}
        </span>
        <span className={`${styles.lineText} ${line.highlight ? styles.highlight : ''}`}>
          {line.text}
          {line.file && <span className={styles.lineFile}>{line.file}</span>}
        </span>
      </div>
      {line.time && <span className={styles.activityTime}>{line.time}</span>}
      {!line.time && line.status && (
        <span className={styles.lineStatus}>{line.status}</span>
      )}
    </div>
  );
}

function AgentPanel({
  state,
  fadeClass,
}: {
  state: PreviewState;
  fadeClass: string;
}) {
  return (
    <div className={styles.agentPanel}>
      <div className={styles.agentPanelHeader}>
        <span className={styles.agentPanelTitle}>AGENT STATE</span>
        <span className={styles.panelDots}>⋯</span>
      </div>
      <div className={`${styles.contentFade} ${fadeClass} ${styles.agentEntries}`}>
        {state.agentState.map((entry) => (
          <div key={entry.label} className={styles.agentEntry}>
            <span className={styles.agentEntryLabel}>{entry.label}</span>
            <span className={`${styles.agentEntryValue} ${entry.highlight ? styles.highlightAmber : ''}`}>
              {entry.value}
            </span>
          </div>
        ))}
      </div>

      <div className={styles.agentDivider} />

      <div className={styles.currentActionBlock}>
        <div className={styles.currentActionTitle}>CURRENT ACTION</div>
        <div className={styles.currentActionText}>
          {state.currentAction || 'Analyzing test failures and updating patch...'}
        </div>
      </div>
    </div>
  );
}

function PreviewTerminal({ state }: { state: PreviewState }) {
  return (
    <div className={styles.terminal}>
      <div className={styles.terminalHeader}>
        <div className={styles.terminalTitle}>
          TERMINAL
        </div>
        <div className={styles.terminalDots}>•••</div>
      </div>
      <div className={styles.terminalLines}>
        {state.terminalLines.map((line, i) => (
          <TerminalLineRow key={`${state.phase}-term-${i}`} line={line} />
        ))}
      </div>
    </div>
  );
}

function TerminalLineRow({ line }: { line: TerminalLine }) {
  const typeClass = line.type ? styles[line.type] : styles.output;

  return (
    <div className={`${styles.terminalLine} ${typeClass}`}>
      {line.text}
    </div>
  );
}
