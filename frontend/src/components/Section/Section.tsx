import { type ReactNode, useEffect, useRef, useState } from 'react';
import styles from './Section.module.css';

interface SectionProps {
  id?: string;
  surface?: boolean;
  bordered?: boolean;
  spacing?: 'compact' | 'default' | 'spacious';
  animate?: boolean;
  className?: string;
  children: ReactNode;
}

export function Section({
  id,
  surface = false,
  bordered = false,
  spacing = 'default',
  animate = false,
  className = '',
  children,
}: SectionProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate || !ref.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  const cls = [
    styles.section,
    surface ? styles.surface : '',
    bordered ? styles.bordered : '',
    spacing !== 'default' ? styles[spacing] : '',
    animate ? styles.animated : '',
    visible ? styles.visible : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section ref={ref} id={id} className={cls}>
      <div className={styles.inner}>{children}</div>
    </section>
  );
}
