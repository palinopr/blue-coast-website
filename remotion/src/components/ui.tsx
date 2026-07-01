import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { color, font } from '../theme';

const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const Grain: React.FC = () => (
  <AbsoluteFill style={{ opacity: 0.04, backgroundImage: NOISE_URI, pointerEvents: 'none' }} />
);

export const Glow: React.FC<{
  x: string;
  y: string;
  size: number;
  tint?: string;
  opacity?: number;
}> = ({ x, y, size, tint = 'rgba(47, 107, 255, 0.26)', opacity = 1 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      transform: 'translate(-50%, -50%)',
      background: `radial-gradient(closest-side, ${tint}, transparent 70%)`,
      opacity,
    }}
  />
);

// Fondo estándar: azul noche + glow + grano
export const Backdrop: React.FC<{ glowTint?: string; children?: React.ReactNode }> = ({
  glowTint,
  children,
}) => (
  <AbsoluteFill style={{ background: `linear-gradient(180deg, ${color.bg2}, ${color.bg} 60%)` }}>
    <Glow x="18%" y="30%" size={1100} tint={glowTint} />
    {children}
    <Grain />
  </AbsoluteFill>
);

// Entrada tipo .rv del sitio: fade + subida, con retraso en frames
export const Reveal: React.FC<{
  delay: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay, children, style }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * 26}px)`, ...style }}>
      {children}
    </div>
  );
};

// Fundido de entrada/salida en los bordes de cada escena
export const SceneFade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 10, durationInFrames - 10, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      fontFamily: font.ui,
      fontWeight: 700,
      fontSize: 26,
      letterSpacing: '0.09em',
      color: color.cyan,
      textTransform: 'uppercase',
    }}
  >
    <span
      style={{
        width: 38,
        height: 3,
        borderRadius: 3,
        background: `linear-gradient(90deg, ${color.azul}, ${color.cyan})`,
      }}
    />
    {children}
  </div>
);

export const GradText: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span
    style={{
      background: `linear-gradient(92deg, ${color.ambar} 10%, ${color.ambar2} 90%)`,
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
    }}
  >
    {children}
  </span>
);

export const Display: React.FC<{ size?: number; children: React.ReactNode }> = ({
  size = 84,
  children,
}) => (
  <h1
    style={{
      fontFamily: font.display,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '-0.03em',
      lineHeight: 1.06,
      color: color.ink,
      margin: 0,
    }}
  >
    {children}
  </h1>
);

export const Lede: React.FC<{ size?: number; children: React.ReactNode }> = ({
  size = 34,
  children,
}) => (
  <p
    style={{
      fontFamily: font.ui,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.5,
      color: color.ink70,
      margin: 0,
    }}
  >
    {children}
  </p>
);

// Línea de dato en mono, como los "dato" del sitio
export const Dato: React.FC<{ children: React.ReactNode; tint?: string }> = ({
  children,
  tint = color.cyan,
}) => (
  <div
    style={{
      fontFamily: font.mono,
      fontWeight: 700,
      fontSize: 24,
      letterSpacing: '0.08em',
      color: tint,
    }}
  >
    {children}
  </div>
);
