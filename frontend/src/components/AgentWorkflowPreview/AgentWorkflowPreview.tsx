import { useState, useEffect, useRef } from 'react';
import { Section } from '../Section/Section';
import { GridBackground } from '../GridBackground/GridBackground';
import { WORKFLOW_STAGES } from './workflowData';
import { WorkflowStepper } from './WorkflowStepper';
import { WorkflowCalloutsLeft, WorkflowCalloutsRight } from './WorkflowCallouts';
import { WorkflowPreviewWindow } from './WorkflowPreviewWindow';
import styles from './AgentWorkflowPreview.module.css';

export function AgentWorkflowPreview() {
  const [activeStage, setActiveStage] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const [highlightedTarget, setHighlightedTarget] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  // IntersectionObserver to activate progression when section enters viewport
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

  // Calm automatic progression through the 5 workflow stages
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const intervalTime = userInteracted ? 8000 : 3500;

    const timer = setInterval(() => {
      if (isVisibleRef.current) {
        setActiveStage((prev) => (prev + 1) % WORKFLOW_STAGES.length);
        setUserInteracted(false);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [userInteracted]);

  const handleSelectStage = (idx: number) => {
    setActiveStage(idx);
    setUserInteracted(true);
  };

  const currentStage = WORKFLOW_STAGES[activeStage];

  return (
    <Section id="workflow" animate surface spacing="spacious" bordered>
      <div className={styles.container} ref={containerRef}>
        {/* Section Header with "VISUAL WORKFLOW" eyebrow, amber "Work.", and AGENT READY badge */}
        <div className={styles.headerBlock}>
          <div className={styles.introWrap}>
            <div className={styles.eyebrow}>
              <span className={styles.eyebrowDot} aria-hidden="true" />
              VISUAL WORKFLOW
            </div>
            <h2 className={styles.heading}>
              Watch CaffiPilot <span className={styles.headingAccent}>Work.</span>
            </h2>
            <p className={styles.subtitle}>
              From repository exploration to verification, every step is visible.
            </p>
          </div>

          <div className={styles.agentReadyBadge} aria-label="Agent status indicator">
            <div className={styles.agentReadyPill}>
              <span className={styles.agentReadyPulse} aria-hidden="true" />
              <span className={styles.agentReadyTitle}>AGENT READY</span>
            </div>
            <span className={styles.agentReadySub}>
              Continuously analyzes, fixes, tests and verifies.
            </span>
          </div>
        </div>

        {/* 5-Stage Connected Conceptual Workflow Stepper */}
        <WorkflowStepper
          activeStage={activeStage}
          onSelectStage={handleSelectStage}
        />

        {/* Large Product Preview with Contextual Callouts and Connector Arrows */}
        <div className={styles.previewAreaWrap}>
          {/* Left Editorial Callouts (Pointing Right to Progress & Activity) */}
          <WorkflowCalloutsLeft onHover={setHighlightedTarget} />

          {/* Center Product Preview Centerpiece */}
          <div className={styles.previewCenter}>
            <div className={styles.amberAtmosphereGlow} aria-hidden="true" />
            <GridBackground
              variant="section"
              intensity="subtle"
              glow
              glowPosition="center"
              className={styles.previewGridBackdrop}
            />
            <WorkflowPreviewWindow
              stage={currentStage}
              highlightedTarget={highlightedTarget}
            />
          </div>

          {/* Right Editorial Callouts (Pointing Left to Repo Tree & Terminal) */}
          <WorkflowCalloutsRight onHover={setHighlightedTarget} />
        </div>
      </div>
    </Section>
  );
}
