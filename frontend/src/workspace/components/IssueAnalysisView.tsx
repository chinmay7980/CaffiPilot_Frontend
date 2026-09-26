import { Button } from '../../components/Button/Button';
import { Badge } from '../../components/Badge/Badge';
import type { IssueAnalysisData } from '../types';
import styles from './IssueAnalysisView.module.css';

interface IssueAnalysisViewProps {
  analysis: IssueAnalysisData;
  onBack: () => void;
  onGeneratePlan: () => void;
}

export function IssueAnalysisView({
  analysis,
  onBack,
  onGeneratePlan,
}: IssueAnalysisViewProps) {

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleArea}>
          <div className={styles.eyebrow}>Issue Analysis</div>
          <h1 className={styles.title}>
            {analysis.issueNumber} — {analysis.title}
          </h1>
          <span className={styles.metaInfo}>
            {analysis.repo} &bull; {analysis.branch}
          </span>
        </div>

        <Badge variant="info">Analysis Complete</Badge>
      </div>

      {/* Two Column Analysis */}
      <div className={styles.analysisGrid}>
        {/* Left Side: Problem & Scope */}
        <div className={styles.panel}>
          <div className={styles.panelHeading}>Problem Definition</div>

          <div className={styles.itemBlock}>
            <span className={styles.itemLabel}>Problem</span>
            <p className={styles.itemValue}>{analysis.problem}</p>
          </div>

          <div className={styles.itemBlock}>
            <span className={styles.itemLabel}>Expected Behavior</span>
            <p className={styles.itemValue}>{analysis.expectedBehavior}</p>
          </div>

          <div className={styles.itemBlock}>
            <span className={styles.itemLabel}>Detected Area</span>
            <p className={styles.itemValue}>{analysis.detectedArea}</p>
          </div>
        </div>

        {/* Right Side: Relevant Context Files */}
        <div className={styles.panel}>
          <div className={styles.panelHeading}>Relevant Context</div>

          <div className={styles.filesList}>
            {analysis.relevantFiles.map((file) => {
              const relevanceClass =
                file.relevance === 'Highly relevant'
                  ? styles.highlyRelevant
                  : file.relevance === 'Relevant'
                    ? styles.relevant
                    : styles.related;

              return (
                <div key={file.path} className={styles.fileRow}>
                  <span className={styles.filePath}>{file.path}</span>
                  <span className={`${styles.relevanceBadge} ${relevanceClass}`}>
                    {file.relevance}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className={styles.summaryBox}>
        <span className={styles.summaryLabel}>Agent Understanding</span>
        <p className={styles.summaryText}>{analysis.understanding}</p>
      </div>

      {/* Context Flow Visual */}
      <div className={styles.contextFlow}>
        <span className={styles.flowItem}>Issue</span>
        <span className={styles.flowArrow}>→</span>
        <span className={styles.flowItem}>Cart Service</span>
        <span className={styles.flowArrow}>→</span>
        <span className={styles.flowItem}>Relevant Files</span>
        <span className={styles.flowArrow}>→</span>
        <span className={styles.flowItem}>Tests</span>
      </div>

      {/* Actions */}
      <div className={styles.actionsRow}>
        <Button variant="ghost" size="md" onClick={onBack}>
          ← Back
        </Button>

        <Button variant="primary" size="md" onClick={onGeneratePlan}>
          Generate Implementation Plan →
        </Button>
      </div>
    </div>
  );
}
