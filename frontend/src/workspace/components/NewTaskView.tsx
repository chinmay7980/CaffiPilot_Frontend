import { useState, useEffect } from 'react';
import { Button } from '../../components/Button/Button';
import type { Repository, TaskState } from '../types';
import styles from './NewTaskView.module.css';

interface NewTaskViewProps {
  repositories: Repository[];
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  onAnalyzeTask: (taskState: TaskState) => void;
  onCancel: () => void;
}

const DEFAULT_EXAMPLE =
  'Fix the bug where users can add the same product multiple times to the cart.';

export function NewTaskView({
  repositories,
  selectedRepo,
  onSelectRepo,
  onAnalyzeTask,
  onCancel,
}: NewTaskViewProps) {
  const [taskText, setTaskText] = useState(DEFAULT_EXAMPLE);
  const [issueNum, setIssueNum] = useState('#412');
  const [branch, setBranch] = useState(selectedRepo.branch);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setBranch(selectedRepo.branch);
  }, [selectedRepo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRepo) {
      setValidationError('Please select a repository to proceed.');
      return;
    }
    if (!branch) {
      setValidationError('Please select a branch to proceed.');
      return;
    }
    if (!taskText.trim()) {
      setValidationError('Please provide a task description to proceed with analysis.');
      return;
    }
    setValidationError(null);

    onAnalyzeTask({
      repository: selectedRepo.name,
      branch,
      issueNumber: issueNum.trim() || undefined,
      title: 'Fix duplicate cart items',
      description: taskText.trim(),
      analysisStatus: 'analyzing',
      planStatus: 'idle',
      runStatus: 'idle',
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headingArea}>
        <h1 className={styles.title}>New Coding Task</h1>
        <p className={styles.subtitle}>
          Provide an issue description or paste an issue for autonomous repository exploration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={styles.formCard}>
        <div className={styles.fieldRow}>
          <div className={styles.fieldGroup}>
            <label htmlFor="repo-select" className={styles.label}>
              Repository
            </label>
            <select
              id="repo-select"
              className={styles.select}
              value={selectedRepo.id}
              onChange={(e) => {
                const found = repositories.find((r) => r.id === e.target.value);
                if (found) {
                  onSelectRepo(found);
                  setBranch(found.branch);
                }
              }}
            >
              {repositories.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} ({r.language})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="branch-select" className={styles.label}>
              Branch
            </label>
            <select
              id="branch-select"
              className={styles.select}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              {selectedRepo.branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="task-prompt" className={styles.label}>
              Issue / Task
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className={styles.label} style={{ opacity: 0.7 }}>
                Issue tag:
              </span>
              <input
                type="text"
                value={issueNum}
                onChange={(e) => setIssueNum(e.target.value)}
                placeholder="#412"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  padding: '2px 6px',
                  backgroundColor: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius)',
                  color: 'var(--color-text-primary)',
                  width: '64px',
                }}
              />
            </div>
          </div>

          <textarea
            id="task-prompt"
            className={styles.textarea}
            value={taskText}
            onChange={(e) => {
              setTaskText(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="Describe the issue or paste a GitHub issue..."
          />
          {validationError && (
            <div className={styles.validationError} role="alert">
              <span>⚠</span>
              <span>{validationError}</span>
            </div>
          )}
          <div className={styles.examplePrompt}>
            <span>Example:</span>
            <button
              type="button"
              className={styles.exampleButton}
              onClick={() => {
                setTaskText(DEFAULT_EXAMPLE);
                setIssueNum('#412');
                setValidationError(null);
              }}
            >
              Fix duplicate cart items on rapid clicks
            </button>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <Button variant="primary" size="md" type="submit">
            Analyze Issue
          </Button>
          <Button variant="ghost" size="md" type="button" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
