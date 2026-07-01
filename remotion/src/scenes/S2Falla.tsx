import React from 'react';
import { AbsoluteFill, interpolate, random, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';
import { Backdrop, Dato, Display, Kicker, Lede, Reveal, SceneFade } from '../components/ui';

const FALLA_FRAME = 185;

// Tres intentos de arranque que no llegan
const rpmAt = (frame: number): number => {
  const intentos: Array<[number, number, number]> = [
    [30, 70, 0.55],
    [90, 130, 0.68],
    [150, FALLA_FRAME, 0.42],
  ];
  let rpm = 0;
  for (const [a, b, pico] of intentos) {
    const subida = interpolate(frame, [a, (a + b) / 2, b], [0, pico, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    rpm = Math.max(rpm, subida);
  }
  return rpm;
};

const Medidor: React.FC = () => {
  const frame = useCurrentFrame();
  const rpm = rpmAt(frame);
  const angle = -105 + rpm * 210 + (rpm > 0.05 ? Math.sin(frame * 1.7) * 3 : 0);
  const fallo = frame >= FALLA_FRAME;
  return (
    <svg viewBox="0 0 360 220" style={{ width: 420 }}>
      <path d="M 40 190 A 140 140 0 0 1 320 190" fill="none" stroke={color.line2} strokeWidth={10} strokeLinecap="round" />
      <path d="M 268 78 A 140 140 0 0 1 320 190" fill="none" stroke={color.rojo} strokeWidth={10} strokeLinecap="round" opacity={0.7} />
      <g transform={`rotate(${angle} 180 190)`}>
        <line x1={180} y1={190} x2={180} y2={72} stroke={fallo ? color.rojo : color.ambar} strokeWidth={7} strokeLinecap="round" />
      </g>
      <circle cx={180} cy={190} r={14} fill={color.bg3} stroke={color.line2} strokeWidth={3} />
      <text x={180} y={140} textAnchor="middle" fill={color.ink45} fontFamily={font.mono} fontSize={17} letterSpacing="0.1em">
        RPM
      </text>
    </svg>
  );
};

const Filtro: React.FC = () => {
  const frame = useCurrentFrame();
  const tapado = interpolate(frame, [20, FALLA_FRAME], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dots = Array.from({ length: 22 }, (_, i) => {
    const rx = random(`f-${i}`);
    const ry = random(`g-${i}`);
    return (
      <circle
        key={i}
        cx={40 + rx * 200}
        cy={150 - ry * tapado * 110}
        r={3 + ry * 5}
        fill={color.lodo}
        opacity={tapado > ry ? 0.95 : 0}
      />
    );
  });
  const fallo = frame >= FALLA_FRAME;
  return (
    <svg viewBox="0 0 280 190" style={{ width: 320 }}>
      <rect x={20} y={20} width={240} height={150} rx={16} fill={color.bg3} stroke={fallo ? color.rojo : color.line2} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, i) => (
        <line key={i} x1={38} y1={44 + i * 22} x2={242} y2={44 + i * 22} stroke={color.line2} strokeWidth={2} opacity={0.6} />
      ))}
      {dots}
      <text x={140} y={12} textAnchor="middle" fill={color.ink45} fontFamily={font.mono} fontSize={16} letterSpacing="0.12em">
        FILTRO DE COMBUSTIBLE
      </text>
    </svg>
  );
};

const PanelGenerador: React.FC = () => {
  const frame = useCurrentFrame();
  const fallo = frame >= FALLA_FRAME;
  const blink = Math.sin(frame / 4) > 0 || fallo;
  return (
    <div
      style={{
        width: 560,
        borderRadius: 22,
        border: `1px solid ${fallo ? 'rgba(255, 92, 71, 0.5)' : color.line2}`,
        background: 'linear-gradient(180deg, rgba(20, 32, 60, 0.6), rgba(10, 18, 38, 0.55))',
        padding: '36px 44px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 18,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, alignSelf: 'flex-start' }}>
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: fallo ? color.rojo : color.ambar,
            boxShadow: `0 0 16px ${fallo ? color.rojo : color.ambar}`,
            opacity: blink ? 1 : 0.25,
          }}
        />
        <span style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 22, letterSpacing: '0.1em', color: fallo ? color.rojo : color.ambar }}>
          {fallo ? 'FALLA DE COMBUSTIBLE' : 'ARRANCANDO…'}
        </span>
      </div>
      <Medidor />
      <Filtro />
    </div>
  );
};

export const S2Falla: React.FC = () => (
  <SceneFade>
    <Backdrop>
      <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', padding: '0 140px', gap: 90 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 28 }}>
          <Reveal delay={6}>
            <Kicker>El punto ciego</Kicker>
          </Reveal>
          <Reveal delay={16}>
            <Display size={92}>El motor pide diésel.</Display>
          </Reveal>
          <Reveal delay={30}>
            <Lede>
              Si hay lodo en el tanque, el filtro se tapa justo cuando el generador arranca.
            </Lede>
          </Reveal>
          <Reveal delay={200}>
            <Dato tint={color.rojo}>FALLA TÍPICA · FILTRO TAPADO POR SEDIMENTO</Dato>
          </Reveal>
        </div>
        <Reveal delay={12}>
          <PanelGenerador />
        </Reveal>
      </AbsoluteFill>
    </Backdrop>
  </SceneFade>
);
