import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  interpolateColors,
} from "remotion";
import { noise2D, noise3D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";

const { fontFamily: anton } = loadAnton();
const { fontFamily: mont } = loadMont();

/* ---------- shared palette (inlined, not imported) ---------- */
const C = {
  skyTop: "#0a1826",
  skyBot: "#04070c",
  cloud: "#16263a",
  steelDark: "#16222f",
  steel: "#27435c",
  steelLite: "#3f6684",
  gold: "#c9a14a",
  goldSoft: "#e7c477",
  goldDeep: "#5c4420",
  goldMid: "#a8843a",
  redCross: "#e0484f",
  fog: "#0c1622",
  offWhite: "#f2efe9",
  muted: "#8aa0b4",
  fuelClean: "#d8a93c",
  water: "#4f8fb0",
  sediment: "#7d5e34",
  sludge: "#221a10",
};

/* deterministic hash */
const h = (i: number, s = 1): number => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

const TOTAL = 327;

export const Scene2Tanque: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const dur = durationInFrames || TOTAL;

  /* scene fade */
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(frame, [dur - 12, dur], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneOpacity = Math.min(fadeIn, fadeOut);

  /* slow camera drift */
  const camX = noise2D("camx", frame * 0.0055, 0) * 26;
  const camY = noise2D("camy", 0, frame * 0.0045) * 16;
  const camScale = 1.05 + noise2D("camz", frame * 0.004, 9) * 0.03;

  /* ---------- tank geometry (left-of-center) ---------- */
  const tankX = 470;
  const tankY = 250;
  const tankW = 560;
  const tankH = 620;
  const wall = 26;
  const innerX = tankX + wall;
  const innerY = tankY + wall;
  const innerW = tankW - wall * 2;
  const innerH = tankH - wall * 2;
  const innerBottom = innerY + innerH;

  /* fill rise 20 -> 92 */
  const fillT = spring({
    frame: frame - 20,
    fps,
    config: { damping: 200, stiffness: 60 },
    durationInFrames: 80,
  });
  const fillLevelY = interpolate(fillT, [0, 1], [innerBottom, innerY + 18]);

  /* separation progress 96 -> 215 */
  const sep = spring({
    frame: frame - 96,
    fps,
    config: { damping: 200, stiffness: 55 },
    durationInFrames: 120,
  });

  /* layer band heights when fully separated (fractions of inner height) */
  const fSludge = 0.16;
  const fSediment = 0.2;
  const fWater = 0.13;

  const liquidTop = fillLevelY;
  const liquidH = innerBottom - liquidTop;

  const sludgeH = liquidH * fSludge * sep;
  const sedimentH = liquidH * fSediment * sep;
  const waterH = liquidH * fWater * sep;

  const ySludgeTop = innerBottom - sludgeH;
  const ySedimentTop = ySludgeTop - sedimentH;
  const yWaterTop = ySedimentTop - waterH;
  const yCleanTop = liquidTop;

  /* fuel color shifts from uniform clean -> stratified darker top while sep grows */
  const cleanCol = interpolateColors(sep, [0, 1], [C.fuelClean, C.goldSoft]);

  /* magnifier inset */
  const magShow = spring({
    frame: frame - 150,
    fps,
    config: { damping: 140, stiffness: 120 },
    durationInFrames: 30,
  });
  const magCX = 1430;
  const magCY = 740;
  const magR = 190;
  /* point on tank the magnifier samples (the sludge zone) */
  const sampleX = innerX + innerW * 0.5;
  const sampleY = ySludgeTop + sludgeH * 0.45;

  return (
    <AbsoluteFill style={{ backgroundColor: C.skyBot, opacity: sceneOpacity }}>
      <AbsoluteFill
        style={{
          transform: `translate(${camX}px, ${camY}px) scale(${camScale})`,
          transformOrigin: "center center",
        }}
      >
        <svg
          width={width}
          height={height}
          viewBox="0 0 1920 1080"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* ----- backdrop ----- */}
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.skyTop} />
              <stop offset="1" stopColor={C.skyBot} />
            </linearGradient>
            <radialGradient id="vign" cx="42%" cy="46%" r="75%">
              <stop offset="0" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="0.72" />
            </radialGradient>
            <radialGradient id="floorGlow" cx="50%" cy="0%" r="120%">
              <stop offset="0" stopColor={C.gold} stopOpacity="0.1" />
              <stop offset="1" stopColor={C.gold} stopOpacity="0" />
            </radialGradient>

            {/* ----- steel ----- */}
            <linearGradient id="steelWall" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor={C.steelDark} />
              <stop offset="0.18" stopColor={C.steel} />
              <stop offset="0.5" stopColor={C.steelLite} />
              <stop offset="0.82" stopColor={C.steel} />
              <stop offset="1" stopColor={C.steelDark} />
            </linearGradient>
            <linearGradient id="steelInner" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#0b141d" />
              <stop offset="0.5" stopColor="#162533" />
              <stop offset="1" stopColor="#0b141d" />
            </linearGradient>

            {/* ----- fuel layer gradients ----- */}
            <linearGradient id="cleanFuel" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.goldSoft} />
              <stop offset="0.5" stopColor={cleanCol} />
              <stop offset="1" stopColor={C.goldMid} />
            </linearGradient>
            <linearGradient id="waterLayer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#6aa6c4" />
              <stop offset="1" stopColor={C.water} />
            </linearGradient>
            <linearGradient id="sedLayer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#8a6a3c" />
              <stop offset="1" stopColor={C.sediment} />
            </linearGradient>
            <linearGradient id="sludgeLayer" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#3a2c18" />
              <stop offset="1" stopColor={C.sludge} />
            </linearGradient>

            {/* shimmer highlight on fuel surface */}
            <linearGradient id="surfShine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity="0" />
              <stop offset="0.5" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>

            {/* magnifier radial gloss */}
            <radialGradient id="lensGloss" cx="35%" cy="30%" r="80%">
              <stop offset="0" stopColor="#fff" stopOpacity="0.22" />
              <stop offset="0.4" stopColor="#fff" stopOpacity="0.04" />
              <stop offset="1" stopColor="#000" stopOpacity="0.28" />
            </radialGradient>
            <radialGradient id="magContent" cx="50%" cy="60%" r="80%">
              <stop offset="0" stopColor="#2c2110" />
              <stop offset="1" stopColor={C.sludge} />
            </radialGradient>

            <filter id="soft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="9" />
            </filter>
            <filter id="soft2" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3" />
            </filter>

            {/* clip for liquid inside tank */}
            <clipPath id="tankInner">
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                rx={20}
              />
            </clipPath>
            <clipPath id="lensClip">
              <circle cx={magCX} cy={magCY} r={magR} />
            </clipPath>
          </defs>

          {/* ===== background ===== */}
          <rect x="0" y="0" width="1920" height="1080" fill="url(#bg)" />

          {/* far parallax fog blobs */}
          {Array.from({ length: 6 }).map((_, i) => {
            const px =
              200 + i * 320 + noise2D("fogx" + i, frame * 0.003, i) * 60;
            const py = 180 + (i % 3) * 70 + h(i, 4) * 40;
            const r = 220 + h(i, 7) * 120;
            return (
              <circle
                key={"fog" + i}
                cx={px}
                cy={py}
                r={r}
                fill={C.fog}
                opacity={0.5}
                filter="url(#soft)"
              />
            );
          })}

          {/* drifting dust motes (atmosphere, near) */}
          {Array.from({ length: 60 }).map((_, i) => {
            const baseX = h(i, 2) * 1920;
            const baseY = h(i, 5) * 1080;
            const dx = noise2D("dustx" + i, frame * 0.006, i) * 50;
            const dy = noise2D("dusty" + i, i, frame * 0.005) * 50;
            const s = 1 + h(i, 9) * 2.4;
            const op = 0.05 + h(i, 11) * 0.18;
            return (
              <circle
                key={"dust" + i}
                cx={baseX + dx}
                cy={baseY + dy}
                r={s}
                fill={C.muted}
                opacity={op}
              />
            );
          })}

          {/* warm floor pool under the tank */}
          <ellipse
            cx={tankX + tankW / 2}
            cy={tankY + tankH + 40}
            rx={tankW * 0.62}
            ry={64}
            fill="url(#floorGlow)"
          />
          <ellipse
            cx={tankX + tankW / 2}
            cy={tankY + tankH + 46}
            rx={tankW * 0.5}
            ry={34}
            fill="#000"
            opacity={0.45}
            filter="url(#soft)"
          />

          {/* ===== tank shell ===== */}
          {/* support legs */}
          {[tankX + 70, tankX + tankW - 70].map((lx, i) => (
            <g key={"leg" + i}>
              <rect
                x={lx - 16}
                y={tankY + tankH - 20}
                width={32}
                height={88}
                fill={C.steelDark}
                rx={5}
              />
              <rect
                x={lx - 40}
                y={tankY + tankH + 60}
                width={80}
                height={16}
                fill={C.steel}
                rx={4}
              />
            </g>
          ))}

          {/* outer wall */}
          <rect
            x={tankX}
            y={tankY}
            width={tankW}
            height={tankH}
            rx={34}
            fill="url(#steelWall)"
            stroke="#0a131c"
            strokeWidth={3}
          />
          {/* cutaway inner cavity background */}
          <rect
            x={innerX}
            y={innerY}
            width={innerW}
            height={innerH}
            rx={20}
            fill="url(#steelInner)"
          />

          {/* horizontal weld seams on wall */}
          {Array.from({ length: 5 }).map((_, i) => {
            const sy = tankY + 60 + i * ((tankH - 120) / 4);
            return (
              <line
                key={"seam" + i}
                x1={tankX + 6}
                y1={sy}
                x2={tankX + tankW - 6}
                y2={sy}
                stroke="#0b141d"
                strokeWidth={2}
                opacity={0.5}
              />
            );
          })}

          {/* rivets along inner edges */}
          {Array.from({ length: 14 }).map((_, i) => {
            const ry = innerY + 18 + (i * (innerH - 36)) / 13;
            return (
              <g key={"riv" + i}>
                <circle
                  cx={tankX + 13}
                  cy={ry}
                  r={3.4}
                  fill={C.steelLite}
                  opacity={0.7}
                />
                <circle
                  cx={tankX + tankW - 13}
                  cy={ry}
                  r={3.4}
                  fill={C.steelLite}
                  opacity={0.7}
                />
              </g>
            );
          })}

          {/* top dome / hatch */}
          <rect
            x={tankX + tankW / 2 - 70}
            y={tankY - 34}
            width={140}
            height={40}
            rx={12}
            fill={C.steel}
            stroke="#0a131c"
            strokeWidth={2}
          />
          <ellipse
            cx={tankX + tankW / 2}
            cy={tankY - 34}
            rx={70}
            ry={16}
            fill={C.steelLite}
          />
          <rect
            x={tankX + tankW / 2 - 14}
            y={tankY - 66}
            width={28}
            height={34}
            rx={5}
            fill={C.steelDark}
          />

          {/* ===== liquid contents (clipped) ===== */}
          <g clipPath="url(#tankInner)">
            {/* CLEAN FUEL body (everything above water) */}
            <rect
              x={innerX}
              y={yCleanTop}
              width={innerW}
              height={Math.max(0, yWaterTop - yCleanTop)}
              fill="url(#cleanFuel)"
            />

            {/* internal convection / lighting streaks in fuel */}
            {Array.from({ length: 7 }).map((_, i) => {
              const sx = innerX + 20 + (i * (innerW - 40)) / 6;
              const wob = noise2D("streak" + i, frame * 0.01, i) * 14;
              return (
                <rect
                  key={"streak" + i}
                  x={sx + wob}
                  y={yCleanTop}
                  width={10}
                  height={Math.max(0, yWaterTop - yCleanTop)}
                  fill="#fff"
                  opacity={0.04 + h(i, 3) * 0.04}
                />
              );
            })}

            {/* falling / settling sediment particle field (drift down into sediment band) */}
            {Array.from({ length: 90 }).map((_, i) => {
              const colX = innerX + 14 + h(i, 2) * (innerW - 28);
              const speed = 0.4 + h(i, 6) * 0.9;
              const phase = h(i, 8) * innerH;
              /* travels from top of liquid downward, settling near sediment top */
              const settleTarget = ySedimentTop + h(i, 14) * sedimentH;
              const raw = liquidTop + ((frame * speed + phase) % (innerH));
              const drift = noise2D("pdx" + i, frame * 0.02, i) * 10;
              const py = Math.min(raw, settleTarget);
              const pSize = 1.2 + h(i, 9) * 2.6;
              const pOp = interpolate(
                py,
                [liquidTop, ySedimentTop],
                [0.08, 0.55],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
              );
              const col = h(i, 12) > 0.6 ? "#5e4626" : C.sediment;
              return (
                <circle
                  key={"part" + i}
                  cx={colX + drift}
                  cy={py}
                  r={pSize}
                  fill={col}
                  opacity={pOp * sep}
                />
              );
            })}

            {/* WATER band (teal) */}
            <rect
              x={innerX}
              y={yWaterTop}
              width={innerW}
              height={waterH}
              fill="url(#waterLayer)"
              opacity={sep}
            />
            {/* wavy fuel/water interface */}
            <path
              d={(() => {
                const segs = 12;
                let d = `M ${innerX} ${yWaterTop}`;
                for (let i = 0; i <= segs; i++) {
                  const x = innerX + (innerW * i) / segs;
                  const y =
                    yWaterTop +
                    Math.sin(i * 0.9 + frame * 0.05) * 4 * sep +
                    noise2D("wave" + i, frame * 0.02, i) * 3;
                  d += ` L ${x} ${y}`;
                }
                return d;
              })()}
              fill="none"
              stroke="#8fc6dd"
              strokeWidth={2}
              opacity={0.5 * sep}
            />
            {/* water droplets clinging */}
            {Array.from({ length: 10 }).map((_, i) => {
              const wx = innerX + 20 + h(i, 21) * (innerW - 40);
              const wy =
                yWaterTop + 6 + h(i, 22) * Math.max(2, waterH - 12);
              return (
                <circle
                  key={"wd" + i}
                  cx={wx}
                  cy={wy + Math.sin(frame * 0.06 + i) * 2}
                  r={2 + h(i, 23) * 2}
                  fill="#bfe3f0"
                  opacity={0.4 * sep}
                />
              );
            })}

            {/* SEDIMENT band */}
            <rect
              x={innerX}
              y={ySedimentTop}
              width={innerW}
              height={sedimentH}
              fill="url(#sedLayer)"
              opacity={sep}
            />
            {/* sediment granular texture */}
            {Array.from({ length: 70 }).map((_, i) => {
              const gx = innerX + 8 + h(i, 31) * (innerW - 16);
              const gy = ySedimentTop + 4 + h(i, 32) * Math.max(2, sedimentH - 8);
              return (
                <circle
                  key={"grn" + i}
                  cx={gx}
                  cy={gy}
                  r={1 + h(i, 33) * 2.2}
                  fill={h(i, 34) > 0.5 ? "#5a4326" : "#9a784a"}
                  opacity={0.55 * sep}
                />
              );
            })}

            {/* SLUDGE band (oozing) */}
            <rect
              x={innerX}
              y={ySludgeTop}
              width={innerW}
              height={sludgeH + 4}
              fill="url(#sludgeLayer)"
              opacity={sep}
            />
            {/* oozing sludge top surface */}
            <path
              d={(() => {
                const segs = 14;
                let d = `M ${innerX} ${innerBottom} L ${innerX} ${ySludgeTop}`;
                for (let i = 0; i <= segs; i++) {
                  const x = innerX + (innerW * i) / segs;
                  const y =
                    ySludgeTop +
                    Math.sin(i * 1.3 + frame * 0.03) * 6 * sep +
                    noise2D("ooze" + i, frame * 0.012, i) * 5 * sep;
                  d += ` L ${x} ${y}`;
                }
                d += ` L ${innerX + innerW} ${innerBottom} Z`;
                return d;
              })()}
              fill={C.sludge}
              opacity={sep}
            />
            {/* sludge gloss bubbles */}
            {Array.from({ length: 14 }).map((_, i) => {
              const bx = innerX + 14 + h(i, 41) * (innerW - 28);
              const by =
                ySludgeTop + 8 + h(i, 42) * Math.max(2, sludgeH - 6);
              const wob = Math.sin(frame * 0.04 + i) * 2;
              return (
                <circle
                  key={"sb" + i}
                  cx={bx + wob}
                  cy={by}
                  r={2 + h(i, 43) * 4}
                  fill="#4a3a1f"
                  opacity={0.5 * sep}
                />
              );
            })}

            {/* clean-fuel surface shine line */}
            <rect
              x={innerX}
              y={yCleanTop}
              width={innerW}
              height={5}
              fill="url(#surfShine)"
              opacity={interpolate(fillT, [0.4, 1], [0, 0.8], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />

            {/* glass front reflection sweep */}
            <rect
              x={innerX}
              y={innerY}
              width={innerW * 0.35}
              height={innerH}
              fill="#fff"
              opacity={0.04}
            />
          </g>

          {/* inner cavity outline */}
          <rect
            x={innerX}
            y={innerY}
            width={innerW}
            height={innerH}
            rx={20}
            fill="none"
            stroke="#0a131c"
            strokeWidth={3}
            opacity={0.8}
          />

          {/* outlet pipe + clogged filter (lower right of tank) */}
          <g opacity={interpolate(frame, [200, 230], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}>
            <rect
              x={tankX + tankW - 6}
              y={ySedimentTop - 10}
              width={70}
              height={26}
              fill={C.steel}
              stroke="#0a131c"
              strokeWidth={2}
            />
            <rect
              x={tankX + tankW + 64}
              y={ySedimentTop - 26}
              width={46}
              height={58}
              rx={6}
              fill={C.steelDark}
              stroke="#0a131c"
              strokeWidth={2}
            />
            {/* clogged dots in filter */}
            {Array.from({ length: 12 }).map((_, i) => (
              <circle
                key={"clog" + i}
                cx={tankX + tankW + 74 + (i % 4) * 9}
                cy={ySedimentTop - 16 + Math.floor(i / 4) * 13}
                r={2.4}
                fill={C.sediment}
                opacity={0.85}
              />
            ))}
          </g>

          {/* ===== leader lines + callouts (drawn via evolvePath) ===== */}
          <Callouts
            innerX={innerX}
            innerW={innerW}
            yCleanMid={(yCleanTop + yWaterTop) / 2}
            yWaterMid={yWaterTop + waterH / 2}
            ySedMid={ySedimentTop + sedimentH / 2}
            ySludgeMid={ySludgeTop + sludgeH / 2}
            frame={frame}
            fps={fps}
            sep={sep}
          />

          {/* ===== magnifier inset ===== */}
          <g
            opacity={magShow}
            transform={`translate(${magCX * (1 - magShow) * 0.04}, ${
              (1 - magShow) * 30
            }) scale(${0.85 + magShow * 0.15})`}
            style={{ transformOrigin: `${magCX}px ${magCY}px` }}
          >
            {/* connecting line from sludge zone to lens */}
            <line
              x1={sampleX}
              y1={sampleY}
              x2={magCX - magR * 0.7}
              y2={magCY - magR * 0.7}
              stroke={C.gold}
              strokeWidth={2}
              strokeDasharray="6 7"
              opacity={0.6 * magShow}
            />
            <circle
              cx={sampleX}
              cy={sampleY}
              r={10}
              fill="none"
              stroke={C.gold}
              strokeWidth={2}
              opacity={0.7 * magShow}
            />

            {/* lens content */}
            <circle cx={magCX} cy={magCY} r={magR} fill="url(#magContent)" />
            <g clipPath="url(#lensClip)">
              {/* wriggling microbial / gunk colonies */}
              {Array.from({ length: 46 }).map((_, i) => {
                const ang = h(i, 51) * Math.PI * 2;
                const rad = h(i, 52) * magR * 0.92;
                const wob = noise3D("micro" + i, frame * 0.04, i, 0) * 16;
                const wob2 = noise3D("micro2" + i, 0, frame * 0.05, i) * 16;
                const cx = magCX + Math.cos(ang) * rad + wob;
                const cy = magCY + Math.sin(ang) * rad + wob2;
                const rr = 4 + h(i, 53) * 14;
                const col = h(i, 54) > 0.5 ? "#6b5226" : "#3c2e16";
                return (
                  <g key={"mic" + i}>
                    <circle cx={cx} cy={cy} r={rr} fill={col} opacity={0.8} />
                    {/* flagella wriggle */}
                    <path
                      d={`M ${cx} ${cy} q ${
                        8 + Math.sin(frame * 0.12 + i) * 6
                      } ${10} ${
                        2 + Math.cos(frame * 0.1 + i) * 10
                      } ${20}`}
                      fill="none"
                      stroke="#8a6c34"
                      strokeWidth={1.6}
                      opacity={0.5}
                    />
                  </g>
                );
              })}
              {/* drifting fine particulates in lens */}
              {Array.from({ length: 30 }).map((_, i) => {
                const cx =
                  magCX +
                  (h(i, 61) * 2 - 1) * magR +
                  noise2D("lpx" + i, frame * 0.03, i) * 14;
                const cy =
                  magCY +
                  (h(i, 62) * 2 - 1) * magR +
                  noise2D("lpy" + i, i, frame * 0.03) * 14;
                return (
                  <circle
                    key={"lp" + i}
                    cx={cx}
                    cy={cy}
                    r={1 + h(i, 63) * 2}
                    fill="#caa860"
                    opacity={0.35}
                  />
                );
              })}
              {/* lens gloss */}
              <circle cx={magCX} cy={magCY} r={magR} fill="url(#lensGloss)" />
            </g>
            {/* lens rim */}
            <circle
              cx={magCX}
              cy={magCY}
              r={magR}
              fill="none"
              stroke={C.goldDeep}
              strokeWidth={14}
            />
            <circle
              cx={magCX}
              cy={magCY}
              r={magR}
              fill="none"
              stroke={C.gold}
              strokeWidth={5}
            />
            <circle
              cx={magCX}
              cy={magCY}
              r={magR + 9}
              fill="none"
              stroke={C.goldDeep}
              strokeWidth={3}
              opacity={0.6}
            />
            {/* handle */}
            <rect
              x={magCX + magR * 0.66 - 12}
              y={magCY + magR * 0.66 - 12}
              width={26}
              height={150}
              rx={13}
              fill={C.goldDeep}
              transform={`rotate(45 ${magCX + magR * 0.66} ${
                magCY + magR * 0.66
              })`}
            />
            {/* lens label */}
            <text
              x={magCX}
              y={magCY - magR - 26}
              textAnchor="middle"
              fontFamily={mont}
              fontSize={26}
              fontWeight={600}
              fill={C.goldSoft}
              opacity={magShow}
              style={{ letterSpacing: 3 }}
            >
              CONTAMINACION MICROBIANA
            </text>
          </g>

          {/* title kicker top-left */}
          <TitleKicker frame={frame} />

          {/* vignette + grain */}
          <rect x="0" y="0" width="1920" height="1080" fill="url(#vign)" />
          {Array.from({ length: 40 }).map((_, i) => {
            const gx = h(i + frame, 71) * 1920;
            const gy = h(i + frame, 72) * 1080;
            return (
              <rect
                key={"grain" + i}
                x={gx}
                y={gy}
                width={1.5}
                height={1.5}
                fill="#fff"
                opacity={0.03}
              />
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- callouts with evolvePath leader lines ---------- */
const Callouts: React.FC<{
  innerX: number;
  innerW: number;
  yCleanMid: number;
  yWaterMid: number;
  ySedMid: number;
  ySludgeMid: number;
  frame: number;
  fps: number;
  sep: number;
}> = ({
  innerX,
  innerW,
  yCleanMid,
  yWaterMid,
  ySedMid,
  ySludgeMid,
  frame,
  fps,
  sep,
}) => {
  const rightX = innerX + innerW;
  const items = [
    {
      label: "Combustible limpio",
      color: C.goldSoft,
      y: yCleanMid,
      delay: 168,
    },
    { label: "Agua", color: "#8fc6dd", y: yWaterMid, delay: 188 },
    { label: "Sedimentos", color: "#c69a5c", y: ySedMid, delay: 208 },
    { label: "Lodo", color: "#b9a36a", y: ySludgeMid, delay: 228 },
  ];
  const labelX = rightX + 170;

  return (
    <g>
      {items.map((it, i) => {
        const startX = rightX - 6;
        const elbowX = rightX + 90;
        const endX = labelX - 14;
        const d = `M ${startX} ${it.y} L ${elbowX} ${it.y} L ${endX} ${it.y}`;
        const draw = spring({
          frame: frame - it.delay,
          fps,
          config: { damping: 200, stiffness: 90 },
          durationInFrames: 26,
        });
        const { strokeDasharray, strokeDashoffset } = evolvePath(draw, d);
        const labelOp = interpolate(
          frame,
          [it.delay + 14, it.delay + 26],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <g key={"co" + i} opacity={sep > 0.2 ? 1 : 0}>
            {/* dot at layer */}
            <circle
              cx={startX}
              cy={it.y}
              r={5}
              fill={it.color}
              opacity={draw > 0.05 ? 1 : 0}
            />
            <path
              d={d}
              fill="none"
              stroke={it.color}
              strokeWidth={2.5}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
            {/* label chip */}
            <g opacity={labelOp}>
              <rect
                x={labelX - 14}
                y={it.y - 24}
                width={290}
                height={48}
                rx={8}
                fill="#0b1620"
                stroke={it.color}
                strokeWidth={1.5}
                opacity={0.92}
              />
              <text
                x={labelX + 6}
                y={it.y + 7}
                fontFamily={mont}
                fontSize={26}
                fontWeight={600}
                fill={C.offWhite}
                style={{ letterSpacing: 1 }}
              >
                {it.label}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

/* ---------- top-left title kicker ---------- */
const TitleKicker: React.FC<{ frame: number }> = ({ frame }) => {
  const op = interpolate(frame, [16, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const slide = interpolate(frame, [16, 40], [-30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sub = interpolate(frame, [40, 64], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <g transform={`translate(${110 + slide}, 120)`} opacity={op}>
      <rect x={0} y={-34} width={8} height={86} fill={C.gold} />
      <text
        x={28}
        y={6}
        fontFamily={anton}
        fontSize={62}
        fill={C.offWhite}
        style={{ letterSpacing: 1 }}
      >
        EL COMBUSTIBLE
      </text>
      <text
        x={28}
        y={62}
        fontFamily={anton}
        fontSize={62}
        fill={C.gold}
        style={{ letterSpacing: 1 }}
      >
        SE SEPARA
      </text>
      <text
        x={30}
        y={110}
        fontFamily={mont}
        fontSize={24}
        fontWeight={500}
        fill={C.muted}
        opacity={sub}
        style={{ letterSpacing: 4 }}
      >
        Agua · Sedimentos · Lodo en el fondo
      </text>
    </g>
  );
};

export default Scene2Tanque;
