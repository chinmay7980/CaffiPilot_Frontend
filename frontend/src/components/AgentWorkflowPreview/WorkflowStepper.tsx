import { WORKFLOW_STAGES } from './workflowData';
import styles from './AgentWorkflowPreview.module.css';

interface WorkflowStepperProps {
  activeStage: number;
  onSelectStage: (idx: number) => void;
}

function StepNodeIcon({ index, isComplete }: { index: number; isComplete: boolean }) {
  if (isComplete) {
    return (
      <svg
        className={styles.nodeSvg}
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }

  switch (index) {
    case 0:
      // 01: Issue / GitHub style target icon
      return (
        <svg
          className={styles.nodeSvg}
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case 1:
      // 02: Folder / Search
      return (
        <svg
          className={styles.nodeSvg}
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      );
    case 2:
      // 03: Code / Context brackets
      return (
        <svg
          className={styles.nodeSvg}
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    case 3:
      // 04: Code / Edit
      return (
        <svg
          className={styles.nodeSvg}
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      );
    case 4:
    default:
      // 05: Verification checkmark
      return (
        <svg
          className={styles.nodeSvg}
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      );
  }
}

export function WorkflowStepper({ activeStage, onSelectStage }: WorkflowStepperProps) {
  const progressPercent = (activeStage / (WORKFLOW_STAGES.length - 1)) * 100;

  return (
    <div
      className={styles.stepperWrapper}
      role="tablist"
      aria-label="CaffiPilot 5-step visual workflow"
    >
      {/* Engineering connector line spanning the centers of all five nodes */}
      <div className={styles.timelineRail} aria-hidden="true">
        <div
          className={styles.timelineProgress}
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className={styles.timelineSignal}
          style={{ left: `${progressPercent}%` }}
        />
      </div>

      {/* 5 Conceptual Stages: Number -> Circular Node -> Title -> Description */}
      <div className={styles.stepperGrid}>
        {WORKFLOW_STAGES.map((stage, idx) => {
          const isActive = activeStage === idx;
          const isComplete = activeStage > idx;

          return (
            <button
              key={stage.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`preview-panel-${stage.id}`}
              aria-label={`Step ${stage.stepNum}: ${stage.title}`}
              className={`${styles.stepButton} ${isActive ? styles.stepActive : ''} ${
                isComplete ? styles.stepComplete : ''
              }`}
              onClick={() => onSelectStage(idx)}
            >
              {/* 1. Stage Number ABOVE the circular node */}
              <span className={styles.stepNum}>{stage.stepNum}</span>

              {/* 2. Prominent Circular Node (56–64px diameter) with Icon */}
              <div className={styles.stepNode}>
                <div className={styles.stepNodeInner}>
                  <StepNodeIcon index={idx} isComplete={isComplete} />
                </div>
                {isActive && <div className={styles.stepPulseRing} />}
              </div>

              {/* 3. Title (15–17px) & 4. Concise Description (below node) */}
              <div className={styles.stepInfo}>
                <span className={styles.stepTitle}>{stage.title}</span>
                <span className={styles.stepDesc}>{stage.description}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
