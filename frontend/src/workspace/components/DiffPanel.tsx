import { useState } from 'react';
import type { DiffFile } from '../types';
import styles from './ActiveRunView.module.css';

interface DiffPanelProps {
  diffFiles: DiffFile[];
}

export function DiffPanel({ diffFiles }: DiffPanelProps) {
  const [selectedPath, setSelectedPath] = useState<string>(
    diffFiles.length > 0 ? diffFiles[0].path : ''
  );
  const [copied, setCopied] = useState(false);
  const [collapsedHunks, setCollapsedHunks] = useState<Set<number>>(new Set());

  if (!diffFiles || diffFiles.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>
          No changes yet
        </div>
        <div style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
          Files modified by CaffiPilot during FIX and RECOVERY phases will appear here.
        </div>
      </div>
    );
  }

  // Active file
  const activeFile = diffFiles.find((f) => f.path === selectedPath) || diffFiles[0];

  const totalAdditions = diffFiles.reduce((sum, f) => sum + f.additions, 0);
  const totalDeletions = diffFiles.reduce((sum, f) => sum + f.deletions, 0);

  const handleCopyPath = (path: string) => {
    navigator.clipboard?.writeText?.(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const toggleHunk = (hunkIdx: number) => {
    setCollapsedHunks((prev) => {
      const next = new Set(prev);
      if (next.has(hunkIdx)) {
        next.delete(hunkIdx);
      } else {
        next.add(hunkIdx);
      }
      return next;
    });
  };

  return (
    <div className={styles.diffContainer}>
      {/* Top Summary Bar */}
      <div className={styles.diffSummaryBar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>
            Changes
          </span>
          <span style={{ color: 'var(--color-text-muted)' }}>
            {diffFiles.length} {diffFiles.length === 1 ? 'file' : 'files'} changed
          </span>
        </div>

        <div className={styles.diffStat}>
          <span className={styles.statAdd}>+{totalAdditions} additions</span>
          <span className={styles.statDel}>-{totalDeletions} deletions</span>
        </div>
      </div>

      {/* Two-Column Diff Layout: Left File List + Center Diff Viewer */}
      <div className={styles.diffWorkspaceGrid}>
        {/* Left File List */}
        <aside className={styles.diffFileList}>
          <div className={styles.diffFileListHeader}>Files</div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {diffFiles.map((file) => {
              const isActive = file.path === activeFile.path;

              return (
                <button
                  key={file.path}
                  type="button"
                  className={`${styles.diffFileItem} ${isActive ? styles.active : ''}`}
                  onClick={() => setSelectedPath(file.path)}
                >
                  <div className={styles.diffFileLeft}>
                    <span
                      className={
                        file.status === 'added' ? styles.statusIconA : styles.statusIconM
                      }
                    >
                      {file.status === 'added' ? 'A' : 'M'}
                    </span>
                    <span className={styles.diffFilePath} title={file.path}>
                      {file.path}
                    </span>
                  </div>

                  <div className={styles.diffFileStats}>
                    <span className={styles.statAdd}>+{file.additions}</span>
                    {file.deletions > 0 && (
                      <span className={styles.statDel}>-{file.deletions}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Unified Diff Viewer */}
        <main className={styles.diffViewer}>
          <div className={styles.diffViewerHeader}>
            <div className={styles.diffViewerTitle}>
              <span
                className={
                  activeFile.status === 'added' ? styles.statusIconA : styles.statusIconM
                }
              >
                {activeFile.status === 'added' ? 'A' : 'M'}
              </span>
              <span>{activeFile.path}</span>
            </div>

            <div className={styles.diffViewerActions}>
              <span className={styles.statAdd}>+{activeFile.additions}</span>
              {activeFile.deletions > 0 && (
                <span className={styles.statDel}>-{activeFile.deletions}</span>
              )}

              <button
                type="button"
                className={styles.copyButton}
                onClick={() => handleCopyPath(activeFile.path)}
                title="Copy relative file path"
              >
                {copied ? '✓ Copied' : 'Copy path'}
              </button>
            </div>
          </div>

          <div className={styles.diffContentScroll}>
            {activeFile.hunks.map((hunk, hunkIdx) => {
              const isCollapsed = collapsedHunks.has(hunkIdx);

              return (
                <div key={hunkIdx} className={styles.hunkBlock}>
                  {hunk.header && (
                    <div
                      className={styles.hunkHeader}
                      onClick={() => toggleHunk(hunkIdx)}
                      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span>{hunk.header}</span>
                      <span style={{ fontSize: 10, opacity: 0.7 }}>
                        {isCollapsed ? '▲ Expand' : '▼ Collapse'}
                      </span>
                    </div>
                  )}

                  {!isCollapsed && (
                    <div className={styles.diffLinesTable}>
                      {hunk.lines.map((line, lineIdx) => {
                        const rowClass =
                          line.type === 'addition'
                            ? styles.lineAdd
                            : line.type === 'deletion'
                              ? styles.lineDel
                              : styles.lineNormal;

                        return (
                          <div key={lineIdx} className={`${styles.diffLineRow} ${rowClass}`}>
                            <div className={styles.lineNum}>
                              {line.type !== 'addition' ? line.oldLine ?? '' : ''}
                            </div>
                            <div className={styles.lineNum}>
                              {line.type !== 'deletion' ? line.newLine ?? '' : ''}
                            </div>
                            <div className={styles.lineText}>{line.content}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
