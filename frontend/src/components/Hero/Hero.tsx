import { Button } from '../Button/Button';
import { HeroPreview } from '../HeroPreview/HeroPreview';
import { GridBackground } from '../GridBackground/GridBackground';
import { TypewriterHeadline } from '../TypewriterHeadline/TypewriterHeadline';
import styles from './Hero.module.css';

interface HeroProps {
  onGetStarted?: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <GridBackground
      as="section"
      variant="hero"
      glow
      glowPosition="right"
      className={styles.hero}
    >
      <div className={styles.heroInner}>
        {/* --- LEFT: Content --------------------------------- */}
        <div className={styles.heroContent}>
          <div className={`${styles.eyebrow} ${styles.entranceEyebrow}`}>
            <span className={styles.eyebrowDot} />
            CAFFIPILOT
          </div>

          <TypewriterHeadline className={styles.entranceHeadline} />

          <p className={`${styles.description} ${styles.entranceDesc}`}>
            CaffiPilot autonomously understands software issues, explores
            repositories, modifies code, runs tests, recovers from failures,
            and verifies the result.
          </p>

          <div className={`${styles.cta} ${styles.entranceCTA}`}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (onGetStarted) onGetStarted();
                else window.location.hash = 'cta';
              }}
            >
              Get Started <span className={styles.ctaArrow}>→</span>
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => (window.location.hash = 'workflow')}
            >
              <span className={styles.playIcon} aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
                </svg>
              </span>
              View Demo
            </Button>
          </div>

          <div className={`${styles.meta} ${styles.entranceMeta}`}>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} />
              Repository-aware
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} />
              Autonomous
            </span>
            <span className={styles.metaItem}>
              <span className={styles.metaDot} />
              Verified
            </span>
          </div>
        </div>

        {/* --- RIGHT: Animated Preview ----------------------- */}
        <div className={`${styles.heroPreviewWrap} ${styles.entrancePreview}`}>
          <HeroPreview />
        </div>
      </div>
    </GridBackground>
  );
}
