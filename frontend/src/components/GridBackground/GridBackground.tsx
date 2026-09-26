import React from 'react';
import styles from './GridBackground.module.css';

export interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'hero' | 'section' | 'default';
  intensity?: 'default' | 'subtle';
  glow?: boolean;
  glowPosition?: 'right' | 'center';
  as?: 'div' | 'section';
  id?: string;
}

export function GridBackground({
  children,
  className = '',
  variant = 'default',
  intensity = 'default',
  glow = false,
  glowPosition = 'right',
  as: Component = 'div',
  id,
}: GridBackgroundProps) {
  const intensityClass =
    intensity === 'subtle' ? styles.subtleIntensity : styles.defaultIntensity;
  const variantClass = styles[variant] || styles.default;
  const glowClass =
    glowPosition === 'center' ? styles.glowCenter : styles.glowRight;

  return (
    <Component
      id={id}
      className={`${styles.gridBackground} ${variantClass} ${intensityClass} ${className}`}
    >
      {/* 40px × 40px grid layer with directional radial mask */}
      <div className={styles.gridLayer} aria-hidden="true" />

      {/* Radial fade overlay layer ensuring smooth dissolve into canvas */}
      <div className={styles.radialFadeOverlay} aria-hidden="true" />

      {/* Optional ambient amber glow support */}
      {glow && <div className={`${styles.glow} ${glowClass}`} aria-hidden="true" />}

      {/* Page content rendered above background layers */}
      {children}
    </Component>
  );
}
