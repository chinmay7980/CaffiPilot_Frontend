import { useState, useEffect, useRef } from 'react';
import { Section } from '../Section/Section';
import styles from './ContextStory.module.css';

type SearchMode = 'lexical' | 'semantic' | 'graph' | null;

interface RepositoryFile {
  name: string;
  indent: number;
  isFolder?: boolean;
  status?: 'primary' | 'secondary' | 'neutral';
  tag?: string;
}

const REPO_TREE: RepositoryFile[] = [
  { name: 'ecommerce-app', indent: 0, isFolder: true },
  { name: 'src', indent: 1, isFolder: true },
  { name: 'cart', indent: 2, isFolder: true },
  { name: 'cartService.ts', indent: 3, status: 'primary', tag: 'PRIMARY' },
  { name: 'cartController.ts', indent: 3, status: 'secondary', tag: 'CALLER' },
  { name: 'types.ts', indent: 3, status: 'neutral' },
  { name: 'auth', indent: 2, isFolder: true },
  { name: 'payments', indent: 2, isFolder: true },
  { name: 'tests', indent: 1, isFolder: true },
  { name: 'cart.test.ts', indent: 2, status: 'secondary', tag: 'REGRESSION' },
  { name: 'utils', indent: 1, isFolder: true },
];

const SEARCH_MODULES = [
  {
    id: 'lexical' as const,
    title: 'LEXICAL SEARCH',
    subtitle: 'Exact symbols',
    description: 'Traces mutateCart symbol calls, types, and imports in AST',
    matchedFiles: 8,
    metric: 'AST Match',
  },
  {
    id: 'semantic' as const,
    title: 'SEMANTIC SEARCH',
    subtitle: 'Intent overlap',
    description: 'Vector embeddings match "duplicate cart clicks" issue intent',
    matchedFiles: 5,
    metric: 'Intent 0.94',
  },
  {
    id: 'graph' as const,
    title: 'CODE GRAPH',
    subtitle: 'Relevant relationships',
    description: 'Traverses dependencies between dispatchers and state mutations',
    matchedFiles: 3,
    metric: 'Depth 2 Graph',
  },
];

export function ContextStory() {
  const [activeStage, setActiveStage] = useState<number>(1); // 0: Repo, 1: Search, 2: Relevant, 3: Focused, 4: Ready
  const [hoveredSearch, setHoveredSearch] = useState<SearchMode>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  // IntersectionObserver to only animate when visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.2 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Calm automatic cycle through the 5 pipeline stages (2.2s per stage)
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const intervalTime = userInteracted ? 6000 : 2200;

    const timer = setInterval(() => {
      if (isVisibleRef.current) {
        setActiveStage((prev) => (prev + 1) % 5);
        setUserInteracted(false);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [userInteracted]);

  const handleManualStageSelect = (idx: number) => {
    setActiveStage(idx);
    setUserInteracted(true);
  };

  return (
    <Section id="context" animate surface spacing="spacious" bordered>
      <div className={styles.sectionWrap} ref={containerRef}>
        {/* Subtle ambient amber atmospheric glow behind diagram */}
        <div className={styles.ambientAtmosphereGlow} aria-hidden="true" />
        <div className={styles.contextGridPattern} aria-hidden="true" />

        {/* Section Intro: Technical Eyebrow, Main Heading, Supporting Copy */}
        <div className={styles.introBlock}>
          <div className={styles.eyebrow}>
            <span className={styles.eyebrowDot} aria-hidden="true" />
            CONTEXT INTELLIGENCE
          </div>
          <h2 className={styles.heading}>
            Context is the <span className={styles.headingAccent}>advantage.</span>
          </h2>
          <p className={styles.description}>
            CaffiPilot does not need the entire repository in every model
            interaction. It identifies the most relevant code and builds focused
            context.
          </p>
        </div>

        {/* ============================================================
            CONNECTED CONTEXT PIPELINE
            Repository → Search Layers → Relevant Files → Focused Context → Ready
            ============================================================ */}
        <div className={styles.pipelineContainer}>
          {/* ────────────────────────────────────────────────────────
              STAGE 1: REPOSITORY INPUT (LARGE CODEBASE)
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.pipelineCard} ${styles.repoCard} ${
              activeStage === 0 ? styles.stageActive : ''
            }`}
            onClick={() => handleManualStageSelect(0)}
            role="button"
            tabIndex={0}
            aria-label="Repository input node"
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <span className={styles.nodeIcon}>◫</span>
                <span className={styles.nodeTitle}>REPOSITORY</span>
                <span className={styles.repoName}>ecommerce-app</span>
              </div>
              <div className={styles.cardHeaderRight}>
                <span className={styles.branchBadge}>⑂ main</span>
                <span className={styles.scopeBadge}>642 files</span>
              </div>
            </div>

            {/* Visual Data Reduction Indicator Bar (Full scale: 100%) */}
            <div className={styles.volumeMeterRow} aria-hidden="true">
              <span className={styles.volumeLabel}>FULL REPOSITORY VOLUME</span>
              <div className={styles.volumeTrack}>
                <div className={`${styles.volumeFill} ${styles.volumeFull}`} />
              </div>
            </div>

            {/* Minimal Repository Tree */}
            <div className={styles.repoTreeBox}>
              {REPO_TREE.map((item, idx) => (
                <div
                  key={`${item.name}-${idx}`}
                  className={`${styles.treeRow} ${
                    item.status === 'primary'
                      ? styles.treeRowPrimary
                      : item.status === 'secondary'
                        ? styles.treeRowSecondary
                        : ''
                  }`}
                  style={{ paddingLeft: `${item.indent * 14 + 10}px` }}
                >
                  <span className={styles.fileIcon} aria-hidden="true">
                    {item.isFolder ? '📁' : '📄'}
                  </span>
                  <span className={styles.fileName}>{item.name}</span>
                  {item.tag && (
                    <span
                      className={`${styles.fileTag} ${
                        item.status === 'primary' ? styles.tagPrimary : styles.tagSecondary
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Connector: From Repository to Search Layers */}
          <div className={styles.connectorPipe} aria-hidden="true">
            <div className={styles.verticalStem} />
            <div
              className={`${styles.signalPulse} ${
                activeStage >= 1 ? styles.signalMoving : ''
              }`}
            />
            <div className={styles.splitTrident}>
              <div className={styles.tridentArmLeft} />
              <div className={styles.tridentArmCenter} />
              <div className={styles.tridentArmRight} />
            </div>
          </div>

          {/* ────────────────────────────────────────────────────────
              STAGE 2: THREE SEARCH LAYERS (PROCESSING STAGES)
              Lexical Search | Semantic Search | Code Graph
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.searchRow} ${
              activeStage === 1 ? styles.stageActive : ''
            }`}
          >
            {SEARCH_MODULES.map((module) => {
              const isHovered = hoveredSearch === module.id;
              return (
                <div
                  key={module.id}
                  className={`${styles.searchModule} ${
                    isHovered ? styles.searchModuleHovered : ''
                  }`}
                  onMouseEnter={() => setHoveredSearch(module.id)}
                  onMouseLeave={() => setHoveredSearch(null)}
                  onClick={() => handleManualStageSelect(1)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${module.title}: ${module.subtitle}`}
                >
                  <div className={styles.searchModuleHeader}>
                    <span className={styles.searchModuleDot} />
                    <span className={styles.searchModuleTitle}>{module.title}</span>
                  </div>
                  <div className={styles.searchModuleSubtitle}>{module.subtitle}</div>
                  <p className={styles.searchModuleDesc}>{module.description}</p>
                  <div className={styles.searchModuleFooter}>
                    <span className={styles.searchModuleMetric}>{module.metric}</span>
                    <span className={styles.searchModuleCandidates}>
                      {module.matchedFiles} candidates
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Connector: From Search Layers converging to Relevant Files */}
          <div className={styles.connectorPipe} aria-hidden="true">
            <div className={styles.convergeTrident}>
              <div className={styles.tridentArmLeft} />
              <div className={styles.tridentArmCenter} />
              <div className={styles.tridentArmRight} />
            </div>
            <div className={styles.verticalStem} />
            <div
              className={`${styles.signalPulse} ${
                activeStage >= 2 ? styles.signalMoving : ''
              }`}
            />
          </div>

          {/* ────────────────────────────────────────────────────────
              STAGE 3: RELEVANT FILES (NARROWED CANDIDATES)
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.pipelineCard} ${styles.relevantCard} ${
              activeStage === 2 ? styles.stageActive : ''
            }`}
            onClick={() => handleManualStageSelect(2)}
            role="button"
            tabIndex={0}
            aria-label="Relevant files node"
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <span className={styles.checkIcon}>✓</span>
                <span className={styles.nodeTitle}>RELEVANT FILES</span>
              </div>
              <div className={styles.cardHeaderRight}>
                <span className={styles.selectedCountBadge}>3 files selected</span>
              </div>
            </div>

            {/* Visual Data Reduction Indicator Bar (Narrowed scale: ~35%) */}
            <div className={styles.volumeMeterRow} aria-hidden="true">
              <span className={styles.volumeLabel}>FILTERED CANDIDATE VOLUME</span>
              <div className={styles.volumeTrack}>
                <div className={`${styles.volumeFill} ${styles.volumeNarrow}`} />
              </div>
            </div>

            <div className={styles.relevantList}>
              <div className={styles.relevantItem}>
                <span className={styles.relevantCheck}>✓</span>
                <span className={styles.relevantPath}>src/cart/cartService.ts</span>
                <span className={styles.relevantScore}>relevance 0.94</span>
              </div>
              <div className={styles.relevantItem}>
                <span className={styles.relevantCheck}>✓</span>
                <span className={styles.relevantPath}>src/cart/cartController.ts</span>
                <span className={styles.relevantScore}>relevance 0.88</span>
              </div>
              <div className={styles.relevantItem}>
                <span className={styles.relevantCheck}>✓</span>
                <span className={styles.relevantPath}>tests/cart.test.ts</span>
                <span className={styles.relevantScore}>regression scope</span>
              </div>
            </div>
          </div>

          {/* Connector: From Relevant Files to Focused Context */}
          <div className={styles.connectorPipe} aria-hidden="true">
            <div className={styles.verticalStem} />
            <div
              className={`${styles.signalPulse} ${
                activeStage >= 3 ? styles.signalMoving : ''
              }`}
            />
          </div>

          {/* ────────────────────────────────────────────────────────
              STAGE 4: FOCUSED CONTEXT WINDOW (THE PAYOFF)
              Targeted code window + Key Editorial Insight
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.pipelineCard} ${styles.focusedCard} ${
              activeStage >= 3 ? styles.focusedCardActive : ''
            }`}
            onClick={() => handleManualStageSelect(3)}
            role="button"
            tabIndex={0}
            aria-label="Focused context window node"
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <span className={styles.amberSparkIcon}>⚡</span>
                <span className={styles.focusedTitle}>FOCUSED CONTEXT</span>
                <span className={styles.contextWindowBadge}>TARGETED CONTEXT WINDOW</span>
              </div>
              <div className={styles.cardHeaderRight}>
                <span className={styles.readyPill}>Bounded Context Ready</span>
              </div>
            </div>

            {/* Visual Data Reduction Indicator Bar (Focused scale: ~15%) */}
            <div className={styles.volumeMeterRow} aria-hidden="true">
              <span className={styles.volumeLabel}>FOCUSED CONTEXT SLICE</span>
              <div className={styles.volumeTrack}>
                <div className={`${styles.volumeFill} ${styles.volumeFocused}`} />
              </div>
            </div>

            {/* Focused Code Window Preview */}
            <div className={styles.codeSnippetBox}>
              <div className={styles.codeSnippetHeader}>
                <span className={styles.codeSnippetFile}>src/cart/cartService.ts</span>
                <span className={styles.codeSnippetMeta}>lines 140–175 assembled</span>
              </div>
              <pre className={styles.codeContent}>
                <code>
                  <span className={styles.codeMuted}>// Target mutation isolated with caller dependencies</span>{'\n'}
                  <span className={styles.codeKeyword}>export async function</span>{' '}
                  <span className={styles.codeFn}>mutateCart</span>(itemId:{' '}
                  <span className={styles.codeType}>string</span>, qty:{' '}
                  <span className={styles.codeType}>number</span>, token?:{' '}
                  <span className={styles.codeType}>string</span>) {'{'}{'\n'}
                  {'  '}<span className={styles.codeKeyword}>const</span> lock ={' '}
                  <span className={styles.codeKeyword}>await</span>{' '}
                  <span className={styles.codeFn}>acquireCartMutex</span>(token);{'\n'}
                  {'  '}<span className={styles.codeAccent}>// Atomic deduplication barrier synthesized for prompt</span>{'\n'}
                  {'}'}
                </code>
              </pre>
            </div>

            {/* Key Editorial Insight */}
            <div className={styles.editorialCallout}>
              <div className={styles.editorialQuoteMark} aria-hidden="true">“</div>
              <p className={styles.editorialQuote}>
                The agent gets the code it needs. Not the entire repository.
              </p>
            </div>
          </div>

          {/* Connector: From Focused Context to Ready for Agent */}
          <div className={styles.connectorPipe} aria-hidden="true">
            <div className={styles.verticalStem} />
            <div
              className={`${styles.signalPulse} ${
                activeStage === 4 ? styles.signalMoving : ''
              }`}
            />
          </div>

          {/* ────────────────────────────────────────────────────────
              STAGE 5: READY FOR AGENT (FINAL OUTPUT)
              ──────────────────────────────────────────────────────── */}
          <div
            className={`${styles.pipelineCard} ${styles.agentCard} ${
              activeStage === 4 ? styles.stageActive : ''
            }`}
            onClick={() => handleManualStageSelect(4)}
            role="button"
            tabIndex={0}
            aria-label="Ready for agent node"
          >
            <div className={styles.agentCardInner}>
              <div className={styles.agentStatusPill}>
                <span className={styles.agentStatusDot} />
                <span className={styles.agentStatusTitle}>READY FOR AGENT</span>
              </div>
              <div className={styles.agentTaskInfo}>
                <span className={styles.taskIssue}>Issue #412</span>
                <span className={styles.taskTitle}>Fix duplicate cart items</span>
              </div>
              <div className={styles.agentAssembledBadge}>
                <span className={styles.agentCheckmark}>✓</span>
                <span>Context assembled.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
