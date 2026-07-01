import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';
import { Display, Grain, Kicker, Reveal, SceneFade } from '../components/ui';

const APAGON_FRAME = 55; // cuando empieza la ola de apagado

interface Edificio {
  x: number;
  w: number;
  h: number;
  seed: number;
}

const edificios: Edificio[] = Array.from({ length: 17 }, (_, i) => ({
  x: 40 + i * 110 + random(`bx-${i}`) * 30,
  w: 72 + random(`bw-${i}`) * 34,
  h: 150 + random(`bh-${i}`) * 260,
  seed: i,
}));

const Ventanas: React.FC<{ b: Edificio }> = ({ b }) => {
  const frame = useCurrentFrame();
  const cols = 3;
  const rows = Math.floor(b.h / 44);
  const windows = Array.from({ length: cols * rows }, (_, i) => {
    const r = random(`w-${b.seed}-${i}`);
    if (r < 0.22) return null; // ventana siempre oscura
    const apagado = APAGON_FRAME + random(`d-${b.seed}-${i}`) * 45;
    const on = interpolate(frame, [apagado, apagado + 5], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const emergencia = r > 0.965; // pocas luces de respaldo quedan
    return (
      <rect
        key={i}
        x={b.x + 12 + (i % cols) * ((b.w - 24) / cols) + 2}
        y={1080 - b.h + 16 + Math.floor(i / cols) * 44}
        width={(b.w - 24) / cols - 7}
        height={26}
        fill={emergencia ? color.ambar : '#ffd97a'}
        opacity={emergencia ? Math.max(on, 0.9) : on * 0.85}
      />
    );
  });
  return <>{windows}</>;
};

const Ciudad: React.FC = () => (
  <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0 }}>
    {edificios.map((b) => (
      <g key={b.seed}>
        <rect x={b.x} y={1080 - b.h} width={b.w} height={b.h} fill={color.bg2} stroke={color.line} strokeWidth={1.5} />
        <Ventanas b={b} />
      </g>
    ))}
  </svg>
);

export const S1Apagon: React.FC = () => {
  const frame = useCurrentFrame();
  const shade = interpolate(frame, [APAGON_FRAME, APAGON_FRAME + 50], [0, 0.55], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <SceneFade>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, #0b1530, ${color.bg} 70%)` }}>
        <Ciudad />
        <AbsoluteFill style={{ background: `rgba(2, 4, 10, ${shade})` }} />
        <AbsoluteFill style={{ justifyContent: 'center', paddingLeft: 140 }}>
          <Reveal delay={8}>
            <Kicker>Puerto Rico · 11:47 PM</Kicker>
          </Reveal>
          <div style={{ height: 30 }} />
          <Reveal delay={95}>
            <Display size={120}>Se fue la luz.</Display>
          </Reveal>
          <div style={{ height: 26 }} />
          <Reveal delay={140}>
            <p
              style={{
                fontFamily: font.ui,
                fontWeight: 600,
                fontSize: 42,
                color: color.ink70,
                margin: 0,
              }}
            >
              Ahora todo depende de su generador.
            </p>
          </Reveal>
        </AbsoluteFill>
        <Grain />
      </AbsoluteFill>
    </SceneFade>
  );
};
