import React from 'react';
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';
import { Tank } from '../components/Tank';
import { Backdrop, Dato, Display, GradText, Kicker, Lede, Reveal, SceneFade } from '../components/ui';

// La degradación corre como time-lapse entre estos frames
const DEG = [70, 320] as const;

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const S3Tanque: React.FC = () => {
  const frame = useCurrentFrame();
  const deg = interpolate(frame, [DEG[0], DEG[1]], [0, 1], clamp);
  const meses = Math.round(deg * 36);
  const dieselColor = interpolateColors(deg, [0, 1], [color.dieselLimpio, color.dieselSucio]);
  const labels = interpolate(frame, [230, 260], [0, 1], clamp);
  return (
    <SceneFade>
      <Backdrop>
        <AbsoluteFill style={{ flexDirection: 'row', alignItems: 'center', padding: '0 110px' }}>
          <div style={{ width: 640, display: 'flex', flexDirection: 'column', gap: 28, zIndex: 2 }}>
            <Reveal delay={6}>
              <Kicker>Dentro de su tanque</Kicker>
            </Reveal>
            <Reveal delay={16}>
              <Display size={86}>
                Un tanque «lleno» <GradText>no es un tanque listo.</GradText>
              </Display>
            </Reveal>
            <Reveal delay={40}>
              <Lede>
                Con los años, el diésel almacenado se separa en capas: agua de condensación,
                sedimento y un lodo biológico que tapa los filtros.
              </Lede>
            </Reveal>
            <Reveal delay={250}>
              <Dato>ASÍ SE VE UN TANQUE SIN MANTENIMIENTO</Dato>
            </Reveal>
          </div>
          <div style={{ flex: 1, position: 'relative', height: 760 }}>
            <div
              style={{
                position: 'absolute',
                top: 20,
                right: 40,
                fontFamily: font.mono,
                fontWeight: 700,
                fontSize: 26,
                letterSpacing: '0.1em',
                color: deg > 0.7 ? color.rojo : color.ink45,
              }}
            >
              TIEMPO ALMACENADO · {meses} MESES
            </div>
            <div style={{ position: 'absolute', inset: '70px 0 0 0' }}>
              <Tank
                dieselColor={dieselColor}
                lodo={deg}
                agua={interpolate(deg, [0.15, 1], [0, 1], clamp)}
                particles={deg * 0.9}
                labels={labels}
                labelSpace
              />
            </div>
          </div>
        </AbsoluteFill>
      </Backdrop>
    </SceneFade>
  );
};
