import styles from './EngineeringLoop.module.css';

interface StagePanelsProps {
  activeStage: number;
  onHoverStage?: (stage: number) => void;
}

export function StagePanels({ activeStage, onHoverStage }: StagePanelsProps) {
  return (
    <div className={styles.panelsGrid}>
      {/* ============================================================
          STAGE 1: FIND MINI-PANEL
          ============================================================ */}
      <div
        id="panel-find"
        role="tabpanel"
        className={`${styles.miniPanel} ${
          activeStage === 0
            ? styles.panelActive
            : activeStage > 0
              ? styles.panelComplete
              : styles.panelInactive
        }`}
        onMouseEnter={() => onHoverStage && onHoverStage(0)}
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelStageTag}>
            <span className={styles.tagStep}>01</span>
            <span className={styles.tagName}>FIND</span>
          </div>
          <span className={styles.panelCategory}>EXPLORATION</span>
        </div>

        <p className={styles.panelDescription}>
          Understand the issue and locate relevant code.
        </p>

        {/* Technical Mini-Interface */}
        <div className={styles.panelWindow}>
          <div className={styles.panelWindowBar}>
            <div className={styles.issueTag}>
              <span className={styles.issueHash}>#412</span>
              <span className={styles.issueTitle}>Fix duplicate cart items</span>
            </div>
            <span className={styles.windowTag}>ISSUE</span>
          </div>

          <div className={styles.fileTreeBox}>
            <div className={styles.fileTreeLine}>
              <span className={styles.treeIcon}>📁</span> ecommerce-app
            </div>
            <div className={`${styles.fileTreeLine} ${styles.treeIndent1}`}>
              <span className={styles.treeBranch}>└─</span>
              <span className={styles.treeFolder}>src</span>
            </div>
            <div className={`${styles.fileTreeLine} ${styles.treeIndent2}`}>
              <span className={styles.treeBranch}>└─</span>
              <span className={styles.treeFolder}>cart</span>
            </div>
            <div className={`${styles.fileTreeLine} ${styles.treeIndent3} ${styles.fileHighlight}`}>
              <span className={styles.treeBranch}>└─</span>
              <span className={styles.treeFile}>cartService.ts</span>
              <span className={styles.matchBadge}>MATCH</span>
            </div>
          </div>

          <div className={styles.activityFeed}>
            <div className={styles.feedItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Reading issue</span>
              <span className={styles.feedMeta}>0.4s</span>
            </div>
            <div className={styles.feedItem}>
              <span className={styles.checkIcon}>✓</span>
              <span>Exploring repository</span>
              <span className={styles.feedMeta}>42 files</span>
            </div>
            <div className={`${styles.feedItem} ${styles.activeFeedItem}`}>
              <span className={styles.arrowIcon}>→</span>
              <span>Finding relevant files...</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          STAGE 2: FIX MINI-PANEL
          ============================================================ */}
      <div
        id="panel-fix"
        role="tabpanel"
        className={`${styles.miniPanel} ${
          activeStage === 1
            ? styles.panelActive
            : activeStage > 1
              ? styles.panelComplete
              : styles.panelInactive
        }`}
        onMouseEnter={() => onHoverStage && onHoverStage(1)}
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelStageTag}>
            <span className={styles.tagStep}>02</span>
            <span className={styles.tagName}>FIX</span>
          </div>
          <span className={styles.panelCategory}>EXECUTION</span>
        </div>

        <p className={styles.panelDescription}>
          Plan, modify, test and recover.
        </p>

        {/* Technical Mini-Interface */}
        <div className={styles.panelWindow}>
          <div className={styles.panelWindowBar}>
            <div className={styles.planTitle}>
              <span className={styles.planIcon}>📋</span> Implementation Plan
            </div>
            <span className={styles.windowTag}>PLAN</span>
          </div>

          <div className={styles.planSteps}>
            <div className={styles.planStep}>
              <span className={styles.planStepNum}>01</span>
              <span>Inspect cart insertion logic</span>
            </div>
            <div className={styles.planStep}>
              <span className={styles.planStepNum}>02</span>
              <span>Modify cart behavior</span>
            </div>
            <div className={styles.planStep}>
              <span className={styles.planStepNum}>03</span>
              <span>Add regression test</span>
            </div>
          </div>

          {/* Tiny Code Diff Fragment */}
          <div className={styles.diffBox}>
            <div className={styles.diffHeader}>
              <span className={styles.diffFilename}>src/cart/cartService.ts</span>
              <span className={styles.diffStat}>+14 / -8</span>
            </div>
            <div className={styles.diffLineDel}>
              <span className={styles.diffPrefix}>-</span>
              <span>duplicate item added</span>
            </div>
            <div className={styles.diffLineAdd}>
              <span className={styles.diffPrefix}>+</span>
              <span>existing item quantity incremented</span>
            </div>
          </div>

          <div className={styles.activityFeed}>
            <div className={`${styles.feedItem} ${styles.activeFeedItem}`}>
              <span className={styles.arrowIcon}>→</span>
              <span>Running targeted tests...</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          STAGE 3: VERIFY MINI-PANEL
          ============================================================ */}
      <div
        id="panel-verify"
        role="tabpanel"
        className={`${styles.miniPanel} ${
          activeStage === 2
            ? styles.panelActive
            : styles.panelInactive
        }`}
        onMouseEnter={() => onHoverStage && onHoverStage(2)}
      >
        <div className={styles.panelHeader}>
          <div className={styles.panelStageTag}>
            <span className={styles.tagStep}>03</span>
            <span className={styles.tagName}>VERIFY</span>
          </div>
          <span className={styles.panelCategory}>VALIDATION</span>
        </div>

        <p className={styles.panelDescription}>
          Collect evidence and confirm the result.
        </p>

        {/* Technical Mini-Interface */}
        <div className={styles.panelWindow}>
          <div className={styles.panelWindowBar}>
            <div className={styles.verifyTitle}>
              <span className={styles.verifyIcon}>🛡️</span> Evidence Checklist
            </div>
            <span className={styles.windowTag}>PROOF</span>
          </div>

          <div className={styles.verifyList}>
            <div className={styles.verifyItem}>
              <span className={styles.checkIconGreen}>✓</span>
              <span className={styles.verifyItemLabel}>Targeted Tests</span>
              <span className={styles.verifyItemStatus}>PASS (12/12)</span>
            </div>
            <div className={styles.verifyItem}>
              <span className={styles.checkIconGreen}>✓</span>
              <span className={styles.verifyItemLabel}>Full Test Suite</span>
              <span className={styles.verifyItemStatus}>PASS (47/47)</span>
            </div>
            <div className={styles.verifyItem}>
              <span className={styles.checkIconGreen}>✓</span>
              <span className={styles.verifyItemLabel}>Lint & Types</span>
              <span className={styles.verifyItemStatus}>CLEAN</span>
            </div>
            <div className={styles.verifyItem}>
              <span className={styles.checkIconGreen}>✓</span>
              <span className={styles.verifyItemLabel}>Build Check</span>
              <span className={styles.verifyItemStatus}>0 ERRORS</span>
            </div>
            <div className={styles.verifyItem}>
              <span className={styles.checkIconGreen}>✓</span>
              <span className={styles.verifyItemLabel}>Final Diff</span>
              <span className={styles.verifyItemStatus}>VALIDATED</span>
            </div>
          </div>

          {/* Restrained VERIFIED Proof Badge */}
          <div className={`${styles.verifiedBadge} ${activeStage === 2 ? styles.verifiedActive : ''}`}>
            <span className={styles.verifiedDot} />
            <span className={styles.verifiedText}>VERIFIED</span>
            <span className={styles.verifiedSep}>•</span>
            <span className={styles.verifiedNote}>Proof Bundle Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}
