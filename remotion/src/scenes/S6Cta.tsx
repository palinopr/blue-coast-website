import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { color, font } from '../theme';
import { Backdrop, Dato, Display, Glow, GradText, Reveal } from '../components/ui';

const WaIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 40, height: 40 }}>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 0 1 8.413 3.488 11.82 11.82 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zM6.6 20.2c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 0 0 1.523 5.26l-.999 3.648 3.465-.81z" />
  </svg>
);

const BotonWhatsApp: React.FC = () => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 20,
      background: color.wa,
      color: '#04170b',
      borderRadius: 20,
      padding: '26px 52px',
      fontFamily: font.ui,
      fontWeight: 800,
      fontSize: 42,
      letterSpacing: '-0.01em',
      boxShadow: '0 22px 60px -14px rgba(37, 211, 102, 0.55)',
    }}
  >
    <WaIcon />
    WhatsApp · (939) 969-9999
  </div>
);

export const S6Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.6 + Math.abs(Math.sin(frame / 18)) * 0.4;
  return (
    <Backdrop>
      <Glow x="50%" y="80%" size={1300} tint="rgba(255, 138, 0, 0.10)" />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', gap: 38, textAlign: 'center' }}>
        <Reveal delay={6}>
          <div style={{ fontFamily: font.display, fontWeight: 800, fontSize: 34, letterSpacing: '0.22em', color: color.cyan }}>
            BLUE COAST DEVELOPERS
          </div>
          <div style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 24, letterSpacing: '0.06em', color: color.ink45, marginTop: 10 }}>
            GESTIÓN INTEGRAL DE COMBUSTIBLE DIÉSEL
          </div>
        </Reveal>
        <Reveal delay={26}>
          <Display size={104}>
            Su generador arranca.
            <br />
            <GradText>Del diésel nos encargamos nosotros.</GradText>
          </Display>
        </Reveal>
        <Reveal delay={60}>
          <p style={{ fontFamily: font.ui, fontWeight: 600, fontSize: 38, color: color.ink70, margin: 0 }}>
            No espere al próximo apagón para conocer su tanque.
          </p>
        </Reveal>
        <Reveal delay={90} style={{ marginTop: 14 }}>
          <BotonWhatsApp />
        </Reveal>
        <Reveal delay={120}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: color.wa,
                boxShadow: `0 0 14px ${color.wa}`,
                opacity: pulse,
              }}
            />
            <Dato tint={color.ink70}>ATENDEMOS 24/7 · 78 MUNICIPIOS · WWW.BLUECOASTPR.COM</Dato>
          </div>
        </Reveal>
      </AbsoluteFill>
    </Backdrop>
  );
};
