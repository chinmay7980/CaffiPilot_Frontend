import styles from './AgentWorkflowPreview.module.css';

interface WorkflowCalloutProps {
  title: string;
  description: string;
  direction: 'right' | 'left';
  target: 'timeline' | 'activity' | 'repo' | 'terminal';
  onHover?: (target: string | null) => void;
  className?: string;
}

export function WorkflowCallout({
  title,
  description,
  direction,
  target,
  onHover,
  className,
}: WorkflowCalloutProps) {
  const isRight = direction === 'right';

  return (
    <div
      className={`${styles.calloutCard} ${
        isRight ? styles.calloutPointingRight : styles.calloutPointingLeft
      } ${className || ''}`}
      onMouseEnter={() => onHover?.(target)}
      onMouseLeave={() => onHover?.(null)}
      tabIndex={0}
      role="note"
      aria-label={`${title}: ${description}`}
    >
      <div className={styles.calloutEyebrow}>
        <span className={styles.calloutDot} aria-hidden="true" />
        <span className={styles.calloutTitle}>{title}</span>
      </div>
      <p className={styles.calloutDesc}>{description}</p>

      {/* Subtle 1px engineering connector arrow in negative space */}
      <div
        className={isRight ? styles.connectorLineRight : styles.connectorLineLeft}
        aria-hidden="true"
      >
        <span className={isRight ? styles.arrowRight : styles.arrowLeft} />
      </div>
    </div>
  );
}

interface WorkflowCalloutsProps {
  onHover?: (target: string | null) => void;
}

export function WorkflowCalloutsLeft({ onHover }: WorkflowCalloutsProps) {
  return (
    <div className={styles.calloutsColumnLeft} aria-label="Workflow progress and activity callouts">
      {/* 1. CLEAR PROGRESS -> points right to workflow progress indicator */}
      <WorkflowCallout
        title="CLEAR PROGRESS"
        description="Follow each step as CaffiPilot moves from issue to verified patch."
        direction="right"
        target="timeline"
        onHover={onHover}
      />

      {/* 2. REAL-TIME ACTIVITY -> points right to main activity feed */}
      <WorkflowCallout
        title="REAL-TIME ACTIVITY"
        description="See what the agent is doing, from repository exploration to test execution."
        direction="right"
        target="activity"
        onHover={onHover}
      />
    </div>
  );
}

export function WorkflowCalloutsRight({ onHover }: WorkflowCalloutsProps) {
  return (
    <div className={styles.calloutsColumnRight} aria-label="Repository context and terminal callouts">
      {/* 3. LIVE REPOSITORY VIEW -> points left to repository/file tree panel */}
      <WorkflowCallout
        title="LIVE REPOSITORY VIEW"
        description="Watch relevant files being found and analyzed in context."
        direction="left"
        target="repo"
        onHover={onHover}
      />

      {/* 4. DETAILED OUTPUT -> points left to bottom terminal panel */}
      <WorkflowCallout
        title="DETAILED OUTPUT"
        description="Terminal output shows the agent's actual execution progress."
        direction="left"
        target="terminal"
        onHover={onHover}
      />
    </div>
  );
}
