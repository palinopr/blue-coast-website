import { loadFont as loadSora } from '@remotion/google-fonts/Sora';
import { loadFont as loadManrope } from '@remotion/google-fonts/Manrope';
import { loadFont as loadChivoMono } from '@remotion/google-fonts/ChivoMono';

const sora = loadSora('normal', { weights: ['600', '700', '800'] });
const manrope = loadManrope('normal', { weights: ['500', '600', '700', '800'] });
const chivo = loadChivoMono('normal', { weights: ['500', '700'] });

export const font = {
  display: sora.fontFamily,
  ui: manrope.fontFamily,
  mono: chivo.fontFamily,
} as const;

export const color = {
  bg: '#050a16',
  bg2: '#0a1224',
  bg3: '#101c36',
  ink: '#eaf0fb',
  ink70: 'rgba(234, 240, 251, 0.72)',
  ink45: 'rgba(234, 240, 251, 0.45)',
  line: 'rgba(148, 170, 210, 0.14)',
  line2: 'rgba(148, 170, 210, 0.28)',
  azul: '#2f6bff',
  cyan: '#59c2ff',
  ambar: '#ffb03a',
  ambar2: '#ff8a00',
  wa: '#25d366',
  rojo: '#ff5c47',
  // fluidos dentro del tanque
  dieselSucio: '#3d2a12',
  dieselTurbio: '#6b4a1c',
  dieselLimpio: '#d98e2b',
  lodo: '#1c150a',
  agua: '#12283f',
} as const;

export const FPS = 30;

// Duración de cada escena en frames (30 fps)
export const scene = {
  apagon: 8 * FPS,
  falla: 8 * FPS,
  tanque: 14 * FPS,
  servicios: 16 * FPS,
  prueba: 12 * FPS,
  cta: 10 * FPS,
} as const;

export const TOTAL_FRAMES =
  scene.apagon + scene.falla + scene.tanque + scene.servicios + scene.prueba + scene.cta;
