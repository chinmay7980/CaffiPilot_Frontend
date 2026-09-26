import { useState, useEffect, useCallback, useRef } from 'react';
import {
  PREVIEW_STATES,
  STATE_DURATIONS,
  type PreviewState,
} from './previewStates';

export function usePreviewStateMachine() {
  const [stateIndex, setStateIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReducedMotion.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => {
      prefersReducedMotion.current = e.matches;
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const transitionDuration = 600; // ms for crossfade

  const advanceState = useCallback(() => {
    setIsTransitioning(true);

    const fadeTime = prefersReducedMotion.current ? 50 : transitionDuration;
    setTimeout(() => {
      setStateIndex((prev) => (prev + 1) % PREVIEW_STATES.length);
      setIsTransitioning(false);
    }, fadeTime);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion.current) {
      return; // Stop animation loop when reduced motion is preferred
    }

    const currentState = PREVIEW_STATES[stateIndex];
    const holdTime = STATE_DURATIONS[currentState.phase] || 4000;

    timerRef.current = setTimeout(advanceState, holdTime);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [stateIndex, advanceState]);

  const currentState: PreviewState = PREVIEW_STATES[stateIndex];

  return {
    currentState,
    stateIndex,
    isTransitioning,
    totalStates: PREVIEW_STATES.length,
  };
}
