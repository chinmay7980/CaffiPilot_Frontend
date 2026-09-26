import { useEffect, useRef, useState } from 'react';
import { Section } from '../Section/Section';
import { Button } from '../Button/Button';
import styles from './FinalCTA.module.css';

interface FinalCTAProps {
  onGetStarted?: () => void;
}

export function FinalCTA({ onGetStarted }: FinalCTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <Section id="cta" surface spacing="compact" bordered className={styles.sectionWrap}>
      <div
        className={`${styles.container} ${isVisible ? styles.animatedIn : ''}`}
        ref={containerRef}
      >
        {/* Subtle grid pattern and focused central amber atmosphere */}
        <div className={styles.ctaPatternLayer} aria-hidden="true" />
        <div className={styles.ambientGlow} aria-hidden="true" />

        {/* Small Brand Eyebrow */}
        <div className={styles.eyebrow}>
          <span className={styles.eyebrowDot} aria-hidden="true" />
          CAFFIPILOT
        </div>

        {/* Primary Statement: Find. Fix. Verify. (Compact horizontal lockup) */}
        <h2 className={styles.heading}>
          <span className={styles.word}>Find.</span>{' '}
          <span className={styles.word}>Fix.</span>{' '}
          <span className={styles.wordAccent}>Verify.</span>
        </h2>

        {/* Single Supporting Line */}
        <p className={styles.description}>
          Turn a software-engineering issue into a verified patch.
        </p>

        {/* CTA Actions */}
        <div className={styles.actions}>
          <Button
            variant="primary"
            size="md"
            className={styles.primaryBtn}
            onClick={() => {
              if (onGetStarted) onGetStarted();
            }}
          >
            <span>Get Started</span>
            <span className={styles.btnArrow} aria-hidden="true">→</span>
          </Button>

          <Button
            variant="ghost"
            size="md"
            className={styles.secondaryBtn}
            onClick={() => {
              window.location.hash = 'workflow';
            }}
          >
            View Demo
          </Button>
        </div>
      </div>
    </Section>
  );
}
