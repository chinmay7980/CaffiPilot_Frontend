import { useState, useEffect } from 'react';
import { Button } from '../Button/Button';
import logoImg from '../../assets/caffipilot-logo.png';
import styles from './Nav.module.css';

interface NavProps {
  onGetStarted?: () => void;
}

export function Nav({ onGetStarted }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['loop', 'workflow', 'verification'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -60% 0px' }
    );

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
      <div className={styles.navInner}>
        <a
          href="/"
          className={styles.logo}
          aria-label="CaffiPilot home"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, '', '/');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src={logoImg}
            alt="CaffiPilot"
            className={styles.logoImage}
            width={149}
            height={32}
          />
        </a>

        <div className={styles.links}>
          <a
            href="#loop"
            className={`${styles.link} ${activeSection === 'loop' ? styles.active : ''}`}
          >
            The Loop
          </a>
          <a
            href="#workflow"
            className={`${styles.link} ${activeSection === 'workflow' ? styles.active : ''}`}
          >
            Workflow
          </a>
          <a
            href="#verification"
            className={`${styles.link} ${activeSection === 'verification' ? styles.active : ''}`}
          >
            Verification
          </a>
        </div>

        <div className={styles.actions}>
          <Button
            variant="ghost"
            size="sm"
            className={styles.btnGhost}
            onClick={() => (window.location.hash = 'workflow')}
          >
            View Demo
          </Button>
          <Button
            variant="primary"
            size="sm"
            className={styles.btnPrimary}
            onClick={() => {
              if (onGetStarted) onGetStarted();
              else window.location.hash = 'cta';
            }}
          >
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
