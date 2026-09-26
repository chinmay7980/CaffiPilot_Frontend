import styles from './EngineeringLoop.module.css';

interface LoopPipelineProps {
  activeStage: number;
  onSelectStage: (stage: number) => void;
}

const STAGES = [
  {
    step: '01',
    name: 'FIND',
    tagline: 'Understand & locate',
  },
  {
    step: '02',
    name: 'FIX',
    tagline: 'Plan, modify & test',
  },
  {
    step: '03',
    name: 'VERIFY',
    tagline: 'Confirm evidence',
  },
];

export function LoopPipeline({ activeStage, onSelectStage }: LoopPipelineProps) {
  // Connector fill width: 0% at stage 0, 50% at stage 1, 100% at stage 2
  const progressPercent = activeStage === 0 ? 0 : activeStage === 1 ? 50 : 100;

  return (
    <div className={styles.pipelineWrapper} role="tablist" aria-label="Engineering Loop stages">
      {/* Horizontal connector line behind the nodes */}
      <div className={styles.pipelineRail} aria-hidden="true">
        <div
          className={styles.pipelineProgress}
          style={{ width: `${progressPercent}%` }}
        />
        {/* Central moving agent signal traveling along active segment */}
        <div
          className={`${styles.agentSignal} ${styles[`signal_stage_${activeStage}`]}`}
        />
      </div>

      {/* 3 Pipeline Nodes */}
      <div className={styles.pipelineNodes}>
        {STAGES.map((stage, idx) => {
          const isActive = activeStage === idx;
          const isComplete = activeStage > idx;

          return (
            <button
              key={stage.name}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${stage.name.toLowerCase()}`}
              className={`${styles.nodeButton} ${isActive ? styles.nodeActive : ''} ${
                isComplete ? styles.nodeComplete : ''
              }`}
              onClick={() => onSelectStage(idx)}
            >
              <div className={styles.nodeCircle}>
                {isComplete ? (
                  <span className={styles.nodeCheck}>✓</span>
                ) : (
                  <span className={styles.nodeNumber}>{stage.step}</span>
                )}
                {isActive && <div className={styles.nodePulse} />}
              </div>

              <div className={styles.nodeText}>
                <span className={styles.nodeName}>{stage.name}</span>
                <span className={styles.nodeTagline}>{stage.tagline}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
