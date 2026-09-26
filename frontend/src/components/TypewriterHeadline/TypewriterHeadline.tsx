import { useState, useEffect } from 'react';
import styles from './TypewriterHeadline.module.css';

interface TypewriterHeadlineProps {
  className?: string;
  firstLine?: string;
  accentPrefix?: string;
  accentText?: string;
}

const DEFAULT_LINE1 = 'From GitHub Issue';
const DEFAULT_PREFIX = 'to ';
const DEFAULT_ACCENT = 'Verified Patch.';

type TypewriterPhase = 'typing' | 'holding' | 'erasing' | 'paused';

export function TypewriterHeadline({
  className = '',
  firstLine = DEFAULT_LINE1,
  accentPrefix = DEFAULT_PREFIX,
  accentText = DEFAULT_ACCENT,
}: TypewriterHeadlineProps) {
  const line1Len = firstLine.length;
  const prefixLen = accentPrefix.length;
  const accentLen = accentText.length;
  const totalChars = line1Len + prefixLen + accentLen;

  const [charCount, setCharCount] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>('typing');

  useEffect(() => {
    // Check prefers-reduced-motion
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCharCount(totalChars);
      setPhase('holding');
      return;
    }

    let timer: ReturnType<typeof setTimeout>;

    if (phase === 'typing') {
      if (charCount < totalChars) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev + 1);
        }, 100); // 100ms per character for deliberate, editorial typing
      } else {
        setPhase('holding');
      }
    } else if (phase === 'holding') {
      timer = setTimeout(() => {
        setPhase('erasing');
      }, 2400); // 2.4s hold on completed headline
    } else if (phase === 'erasing') {
      if (charCount > 0) {
        timer = setTimeout(() => {
          setCharCount((prev) => prev - 1);
        }, 50); // 50ms per character for smooth erase
      } else {
        setPhase('paused');
      }
    } else if (phase === 'paused') {
      timer = setTimeout(() => {
        setPhase('typing');
      }, 700); // 700ms pause before next cycle
    }

    return () => clearTimeout(timer);
  }, [charCount, phase, totalChars]);

  // Compute active text slices
  const line1Text = firstLine.slice(0, Math.min(charCount, line1Len));
  const isLine1Active = charCount <= line1Len;

  const hasLine2 = charCount > line1Len;
  const line2Rem = hasLine2 ? charCount - line1Len : 0;
  const line2PrefixText = hasLine2
    ? accentPrefix.slice(0, Math.min(line2Rem, prefixLen))
    : '';

  const hasAccent = line2Rem > prefixLen;
  const line2AccentRem = hasAccent ? line2Rem - prefixLen : 0;
  const line2AccentSlice = hasAccent
    ? accentText.slice(0, Math.min(line2AccentRem, accentLen))
    : '';

  return (
    <h1 className={`${styles.headline} ${className}`}>
      {/* Stable accessibility text for screen readers */}
      <span className={styles.srOnly}>
        {firstLine} {accentPrefix}{accentText}
      </span>

      {/* Sizer: occupies the full layout footprint to prevent ANY layout shift */}
      <span className={styles.sizer} aria-hidden="true">
        {firstLine}{' '}
        <br />
        {accentPrefix}
        <span className={styles.headlineAccent}>{accentText}</span>
      </span>

      {/* Animated presentation layer */}
      <span className={styles.animated} aria-hidden="true">
        {line1Text}
        {isLine1Active && <span className={styles.cursor} />}
        {hasLine2 && (
          <>
            <br />
            {line2PrefixText}
            {line2AccentSlice && (
              <span className={styles.headlineAccent}>{line2AccentSlice}</span>
            )}
            {!isLine1Active && <span className={styles.cursor} />}
          </>
        )}
      </span>
    </h1>
  );
}
