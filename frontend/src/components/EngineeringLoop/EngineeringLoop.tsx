import { useState, useEffect, useRef } from 'react';
import { Section } from '../Section/Section';
import { SectionHeading } from '../SectionHeading/SectionHeading';
import { LoopPipeline } from './LoopPipeline';
import { StagePanels } from './StagePanels';
import styles from './EngineeringLoop.module.css';

export function EngineeringLoop() {
  const [activeStage, setActiveStage] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  // Scroll observer to trigger activation only when section is in viewport
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

  // Calm, progressive pipeline advancement (FIND -> FIX -> VERIFY)
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    // If user has manually clicked/hovered, respect their selection for a longer period
    const intervalTime = userInteracted ? 8000 : 4500;

    const timer = setInterval(() => {
      if (isVisibleRef.current) {
        setActiveStage((prev) => (prev + 1) % 3);
        setUserInteracted(false);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [userInteracted]);

  const handleSelectStage = (stage: number) => {
    setActiveStage(stage);
    setUserInteracted(true);
  };

  const handleHoverStage = (stage: number) => {
    // Subtle hover focus without breaking manual control
    setActiveStage(stage);
    setUserInteracted(true);
  };

  return (
    <Section id="loop" animate spacing="spacious" bordered>
      <div ref={containerRef} className={styles.container}>
        {/* Subtle technical background grid */}
        <div className={styles.loopBackground} aria-hidden="true" />

        {/* Section Header Row + Agent Status */}
        <div className={styles.sectionHeaderRow}>
          <SectionHeading
            label="THE ENGINEERING LOOP"
            title={
              <>
                One Issue.
                <br />
                One Autonomous Loop.
              </>
            }
            subtitle={
              <>
                <span>
                  CaffiPilot turns a software-engineering issue into a verified code
                  change through a continuous workflow.
                </span>
                <span className={styles.subtleLead}>
                  One issue enters. One verified change leaves.
                </span>
              </>
            }
          />

          {/* Restrained Agent Status Indicator */}
          <div className={styles.agentStatusBadge}>
            <div className={styles.agentStatusDot} />
            <div className={styles.agentStatusContent}>
              <span className={styles.agentStatusTitle}>AGENT READY</span>
              <span className={styles.agentStatusDesc}>
                Continuously analyzes, fixes, tests and verifies.
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Main Pipeline Track & Nodes */}
        <LoopPipeline
          activeStage={activeStage}
          onSelectStage={handleSelectStage}
        />

        {/* 3 Technical Mini-Panels (FIND | FIX | VERIFY) */}
        <StagePanels
          activeStage={activeStage}
          onHoverStage={handleHoverStage}
        />
      </div>
    </Section>
  );
}
