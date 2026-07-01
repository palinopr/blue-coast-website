import React from 'react';
import { AbsoluteFill, Sequence, interpolate, random, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';
import { Backdrop, Dato, Display, GradText, Kicker, Reveal, SceneFade } from '../components/ui';

const JARS_DUR = 180;
const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

const Frasco: React.FC<{ limpio: boolean; progreso: number }> = ({ limpio, progreso }) => {
  const nivel = 300 * (limpio ? progreso : 1);
  const sucio = !limpio;
  return (
    <svg viewBox="0 0 260 420" style={{ width: 250 }}>
      <rect x={80} y={18} width={100} height={30} rx={8} fill={color.bg3} stroke={color.line2} strokeWidth={2.5} />
      <rect x={40} y={48} width={180} height={350} rx={26} fill="rgba(148, 170, 210, 0.06)" stroke={color.line2} strokeWidth={3} />
      <rect x={48} y={390 - nivel} width={164} height={nivel} rx={18} fill={limpio ? color.dieselLimpio : color.dieselSucio} opacity={0.94} />
      {sucio && <rect x={48} y={352} width={164} height={38} rx={14} fill={color.lodo} />}
      {sucio &&
        Array.from({ length: 14 }, (_, i) => (
          <circle
            key={i}
            cx={60 + random(`j-${i}`) * 140}
            cy={130 + random(`k-${i}`) * 200}
            r={2.5 + random(`l-${i}`) * 4}
            fill={color.lodo}
            opacity={0.85}
          />
        ))}
      {limpio && <rect x={58} y={390 - nivel} width={16} height={nivel} rx={8} fill="rgba(255, 235, 200, 0.28)" />}
    </svg>
  );
};

const Frascos: React.FC = () => {
  const frame = useCurrentFrame();
  const progreso = interpolate(frame, [45, 110], [0, 1], clamp);
  const out = interpolate(frame, [JARS_DUR - 14, JARS_DUR], [1, 0], clamp);
  const etiqueta = (texto: string, tint: string) => (
    <div style={{ fontFamily: font.mono, fontWeight: 700, fontSize: 26, letterSpacing: '0.14em', color: tint, textAlign: 'center' }}>
      {texto}
    </div>
  );
  return (
    <AbsoluteFill style={{ opacity: out, alignItems: 'center', justifyContent: 'center', gap: 40 }}>
      <Reveal delay={4} style={{ textAlign: 'center' }}>
        <Kicker>La prueba</Kicker>
      </Reveal>
      <Reveal delay={12} style={{ textAlign: 'center' }}>
        <Display size={80}>
          El mismo diésel, <GradText>antes y después.</GradText>
        </Display>
      </Reveal>
      <div style={{ display: 'flex', gap: 130, alignItems: 'flex-end', marginTop: 20 }}>
        <Reveal delay={26} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Frasco limpio={false} progreso={1} />
          {etiqueta('ANTES', color.rojo)}
        </Reveal>
        <Reveal delay={40} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Frasco limpio progreso={progreso} />
          {etiqueta('DESPUÉS DEL PULIDO', color.ambar)}
        </Reveal>
      </div>
    </AbsoluteFill>
  );
};

const cifras = [
  { big: '+15', label: 'años de experiencia' },
  { big: '500+', label: 'tanques intervenidos' },
  { big: '93K', label: 'galones, el proyecto mayor' },
  { big: '78', label: 'municipios en cobertura' },
];

const Contador: React.FC<{ big: string; label: string; delay: number }> = ({ big, label, delay }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame - delay, [0, 22], [0, 1], clamp);
  const target = parseInt(big.replace(/\D/g, ''), 10);
  const n = Math.round(target * Math.min(1, t * 1.15));
  const texto = big.startsWith('+') ? `+${n}` : big.endsWith('+') ? `${n}+` : big.endsWith('K') ? `${n}K` : `${n}`;
  return (
    <div style={{ opacity: t, transform: `translateY(${(1 - t) * 24}px)`, textAlign: 'center', width: 360 }}>
      <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 120, letterSpacing: '-0.03em' }}>
        <GradText>{texto}</GradText>
      </div>
      <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 30, color: color.ink70, marginTop: 6 }}>{label}</div>
    </div>
  );
};

const Cifras: React.FC = () => (
  <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 60 }}>
    <Reveal delay={4} style={{ textAlign: 'center' }}>
      <Display size={72}>Obra entregada, con nombre y galones.</Display>
    </Reveal>
    <div style={{ display: 'flex', gap: 30 }}>
      {cifras.map((c, i) => (
        <Contador key={c.big} big={c.big} label={c.label} delay={18 + i * 12} />
      ))}
    </div>
    <Reveal delay={80}>
      <Dato tint={color.ink45}>
        HOSPITAL DE DAMAS · AUXILIO MUTUO · BOSTON SCIENTIFIC · MENONITA
      </Dato>
    </Reveal>
  </AbsoluteFill>
);

export const S5Prueba: React.FC = () => (
  <SceneFade>
    <Backdrop>
      <Sequence durationInFrames={JARS_DUR}>
        <Frascos />
      </Sequence>
      <Sequence from={JARS_DUR}>
        <Cifras />
      </Sequence>
    </Backdrop>
  </SceneFade>
);
