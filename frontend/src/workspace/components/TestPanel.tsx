import { useState } from 'react';
import type { TestSuite } from '../types';
import styles from './ActiveRunView.module.css';

interface TestPanelProps {
  testSuites: TestSuite[];
}

export function TestPanel({ testSuites }: TestPanelProps) {
  const [expandedSuites, setExpandedSuites] = useState<Set<string>>(new Set(['targeted']));

  const toggleExpand = (id: string) => {
    setExpandedSuites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  if (!testSuites || testSuites.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
          Waiting for test execution
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Test suites will execute automatically during TEST and VERIFY phases.
        </div>
      </div>
    );
  }

  const targetedSuite = testSuites.find((s) => s.id === 'targeted');
  const fullSuite = testSuites.find((s) => s.id === 'full');
  const lintSuite = testSuites.find((s) => s.id === 'lint');
  const buildSuite = testSuites.find((s) => s.id === 'build');

  return (
    <div className={styles.testsContainer}>
      {/* Top Tests Metric Summary Bar (Section 6) */}
      <div className={styles.testsSummaryBar}>
        <div className={styles.testMetricCard}>
          <span className={styles.testMetricLabel}>Targeted Tests</span>
          <span
            className={styles.testMetricValue}
            style={{
              color:
                targetedSuite?.status === 'passed'
                  ? 'var(--color-success)'
                  : targetedSuite?.status === 'failed'
                    ? 'var(--color-danger)'
                    : targetedSuite?.status === 'running'
                      ? 'var(--color-accent)'
                      : 'var(--color-text-muted)',
            }}
          >
            {targetedSuite?.status === 'passed'
              ? `${targetedSuite.passed} / ${targetedSuite.total} passed`
              : targetedSuite?.status === 'failed'
                ? `${targetedSuite.failed} failed, ${targetedSuite.passed} passed`
                : targetedSuite?.status === 'running'
                  ? 'Running...'
                  : 'Queued'}
          </span>
        </div>

        <div className={styles.testMetricCard}>
          <span className={styles.testMetricLabel}>Full Test Suite</span>
          <span
            className={styles.testMetricValue}
            style={{
              color:
                fullSuite?.status === 'passed'
                  ? 'var(--color-success)'
                  : fullSuite?.status === 'running'
                    ? 'var(--color-accent)'
                    : 'var(--color-text-muted)',
            }}
          >
            {fullSuite?.status === 'passed'
              ? `${fullSuite.passed} / ${fullSuite.total} passed`
              : fullSuite?.status === 'running'
                ? 'Running...'
                : 'Queued'}
          </span>
        </div>

        <div className={styles.testMetricCard}>
          <span className={styles.testMetricLabel}>Lint</span>
          <span
            className={styles.testMetricValue}
            style={{
              color:
                lintSuite?.status === 'passed'
                  ? 'var(--color-success)'
                  : lintSuite?.status === 'running'
                    ? 'var(--color-accent)'
                    : 'var(--color-text-muted)',
            }}
          >
            {lintSuite?.status === 'passed'
              ? 'Passed'
              : lintSuite?.status === 'running'
                ? 'Checking...'
                : 'Queued'}
          </span>
        </div>

        <div className={styles.testMetricCard}>
          <span className={styles.testMetricLabel}>Build</span>
          <span
            className={styles.testMetricValue}
            style={{
              color:
                buildSuite?.status === 'passed'
                  ? 'var(--color-success)'
                  : buildSuite?.status === 'running'
                    ? 'var(--color-accent)'
                    : 'var(--color-text-muted)',
            }}
          >
            {buildSuite?.status === 'passed'
              ? 'Passed'
              : buildSuite?.status === 'running'
                ? 'Compiling...'
                : 'Queued'}
          </span>
        </div>
      </div>

      {/* Structured Test Suites List */}
      <div className={styles.testSuitesList}>
        {testSuites.map((suite) => {
          const isExpanded = expandedSuites.has(suite.id);

          const icon =
            suite.status === 'passed' ? (
              <span className={styles.suiteIconPassed}>✓</span>
            ) : suite.status === 'failed' ? (
              <span className={styles.suiteIconFailed}>✕</span>
            ) : suite.status === 'running' ? (
              <span className={styles.suiteIconRunning}>●</span>
            ) : (
              <span className={styles.suiteIconQueued}>○</span>
            );

          const badgeClass =
            suite.status === 'passed'
              ? styles.suiteBadgePassed
              : suite.status === 'failed'
                ? styles.suiteBadgeFailed
                : suite.status === 'running'
                  ? styles.suiteBadgeRunning
                  : styles.suiteBadgeQueued;

          const badgeText =
            suite.status === 'passed'
              ? `${suite.passed} / ${suite.total} passed`
              : suite.status === 'failed'
                ? `${suite.failed} failed`
                : suite.status === 'running'
                  ? 'Running...'
                  : 'Queued';

          return (
            <div key={suite.id} className={styles.testSuiteCard}>
              <div
                className={styles.testSuiteHeader}
                onClick={() => toggleExpand(suite.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleExpand(suite.id);
                  }
                }}
                aria-expanded={isExpanded}
              >
                <div className={styles.suiteInfo}>
                  {icon}
                  <div>
                    <div className={styles.suiteName}>{suite.name}</div>
                    <div className={styles.suiteCommand}>{suite.command}</div>
                  </div>
                </div>

                <div className={styles.suiteRight}>
                  {suite.duration && suite.duration !== '--' && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {suite.duration}
                    </span>
                  )}
                  <span className={`${styles.suiteBadge} ${badgeClass}`}>{badgeText}</span>
                  <span style={{ fontSize: 10, color: 'var(--color-text-muted)' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>
              </div>

              {/* Expandable Suite Details: Cases & Failure Breakdown */}
              {isExpanded && (
                <div className={styles.suiteBody}>
                  {suite.cases && suite.cases.length > 0 && (
                    <div className={styles.casesList}>
                      {suite.cases.map((c) => {
                        const isFailed = c.status === 'failed';
                        const isPassed = c.status === 'passed';

                        return (
                          <div key={c.id}>
                            <div
                              className={`${styles.caseRow} ${
                                isFailed ? styles.caseRowFailed : ''
                              }`}
                            >
                              <div className={styles.caseLeft}>
                                <span
                                  className={
                                    isPassed
                                      ? styles.casePassedIcon
                                      : isFailed
                                        ? styles.caseFailedIcon
                                        : styles.caseQueuedIcon
                                  }
                                >
                                  {isPassed ? '✓' : isFailed ? '✕' : '○'}
                                </span>
                                <span>{c.name}</span>
                              </div>

                              <div style={{ color: 'var(--color-text-muted)' }}>
                                {c.duration ?? ''}
                              </div>
                            </div>

                            {/* Section 8: Failure Presentation */}
                            {isFailed && c.error && (
                              <div className={styles.failureBox}>
                                <div className={styles.failureHeader}>
                                  <span>✕ Assertion Failure</span>
                                </div>
                                <div className={styles.failureGrid}>
                                  <span className={styles.failureKey}>Expected:</span>
                                  <span className={styles.failureValueExpected}>
                                    {c.error.expected}
                                  </span>

                                  <span className={styles.failureKey}>Received:</span>
                                  <span className={styles.failureValueReceived}>
                                    {c.error.received}
                                  </span>

                                  <span className={styles.failureKey}>File:</span>
                                  <span>{c.error.file}</span>

                                  <span className={styles.failureKey}>Line:</span>
                                  <span>{c.error.line}</span>
                                </div>
                                <div
                                  style={{
                                    marginTop: 4,
                                    color: 'var(--color-text-secondary)',
                                    fontSize: 10,
                                  }}
                                >
                                  {c.error.message}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Execution Output Log */}
                  {suite.output && suite.output.length > 0 && (
                    <div className={styles.suiteOutput}>
                      {suite.output.map((line, idx) => (
                        <div key={idx}>{line}</div>
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
  );
}
