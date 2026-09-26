import { useEffect, useRef, useState } from 'react';
import type { RunEvent } from '../types';
import styles from './ActiveRunView.module.css';

interface AgentActivityFeedProps {
  events: RunEvent[];
  onViewTests?: () => void;
  onViewDiff?: () => void;
}

export function AgentActivityFeed({
  events,
  onViewTests,
  onViewDiff,
}: AgentActivityFeedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef(false);
  const [expandedDetails, setExpandedDetails] = useState<Set<string>>(new Set());

  // Detect user manual scroll away from bottom
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 40;
    isUserScrolledUp.current = !isAtBottom;
  };

  // Auto-scroll to bottom only if user hasn't scrolled up
  useEffect(() => {
    if (!isUserScrolledUp.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events]);

  const toggleDetails = (id: string) => {
    setExpandedDetails((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={styles.activityContainer}
    >
      {events.map((evt) => {
        const isFailure = evt.type === 'failure';
        const isEdit = evt.type === 'edit';
        const hasDetails = Boolean(evt.details);
        const isExpanded = expandedDetails.has(evt.id);

        const iconClass =
          evt.icon === '✓'
            ? styles.activityIconCheck
            : evt.icon === '✕'
              ? styles.activityIconFail
              : styles.activityIconArrow;

        return (
          <div
            key={evt.id}
            className={`${styles.activityRow} ${isFailure ? styles.activityRowFailure : ''}`}
          >
            <div className={styles.activityMain}>
              <div className={styles.activityLeft}>
                <span className={iconClass}>{evt.icon}</span>
                <span className={styles.activityTime}>{evt.timestamp}</span>
                <span className={styles.activityText}>{evt.message}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {isFailure && onViewTests && (
                  <button
                    type="button"
                    className={styles.copyButton}
                    style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: 'var(--color-danger)' }}
                    onClick={onViewTests}
                  >
                    View Tests →
                  </button>
                )}

                {isEdit && onViewDiff && (
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={onViewDiff}
                  >
                    View Diff →
                  </button>
                )}

                {hasDetails && (
                  <button
                    type="button"
                    className={styles.activityDetailsToggle}
                    onClick={() => toggleDetails(evt.id)}
                    title={isExpanded ? 'Hide details' : 'Show details'}
                  >
                    {isExpanded ? '▲ Hide' : '▼ Details'}
                  </button>
                )}
              </div>
            </div>

            {hasDetails && isExpanded && (
              <div className={styles.activityDetailsBox}>{evt.details}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
