import React from 'react';
import { random, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';

// Geometría interna del tanque (viewBox 0 0 900 620)
const T = { x: 60, y: 100, w: 780, h: 380, r: 70 } as const;
const BOTTOM = T.y + T.h;

export interface TankProps {
  dieselColor: string;
  lodo: number; // altura relativa 0..1
  agua: number; // altura relativa 0..1
  fill?: number; // nivel total de líquido 0..1
  particles?: number; // opacidad de partículas en suspensión
  polish?: number; // progreso del lazo de pulido (0 = oculto)
  labels?: number; // opacidad de los rótulos de capas
  labelSpace?: boolean; // reserva margen izquierdo para los rótulos
}

const Shell: React.FC = () => (
  <>
    <rect
      x={T.x}
      y={T.y}
      width={T.w}
      height={T.h}
      rx={T.r}
      fill={color.bg3}
      stroke={color.line2}
      strokeWidth={3}
    />
    {/* patas y boca de llenado */}
    <rect x={T.x + 90} y={BOTTOM} width={26} height={54} fill={color.bg3} stroke={color.line2} strokeWidth={2} />
    <rect x={T.x + T.w - 116} y={BOTTOM} width={26} height={54} fill={color.bg3} stroke={color.line2} strokeWidth={2} />
    <rect x={T.x + 150} y={T.y - 34} width={64} height={38} rx={8} fill={color.bg3} stroke={color.line2} strokeWidth={2} />
  </>
);

const FluidLayers: React.FC<TankProps> = ({ dieselColor, lodo, agua, fill = 0.86 }) => {
  const frame = useCurrentFrame();
  const lodoH = lodo * 90;
  const aguaH = agua * 70;
  const topY = BOTTOM - T.h * fill;
  const wave = Math.sin(frame / 14) * 4;
  const wave2 = Math.cos(frame / 18) * 3;
  return (
    <g clipPath="url(#tank-clip)">
      {/* diésel */}
      <path
        d={`M ${T.x} ${topY + wave} C ${T.x + T.w * 0.33} ${topY - wave2}, ${T.x + T.w * 0.66} ${
          topY + wave2
        }, ${T.x + T.w} ${topY - wave} L ${T.x + T.w} ${BOTTOM} L ${T.x} ${BOTTOM} Z`}
        fill={dieselColor}
      />
      {/* agua de condensación */}
      {aguaH > 0.5 && (
        <rect x={T.x} y={BOTTOM - lodoH - aguaH} width={T.w} height={aguaH} fill={color.agua} opacity={0.92} />
      )}
      {/* lodo y sedimento del fondo */}
      {lodoH > 0.5 && (
        <path
          d={`M ${T.x} ${BOTTOM - lodoH} Q ${T.x + T.w * 0.25} ${BOTTOM - lodoH - 14}, ${
            T.x + T.w * 0.5
          } ${BOTTOM - lodoH} T ${T.x + T.w} ${BOTTOM - lodoH} L ${T.x + T.w} ${BOTTOM} L ${T.x} ${BOTTOM} Z`}
          fill={color.lodo}
        />
      )}
      {/* brillo superior del líquido */}
      <rect x={T.x} y={topY - 2} width={T.w} height={10} fill="rgba(234, 240, 251, 0.10)" />
    </g>
  );
};

const Particles: React.FC<{ opacity: number; fill: number }> = ({ opacity, fill }) => {
  const frame = useCurrentFrame();
  if (opacity <= 0.01) return null;
  const topY = BOTTOM - T.h * fill + 30;
  const dots = Array.from({ length: 26 }, (_, i) => {
    const rx = random(`px-${i}`);
    const ry = random(`py-${i}`);
    const drift = Math.sin(frame / 20 + i) * 6;
    const sink = (frame * (0.08 + rx * 0.12) + ry * 300) % (BOTTOM - topY - 20);
    return (
      <circle
        key={i}
        cx={T.x + 30 + rx * (T.w - 60) + drift}
        cy={topY + sink}
        r={2 + ry * 3.5}
        fill={ry > 0.55 ? '#1c150a' : '#0d1f30'}
        opacity={opacity * (0.5 + rx * 0.5)}
      />
    );
  });
  return <g clipPath="url(#tank-clip)">{dots}</g>;
};

// Lazo de pulido: sale del fondo, pasa por 3 etapas de filtro y regresa arriba
const PolishLoop: React.FC<{ progress: number }> = ({ progress }) => {
  const frame = useCurrentFrame();
  if (progress <= 0.01) return null;
  const path = `M ${T.x + T.w - 60} ${BOTTOM - 8} L ${T.x + T.w + 60} ${BOTTOM - 8} L ${
    T.x + T.w + 60
  } ${T.y + 40} L ${T.x + T.w - 40} ${T.y + 40}`;
  const stages = [0, 1, 2].map((i) => {
    const lit = progress > (i + 1) / 3.5;
    return (
      <rect
        key={i}
        x={T.x + T.w + 38}
        y={T.y + 150 + i * 62}
        width={44}
        height={48}
        rx={9}
        fill={lit ? 'rgba(255, 176, 58, 0.22)' : color.bg3}
        stroke={lit ? color.ambar : color.line2}
        strokeWidth={2.5}
      />
    );
  });
  return (
    <g opacity={Math.min(1, progress * 3)}>
      <path d={path} fill="none" stroke={color.line2} strokeWidth={10} strokeLinejoin="round" />
      <path
        d={path}
        fill="none"
        stroke={color.ambar}
        strokeWidth={5}
        strokeLinejoin="round"
        strokeDasharray="26 34"
        strokeDashoffset={-frame * 3.4}
        opacity={0.95}
      />
      {stages}
      <text
        x={T.x + T.w + 60}
        y={T.y + 130}
        textAnchor="middle"
        fill={color.cyan}
        fontFamily={font.mono}
        fontWeight={700}
        fontSize={17}
        letterSpacing="0.08em"
      >
        FILTRO
      </text>
    </g>
  );
};

const LayerLabels: React.FC<{ opacity: number; lodo: number; agua: number }> = ({
  opacity,
  lodo,
  agua,
}) => {
  if (opacity <= 0.01) return null;
  const rows = [
    { text: 'LODO BIOLÓGICO Y SEDIMENTO', y: BOTTOM - lodo * 90 * 0.5, tint: color.rojo },
    { text: 'AGUA DE CONDENSACIÓN', y: BOTTOM - lodo * 90 - agua * 70 * 0.5, tint: color.cyan },
    { text: 'DIÉSEL DEGRADADO', y: T.y + 120, tint: color.ambar },
  ];
  return (
    <g opacity={opacity}>
      {rows.map((r) => (
        <g key={r.text}>
          <line x1={T.x - 160} y1={r.y} x2={T.x + 40} y2={r.y} stroke={r.tint} strokeWidth={2} strokeDasharray="4 6" />
          <text
            x={T.x - 168}
            y={r.y + 6}
            textAnchor="end"
            fill={r.tint}
            fontFamily={font.mono}
            fontWeight={700}
            fontSize={19}
            letterSpacing="0.06em"
          >
            {r.text}
          </text>
        </g>
      ))}
    </g>
  );
};

export const Tank: React.FC<TankProps> = (props) => {
  const { particles = 0, polish = 0, labels = 0, fill = 0.86, lodo, agua, labelSpace } = props;
  const viewBox = labelSpace ? '-500 0 1540 660' : '-40 0 1080 660';
  return (
    <svg viewBox={viewBox} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id="tank-clip">
          <rect x={T.x + 3} y={T.y + 3} width={T.w - 6} height={T.h - 6} rx={T.r - 3} />
        </clipPath>
      </defs>
      <Shell />
      <FluidLayers {...props} />
      <Particles opacity={particles} fill={fill} />
      <PolishLoop progress={polish} />
      <LayerLabels opacity={labels} lodo={lodo} agua={agua} />
    </svg>
  );
};
