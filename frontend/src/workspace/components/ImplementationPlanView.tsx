import { useState } from 'react';
import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import type { ImplementationPlanData, PlanStep } from '../types';
import styles from './ImplementationPlanView.module.css';

interface ImplementationPlanViewProps {
  plan: ImplementationPlanData;
  onBack: () => void;
  onReject: () => void;
  onApprove: () => void;
}

export function ImplementationPlanView({
  plan,
  onBack,
  onReject,
  onApprove,
}: ImplementationPlanViewProps) {
  // Steps state to allow expand/collapse and removal
  const [steps, setSteps] = useState<PlanStep[]>(plan.steps);
  // Default first 3 expanded, others collapsed for clean overview
  const [expandedStepNumbers, setExpandedStepNumbers] = useState<Set<string>>(
    new Set(['01', '02', '04'])
  );

  // Reject modal state
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Approval state
  const [isApproving, setIsApproving] = useState(false);

  const toggleStep = (number: string) => {
    setExpandedStepNumbers((prev) => {
      const next = new Set(prev);
      if (next.has(number)) {
        next.delete(number);
      } else {
        next.add(number);
      }
      return next;
    });
  };

  const handleRemoveStep = (e: React.MouseEvent, number: string) => {
    e.stopPropagation();
    setSteps((prev) => prev.filter((s) => s.number !== number));
  };

  const handleApproveClick = () => {
    setIsApproving(true);
    setTimeout(() => {
      onApprove();
    }, 1100);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.eyebrow}>Implementation Plan</div>
          <h1 className={styles.title}>
            {plan.issueNumber} — {plan.title}
          </h1>
          <span className={styles.metaInfo}>
            {plan.repo} / {plan.branch}
          </span>
        </div>

        <Badge variant="info">Plan ready for review</Badge>
      </div>

      {/* Plan Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryColumn}>
          <span className={styles.summaryLabel}>Objective</span>
          <p className={styles.summaryText}>{plan.objective}</p>
        </div>
        <div className={styles.summaryColumn}>
          <span className={styles.summaryLabel}>Expected Behavior</span>
          <p className={styles.summaryText}>{plan.expectedBehavior}</p>
        </div>
      </div>

      {/* Plan Main Grid: Timeline + Relevant Files */}
      <div className={styles.planGrid}>
        {/* Timeline Column */}
        <div className={styles.timelineSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Engineering Execution Plan</span>
            <span className={styles.stepsCount}>{steps.length} Proposed Steps</span>
          </div>

          <div className={styles.timelineList}>
            {steps.map((step) => {
              const isExpanded = expandedStepNumbers.has(step.number);

              return (
                <div key={step.number} className={styles.stepCard}>
                  <div
                    className={styles.stepHeader}
                    onClick={() => toggleStep(step.number)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleStep(step.number);
                      }
                    }}
                    aria-expanded={isExpanded}
                  >
                    <div className={styles.stepLeft}>
                      <span className={styles.stepNumber}>{step.number}</span>
                      <span className={styles.stepTitle}>{step.title}</span>
                    </div>

                    <div className={styles.stepRight}>
                      <span className={styles.stepStatusBadge}>{step.status}</span>
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={(e) => handleRemoveStep(e, step.number)}
                        title="Remove step from plan"
                        aria-label={`Remove step ${step.number}`}
                      >
                        ✕
                      </button>
                      <span
                        className={`${styles.expandIcon} ${isExpanded ? styles.expandIconOpen : ''}`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className={styles.stepBody}>
                      <p className={styles.stepDescription}>{step.description}</p>
                      {step.files && step.files.length > 0 && (
                        <div className={styles.stepFiles}>
                          {step.files.map((file) => (
                            <span key={file} className={styles.fileChip}>
                              {file}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Relevant Files Sidebar */}
        <div className={styles.relevantFilesSidebar}>
          <div className={styles.sectionTitle}>Relevant Files</div>
          <div className={styles.filesList}>
            {plan.relevantFiles.map((file) => (
              <div key={file.path} className={styles.fileCard}>
                <span className={styles.filePath}>{file.path}</span>
                <span className={styles.fileRole}>{file.role}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Approval In-Progress Feedback Banner */}
      {isApproving && (
        <div className={styles.approvalBanner}>
          <div className={styles.approvalLeft}>
            <div className={styles.approvalCheck}>✓</div>
            <div className={styles.approvalText}>
              <span className={styles.approvalHeadline}>Plan approved.</span>
              <span className={styles.approvalSubtext}>Starting CaffiPilot agent...</span>
            </div>
          </div>
          <div className={styles.spinner} />
        </div>
      )}

      {/* Actions */}
      <div className={styles.actionsBar}>
        <Button variant="ghost" size="md" onClick={onBack} disabled={isApproving}>
          ← Back to Analysis
        </Button>

        <div className={styles.actionsRight}>
          <Button
            variant="destructive"
            size="md"
            onClick={() => setShowRejectModal(true)}
            disabled={isApproving}
          >
            Reject
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleApproveClick}
            disabled={isApproving}
          >
            {isApproving ? 'Starting Agent...' : 'Approve & Run'}
          </Button>
        </div>
      </div>

      {/* Reject Confirmation Dialog */}
      {showRejectModal && (
        <div className={styles.modalBackdrop} onClick={() => setShowRejectModal(false)}>
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="reject-title"
          >
            <h2 id="reject-title" className={styles.modalTitle}>
              Reject implementation plan?
            </h2>
            <p className={styles.modalDescription}>
              You can return to issue analysis and revise the task requirements or exploration
              parameters.
            </p>

            <div className={styles.modalActions}>
              <Button
                variant="ghost"
                size="md"
                onClick={() => setShowRejectModal(false)}
              >
                Keep Reviewing
              </Button>
              <Button
                variant="destructive"
                size="md"
                onClick={() => {
                  setShowRejectModal(false);
                  onReject();
                }}
              >
                Return to Analysis
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
