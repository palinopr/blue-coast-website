import React from 'react';
import { AbsoluteFill, Sequence, interpolate, interpolateColors, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';
import { Tank } from '../components/Tank';
import { Backdrop, Dato, Display, Kicker, Lede, Reveal, SceneFade } from '../components/ui';

const SLOT = 120; // frames por servicio
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const VisualLimpieza: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [20, 100], [0, 1], clamp);
  return (
    <Tank
      dieselColor={color.dieselTurbio}
      lodo={1 - p}
      agua={1 - p}
      particles={(1 - p) * 0.8}
    />
  );
};

const VisualPulido: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [15, 105], [0, 1], clamp);
  return (
    <Tank
      dieselColor={interpolateColors(p, [0, 1], [color.dieselTurbio, color.dieselLimpio])}
      lodo={0}
      agua={0}
      particles={(1 - p) * 0.5}
      polish={p}
    />
  );
};

const VisualPreventivo: React.FC = () => {
  const frame = useCurrentFrame();
  const meses = ['ENE', 'ABR', 'JUL', 'OCT'];
  return (
    <div
      style={{
        width: 520,
        margin: '60px auto 0',
        borderRadius: 22,
        border: `1px solid ${color.line2}`,
        background: 'linear-gradient(180deg, rgba(20, 32, 60, 0.6), rgba(10, 18, 38, 0.55))',
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        gap: 26,
      }}
    >
      <div style={{ fontFamily: font.mono, fontSize: 20, letterSpacing: '0.12em', color: color.ink45 }}>
        PLAN ANUAL · 4 VISITAS
      </div>
      {meses.map((m, i) => {
        const done = interpolate(frame, [25 + i * 20, 40 + i * 20], [0, 1], clamp);
        return (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 22 }}>
            <span style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 26, color: color.cyan, width: 70 }}>{m}</span>
            <span style={{ flex: 1, height: 2, background: color.line2 }} />
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                border: `2px solid ${done > 0.5 ? color.ambar : color.line2}`,
                background: done > 0.5 ? 'rgba(255, 176, 58, 0.14)' : 'transparent',
                display: 'grid',
                placeItems: 'center',
                color: color.ambar,
                fontSize: 24,
                fontWeight: 800,
                fontFamily: font.ui,
                transform: `scale(${0.7 + done * 0.3})`,
                opacity: 0.3 + done * 0.7,
              }}
            >
              {done > 0.5 ? '✓' : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const VisualSistemas: React.FC = () => {
  const frame = useCurrentFrame();
  const nodo = (i: number) => interpolate(frame, [20 + i * 25, 35 + i * 25], [0, 1], clamp);
  const caja = (x: number, label: string, lit: number) => (
    <g>
      <rect x={x} y={120} width={170} height={110} rx={16} fill={color.bg3} stroke={lit > 0.5 ? color.ambar : color.line2} strokeWidth={3} />
      <text x={x + 85} y={182} textAnchor="middle" fill={lit > 0.5 ? color.ambar : color.ink45} fontFamily={font.mono} fontWeight={700} fontSize={22} letterSpacing="0.08em">
        {label}
      </text>
    </g>
  );
  return (
    <svg viewBox="0 0 900 360" style={{ width: '100%', marginTop: 90 }}>
      <line x1={80} y1={175} x2={820} y2={175} stroke={color.line2} strokeWidth={8} />
      <line
        x1={80}
        y1={175}
        x2={820}
        y2={175}
        stroke={color.ambar}
        strokeWidth={4}
        strokeDasharray="24 30"
        strokeDashoffset={-frame * 3}
        opacity={0.9}
      />
      {caja(70, 'TANQUE', nodo(0))}
      {caja(370, 'FILTRO', nodo(1))}
      {caja(660, 'MOTOR', nodo(2))}
      <text x={450} y={300} textAnchor="middle" fill={color.ink45} fontFamily={font.mono} fontSize={20} letterSpacing="0.12em">
        DIAGNÓSTICO DE PUNTA A PUNTA
      </text>
    </svg>
  );
};

interface Servicio {
  code: string;
  title: string;
  body: string;
  dato: string;
  visual: React.ReactNode;
}

const servicios: Servicio[] = [
  {
    code: 'SRV·A',
    title: 'Limpieza de tanques diésel',
    body: 'Removemos el lodo, el sedimento y el agua acumulada hasta devolver el tanque a condición de operar.',
    dato: 'CAPACIDAD ATENDIDA · HASTA 93,000 GAL',
    visual: <VisualLimpieza />,
  },
  {
    code: 'SRV·B',
    title: 'Pulido de combustible',
    body: 'Filtración y recirculación multietapa que separan agua, sedimento y microbios del diésel almacenado.',
    dato: 'RESULTADO · DIÉSEL COLOR ÁMBAR LIMPIO',
    visual: <VisualPulido />,
  },
  {
    code: 'SRV·C',
    title: 'Mantenimiento preventivo',
    body: 'Inspecciones y tratamientos programados durante el año que evitan fallas y extienden la vida del sistema.',
    dato: 'REFERENCIA · NFPA 110 PARA GENERADORES',
    visual: <VisualPreventivo />,
  },
  {
    code: 'SRV·D',
    title: 'Sistemas de combustible',
    body: 'Diagnóstico y soporte técnico del sistema de respaldo completo, del tanque al motor.',
    dato: 'COBERTURA · 78 MUNICIPIOS · 24/7',
    visual: <VisualSistemas />,
  },
];

const Slide: React.FC<{ s: Servicio; index: number }> = ({ s, index }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [SLOT - 12, SLOT], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out, flexDirection: 'row', alignItems: 'center', padding: '0 120px', gap: 70 }}>
      <div style={{ width: 700, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Reveal delay={4}>
          <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 28, letterSpacing: '0.14em', color: color.ink45 }}>
            {s.code} <span style={{ color: color.line2 }}>—</span> {index + 1}/4
          </div>
        </Reveal>
        <Reveal delay={10}>
          <Display size={74}>{s.title}</Display>
        </Reveal>
        <Reveal delay={22}>
          <Lede size={31}>{s.body}</Lede>
        </Reveal>
        <Reveal delay={55}>
          <Dato>{s.dato}</Dato>
        </Reveal>
      </div>
      <div style={{ flex: 1, height: 700, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%' }}>{s.visual}</div>
      </div>
    </AbsoluteFill>
  );
};

export const S4Servicios: React.FC = () => (
  <SceneFade>
    <Backdrop>
      <div style={{ position: 'absolute', top: 70, left: 120 }}>
        <Kicker>Lo que hacemos</Kicker>
      </div>
      {servicios.map((s, i) => (
        <Sequence key={s.code} from={i * SLOT} durationInFrames={SLOT}>
          <Slide s={s} index={i} />
        </Sequence>
      ))}
    </Backdrop>
  </SceneFade>
);
