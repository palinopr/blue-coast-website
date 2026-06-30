import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { noise2D, noise3D } from "@remotion/noise";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMont } from "@remotion/google-fonts/Montserrat";

const { fontFamily: ANTON } = loadAnton();
const { fontFamily: MONT } = loadMont();

// ---- shared palette ----
const skyTop = "#0a1826";
const skyBot = "#04070c";
const cloud = "#16263a";
const steelDark = "#16222f";
const steel = "#27435c";
const steelLite = "#3f6684";
const gold = "#c9a14a";
const goldSoft = "#e7c477";
const goldDeep = "#5c4420";
const goldMid = "#a8843a";
const windowWarm = "255,206,110";
const redCross = "#e0484f";
const offWhite = "#f2efe9";
const muted = "#8aa0b4";
const cleanFuel = "#d8a93c";

// deterministic hash
const h = (i: number, s = 1) => {
  const v = Math.sin(i * 127.1 + s * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

export const Scene5Generador: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  // ---- global fade in/out ----
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 12, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const globalOpacity = fadeIn * fadeOut;

  // ---- engine running pulse (always alive) ----
  const rpm = frame * 0.9; // fan rotation driver
  // vibration shake from noise, settles a touch but stays alive
  const shakeX = noise2D("shx", frame * 0.18, 0) * 2.4;
  const shakeY = noise2D("shy", frame * 0.21, 9) * 1.8;
  const idleThrob = Math.sin(frame * 0.55) * 0.6;

  // ---- warm glow build behind generator ----
  const cityGlow = interpolate(frame, [10, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const haloPulse =
    0.5 + 0.5 * Math.sin(frame * 0.12) * 0.4 + cityGlow * 0.35;

  // ---- generator entrance (springs up from below, settles) ----
  const genIn = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 90 },
    durationInFrames: 50,
  });
  const genY = interpolate(genIn, [0, 1], [120, 0]);
  const genScale = interpolate(genIn, [0, 1], [0.92, 1]);

  // ---- count up stats on springs ----
  const stat1Start = 70;
  const stat1Spr = spring({
    frame: frame - stat1Start,
    fps,
    config: { damping: 120, stiffness: 60 },
    durationInFrames: 70,
  });
  const years = Math.round(interpolate(stat1Spr, [0, 1], [0, 15]));

  const stat2Start = 120;
  const stat2Spr = spring({
    frame: frame - stat2Start,
    fps,
    config: { damping: 120, stiffness: 55 },
    durationInFrames: 90,
  });
  const tanks = Math.round(interpolate(stat2Spr, [0, 1], [0, 500]));

  // entrance pop for stat blocks
  const stat1Pop = spring({
    frame: frame - stat1Start,
    fps,
    config: { damping: 140, stiffness: 180 },
    durationInFrames: 30,
  });
  const stat2Pop = spring({
    frame: frame - stat2Start,
    fps,
    config: { damping: 140, stiffness: 180 },
    durationInFrames: 30,
  });

  // ---- fuel line flowing dashes ----
  const dashOffset = -(frame * 3.2) % 1000;

  // ---- exhaust smoke puffs (deterministic cycling) ----
  const PUFFS = 7;
  const puffPeriod = 26;

  // ---- gauges ----
  const gauge1 = 0.32 + 0.28 * (0.5 + 0.5 * Math.sin(frame * 0.18 + 1));
  const gauge2 = 0.4 + 0.25 * (0.5 + 0.5 * Math.sin(frame * 0.13 + 3));

  // green indicator blink phases
  const led = (i: number) =>
    0.45 + 0.55 * (0.5 + 0.5 * Math.sin(frame * (0.25 + i * 0.07) + i * 2));

  // background buildings parallax drift
  const farDrift = noise2D("far", frame * 0.01, 0) * 6;
  const midDrift = noise2D("mid", frame * 0.015, 4) * 10;

  // hero group transform
  const heroTransform = `translate(${40 + shakeX + idleThrob}px, ${
    560 + genY + shakeY
  }px) scale(${genScale})`;

  return (
    <AbsoluteFill style={{ backgroundColor: skyBot, opacity: globalOpacity }}>
      <svg
        viewBox="0 0 1920 1080"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={skyTop} />
            <stop offset="1" stopColor={skyBot} />
          </linearGradient>
          <radialGradient id="cityHalo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={`rgba(${windowWarm},0.55)`} />
            <stop offset="0.5" stopColor={`rgba(${windowWarm},0.18)`} />
            <stop offset="1" stopColor={`rgba(${windowWarm},0)`} />
          </radialGradient>
          <radialGradient id="genHalo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={`rgba(${windowWarm},0.5)`} />
            <stop offset="1" stopColor={`rgba(${windowWarm},0)`} />
          </radialGradient>
          <linearGradient id="steelBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={steelLite} />
            <stop offset="0.5" stopColor={steel} />
            <stop offset="1" stopColor={steelDark} />
          </linearGradient>
          <linearGradient id="steelPanel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={steel} />
            <stop offset="1" stopColor={steelDark} />
          </linearGradient>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={goldSoft} />
            <stop offset="0.5" stopColor={gold} />
            <stop offset="1" stopColor={goldMid} />
          </linearGradient>
          <radialGradient id="fanGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={`rgba(${windowWarm},0.35)`} />
            <stop offset="1" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id="softBig" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>

        {/* ---- sky ---- */}
        <rect x="0" y="0" width="1920" height="1080" fill="url(#sky)" />

        {/* ---- stars (deterministic, far layer) ---- */}
        {Array.from({ length: 70 }).map((_, i) => {
          const x = h(i, 2) * 1920;
          const y = h(i, 5) * 520;
          const tw = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(frame * 0.05 + i));
          const r = 0.6 + h(i, 9) * 1.4;
          return (
            <circle
              key={`st${i}`}
              cx={x + farDrift * 0.3}
              cy={y}
              r={r}
              fill={offWhite}
              opacity={tw * 0.5}
            />
          );
        })}

        {/* ---- city warm halo behind generator ---- */}
        <ellipse
          cx="760"
          cy="640"
          rx="900"
          ry="520"
          fill="url(#cityHalo)"
          opacity={cityGlow * (0.6 + haloPulse * 0.3)}
        />

        {/* ---- FAR skyline ---- */}
        <g transform={`translate(${farDrift},0)`} opacity={0.85}>
          {Array.from({ length: 16 }).map((_, i) => {
            const bw = 70 + h(i, 11) * 60;
            const bh = 140 + h(i, 13) * 220;
            const bx = i * 122 - 40;
            const by = 720 - bh;
            return (
              <g key={`far${i}`}>
                <rect
                  x={bx}
                  y={by}
                  width={bw}
                  height={bh}
                  fill={cloud}
                  opacity={0.9}
                />
                {/* warm windows lighting up with city glow */}
                {Array.from({ length: 6 }).map((_, w) => {
                  const wx = bx + 10 + (w % 3) * (bw / 3);
                  const wy = by + 18 + Math.floor(w / 3) * 40;
                  const lit =
                    h(i * 7 + w, 17) > 0.45
                      ? cityGlow * (0.4 + h(i + w, 3) * 0.6)
                      : 0;
                  return (
                    <rect
                      key={`fw${i}-${w}`}
                      x={wx}
                      y={wy}
                      width={bw / 6}
                      height={16}
                      fill={`rgba(${windowWarm},1)`}
                      opacity={lit}
                    />
                  );
                })}
              </g>
            );
          })}
        </g>

        {/* ---- MID buildings (hospital w/ red cross) ---- */}
        <g transform={`translate(${midDrift},0)`}>
          {/* hospital block */}
          <rect x="980" y="430" width="300" height="300" fill={steelDark} />
          <rect x="980" y="430" width="300" height="300" fill={cloud} opacity={0.4} />
          {/* hospital windows grid */}
          {Array.from({ length: 28 }).map((_, i) => {
            const col = i % 7;
            const row = Math.floor(i / 7);
            const lit =
              h(i, 23) > 0.35
                ? cityGlow * (0.5 + 0.5 * Math.sin(frame * 0.1 + i))
                : 0.05;
            return (
              <rect
                key={`hw${i}`}
                x={998 + col * 40}
                y={450 + row * 60}
                width={26}
                height={38}
                fill={`rgba(${windowWarm},1)`}
                opacity={lit}
              />
            );
          })}
          {/* red cross sign */}
          <g transform="translate(1130,392)">
            <rect
              x="-26"
              y="-26"
              width="52"
              height="52"
              rx="6"
              fill={offWhite}
              opacity={0.92}
            />
            <rect x="-18" y="-6" width="36" height="12" fill={redCross} />
            <rect x="-6" y="-18" width="12" height="36" fill={redCross} />
            <rect
              x="-30"
              y="-30"
              width="60"
              height="60"
              rx="8"
              fill={`rgba(${windowWarm},0.5)`}
              opacity={cityGlow}
              filter="url(#soft)"
            />
          </g>

          {/* secondary towers */}
          <rect x="1300" y="380" width="120" height="350" fill={steelDark} />
          <rect x="1440" y="470" width="150" height="260" fill={cloud} opacity={0.7} />
          {Array.from({ length: 18 }).map((_, i) => {
            const col = i % 3;
            const row = Math.floor(i / 3);
            const lit = h(i, 31) > 0.4 ? cityGlow * (0.35 + h(i, 7) * 0.55) : 0.06;
            return (
              <rect
                key={`tw${i}`}
                x={1316 + col * 35}
                y={400 + row * 50}
                width={22}
                height={30}
                fill={`rgba(${windowWarm},1)`}
                opacity={lit}
              />
            );
          })}
        </g>

        {/* ---- ground plane ---- */}
        <rect x="0" y="720" width="1920" height="360" fill={skyBot} />
        <rect x="0" y="720" width="1920" height="6" fill={steel} opacity={0.5} />
        {/* warm reflection pool under generator */}
        <ellipse
          cx="430"
          cy="900"
          rx="520"
          ry="70"
          fill={`rgba(${windowWarm},1)`}
          opacity={0.1 + cityGlow * 0.12}
          filter="url(#softBig)"
        />

        {/* ============ HERO GENERATOR ============ */}
        {/* glow halo */}
        <ellipse
          cx={430 + shakeX}
          cy={760}
          rx={460}
          ry={360}
          fill="url(#genHalo)"
          opacity={(0.35 + haloPulse * 0.25) * genIn}
        />

        <g
          style={{ transform: heroTransform, transformBox: "fill-box" }}
          opacity={genIn}
        >
          {/* skid base */}
          <rect x="-30" y="320" width="720" height="40" rx="6" fill={steelDark} />
          <rect x="-30" y="350" width="720" height="14" fill="#0c141d" />
          {/* base feet */}
          <rect x="0" y="356" width="40" height="22" fill="#0c141d" />
          <rect x="620" y="356" width="40" height="22" fill="#0c141d" />

          {/* ---- main enclosure body ---- */}
          <rect
            x="40"
            y="60"
            width="560"
            height="270"
            rx="14"
            fill="url(#steelBody)"
            stroke="#0c141d"
            strokeWidth="3"
          />
          {/* top cap / roof */}
          <rect x="34" y="44" width="572" height="28" rx="8" fill={steelDark} />
          <rect x="34" y="44" width="572" height="8" rx="4" fill={steelLite} opacity={0.6} />

          {/* louvered side panel (left) */}
          <g>
            {Array.from({ length: 9 }).map((_, i) => (
              <rect
                key={`lv${i}`}
                x="60"
                y={88 + i * 24}
                width="170"
                height="14"
                rx="3"
                fill={steelDark}
                stroke={steelLite}
                strokeWidth="1"
                opacity={0.9}
              />
            ))}
            {/* highlight sweep across louvers */}
            <rect
              x="60"
              y="88"
              width="170"
              height="216"
              fill={`rgba(${windowWarm},0.12)`}
              opacity={0.4 + 0.4 * Math.sin(frame * 0.1)}
            />
          </g>

          {/* ---- radiator + spinning fan (center-right of body) ---- */}
          <g transform="translate(390,195)">
            {/* radiator housing */}
            <circle r="112" fill={steelDark} stroke="#0c141d" strokeWidth="4" />
            <circle r="100" fill="#0b1119" />
            {/* radiator grille rings */}
            {Array.from({ length: 5 }).map((_, i) => (
              <circle
                key={`rg${i}`}
                r={28 + i * 17}
                fill="none"
                stroke={steel}
                strokeWidth="2"
                opacity={0.6}
              />
            ))}
            {/* fan glow */}
            <circle r="96" fill="url(#fanGlow)" opacity={0.5 + 0.3 * Math.sin(frame * 0.3)} />

            {/* SPINNING fan blades */}
            <g transform={`rotate(${rpm})`}>
              {Array.from({ length: 6 }).map((_, i) => {
                const a = (i / 6) * 360;
                return (
                  <g key={`bl${i}`} transform={`rotate(${a})`}>
                    <path
                      d="M0,0 Q34,-22 86,-12 Q60,10 0,8 Z"
                      fill={steelLite}
                      opacity={0.92}
                      stroke="#0c141d"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}
              {/* motion-blur ghost blades */}
              <g transform={`rotate(${-rpm * 0.4})`} opacity={0.18}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <g key={`bg${i}`} transform={`rotate(${(i / 6) * 360})`}>
                    <path d="M0,0 Q34,-22 86,-12 Q60,10 0,8 Z" fill={offWhite} />
                  </g>
                ))}
              </g>
              {/* hub */}
              <circle r="20" fill={steelDark} stroke={gold} strokeWidth="2" />
              <circle r="8" fill={goldMid} />
            </g>
          </g>

          {/* ---- control panel (left-front) ---- */}
          <g transform="translate(250,120)">
            <rect
              x="0"
              y="0"
              width="118"
              height="150"
              rx="8"
              fill="url(#steelPanel)"
              stroke="#0c141d"
              strokeWidth="2"
            />
            <rect x="6" y="6" width="106" height="40" rx="4" fill="#08323a" />
            {/* digital readout text */}
            <text
              x="59"
              y="32"
              fill={`rgba(${windowWarm},1)`}
              fontFamily={MONT}
              fontSize="18"
              fontWeight={700}
              textAnchor="middle"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {Math.round(58 + gauge1 * 8)} Hz
            </text>

            {/* green indicator LEDs */}
            {Array.from({ length: 4 }).map((_, i) => (
              <g key={`led${i}`} transform={`translate(${18 + i * 28},66)`}>
                <circle r="9" fill="#0c2a18" />
                <circle r="6" fill="#39d97a" opacity={led(i)} />
                <circle r="11" fill="#39d97a" opacity={led(i) * 0.25} filter="url(#soft)" />
              </g>
            ))}

            {/* two moving gauges */}
            {[gauge1, gauge2].map((g, i) => {
              const ang = interpolate(g, [0, 1], [-120, 120]);
              return (
                <g key={`ga${i}`} transform={`translate(${33 + i * 52},112)`}>
                  <circle r="20" fill="#0b1119" stroke={steel} strokeWidth="2" />
                  {/* ticks */}
                  {Array.from({ length: 7 }).map((_, t) => {
                    const ta = -120 + t * 40;
                    const rad = (ta * Math.PI) / 180;
                    return (
                      <line
                        key={`tk${i}-${t}`}
                        x1={Math.sin(rad) * 14}
                        y1={-Math.cos(rad) * 14}
                        x2={Math.sin(rad) * 18}
                        y2={-Math.cos(rad) * 18}
                        stroke={muted}
                        strokeWidth="1.5"
                      />
                    );
                  })}
                  {/* needle */}
                  <line
                    x1="0"
                    y1="2"
                    x2={Math.sin((ang * Math.PI) / 180) * 16}
                    y2={-Math.cos((ang * Math.PI) / 180) * 16}
                    stroke={goldSoft}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle r="3" fill={gold} />
                </g>
              );
            })}
          </g>

          {/* body seam lines / rivets */}
          <line x1="40" y1="150" x2="600" y2="150" stroke="#0c141d" strokeWidth="1.5" opacity={0.4} />
          {Array.from({ length: 12 }).map((_, i) => (
            <circle key={`rv${i}`} cx={60 + i * 47} cy={70} r={2.2} fill="#0c141d" opacity={0.5} />
          ))}

          {/* "BLUE COAST" badge */}
          <g transform="translate(470,290)">
            <rect x="-70" y="-18" width="150" height="34" rx="6" fill={steelDark} stroke={gold} strokeWidth="1.5" />
            <text
              x="5"
              y="6"
              fill={goldSoft}
              fontFamily={MONT}
              fontSize="15"
              fontWeight={800}
              letterSpacing="1.5"
              textAnchor="middle"
            >
              BLUE COAST
            </text>
          </g>

          {/* ---- exhaust stack (right side) ---- */}
          <g transform="translate(610,40)">
            <rect x="0" y="0" width="34" height="290" rx="6" fill={steelDark} stroke="#0c141d" strokeWidth="2" />
            <rect x="-6" y="-14" width="46" height="22" rx="6" fill={steel} />
            <ellipse cx="17" cy="-14" rx="20" ry="7" fill="#0b1119" />
            {/* heat shimmer band */}
            <rect
              x="2"
              y="20"
              width="30"
              height="250"
              fill={`rgba(${windowWarm},0.08)`}
              opacity={0.4 + 0.3 * Math.sin(frame * 0.2)}
            />
          </g>
        </g>

        {/* ---- exhaust smoke puffs (deterministic cycling, above hero so they rise on top) ---- */}
        <g style={{ transform: `translate(${40 + shakeX}px, ${560 + genY}px)` }} opacity={genIn}>
          {Array.from({ length: PUFFS }).map((_, i) => {
            const life = ((frame - i * 18) % (puffPeriod * 3)) / (puffPeriod * 3);
            const lc = life < 0 ? life + 1 : life;
            const rise = lc * 220;
            const drift = noise2D("smoke", lc * 3 + i, i) * 40;
            const grow = 12 + lc * 46;
            const op = Math.sin(lc * Math.PI) * 0.4;
            return (
              <circle
                key={`pf${i}`}
                cx={627 + drift}
                cy={26 - rise}
                r={grow}
                fill={`rgba(${windowWarm},${0.06 + op * 0.4})`}
                opacity={op}
                filter="url(#soft)"
              />
            );
          })}
        </g>

        {/* ---- glowing GOLD fuel line feeding the generator (flowing dashes) ---- */}
        <g opacity={genIn}>
          {/* tank source bottom-right going to generator base */}
          <path
            id="fuelPath"
            d="M 1500 980 C 1300 1000, 1050 980, 880 940 C 740 905, 660 905, 560 905"
            fill="none"
            stroke={goldDeep}
            strokeWidth="14"
            strokeLinecap="round"
          />
          <path
            d="M 1500 980 C 1300 1000, 1050 980, 880 940 C 740 905, 660 905, 560 905"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity={0.9}
          />
          {/* flowing energized dashes */}
          <path
            d="M 1500 980 C 1300 1000, 1050 980, 880 940 C 740 905, 660 905, 560 905"
            fill="none"
            stroke={goldSoft}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="6 34"
            strokeDashoffset={dashOffset}
            opacity={0.95}
          />
          {/* glow underlay */}
          <path
            d="M 1500 980 C 1300 1000, 1050 980, 880 940 C 740 905, 660 905, 560 905"
            fill="none"
            stroke={`rgba(${windowWarm},0.4)`}
            strokeWidth="16"
            strokeLinecap="round"
            opacity={0.5 + 0.2 * Math.sin(frame * 0.25)}
            filter="url(#soft)"
          />
          {/* little fuel drum source */}
          <g transform="translate(1500,930)">
            <rect x="0" y="0" width="90" height="110" rx="10" fill="url(#steelBody)" stroke="#0c141d" strokeWidth="3" />
            <ellipse cx="45" cy="0" rx="45" ry="12" fill={steelLite} />
            <rect x="14" y="34" width="62" height="40" rx="4" fill={cleanFuel} opacity={0.85} />
            <rect x="14" y="34" width="62" height={interpolate(gauge2, [0, 1], [8, 38])} rx="4" fill={goldSoft} opacity={0.5} />
            <text x="45" y="98" fill={muted} fontFamily={MONT} fontSize="11" fontWeight={700} textAnchor="middle">
              DIESEL
            </text>
          </g>
        </g>

        {/* ============ STAT TYPOGRAPHY (right) ============ */}
        {/* STAT 1 : +15 anos */}
        <g
          transform={`translate(1180, ${
            230 - (1 - stat1Pop) * 40
          })`}
          opacity={stat1Pop}
        >
          {/* gold accent rule */}
          <rect x="0" y="-46" width={interpolate(stat1Pop, [0, 1], [0, 90])} height="6" fill={gold} />
          <text
            x="0"
            y="120"
            fill={offWhite}
            fontFamily={ANTON}
            fontSize="180"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            <tspan fill={gold}>+</tspan>
            {years}
          </text>
          {/* glow echo */}
          <text
            x="0"
            y="120"
            fill={`rgba(${windowWarm},0.35)`}
            fontFamily={ANTON}
            fontSize="180"
            filter="url(#soft)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            <tspan>+</tspan>
            {years}
          </text>
          <text
            x="6"
            y="168"
            fill={muted}
            fontFamily={MONT}
            fontSize="30"
            fontWeight={600}
            letterSpacing="6"
          >
            ANOS DE EXPERIENCIA
          </text>
        </g>

        {/* STAT 2 : 500+ tanques */}
        <g
          transform={`translate(1180, ${
            520 - (1 - stat2Pop) * 40
          })`}
          opacity={stat2Pop}
        >
          <rect x="0" y="-46" width={interpolate(stat2Pop, [0, 1], [0, 90])} height="6" fill={gold} />
          <text
            x="0"
            y="120"
            fill={offWhite}
            fontFamily={ANTON}
            fontSize="180"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {tanks}
            <tspan fill={gold}>+</tspan>
          </text>
          <text
            x="0"
            y="120"
            fill={`rgba(${windowWarm},0.35)`}
            fontFamily={ANTON}
            fontSize="180"
            filter="url(#soft)"
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {tanks}
            <tspan>+</tspan>
          </text>
          <text
            x="6"
            y="168"
            fill={muted}
            fontFamily={MONT}
            fontSize="30"
            fontWeight={600}
            letterSpacing="6"
          >
            TANQUES INTERVENIDOS
          </text>
        </g>

        {/* small kicker label top-left */}
        <g
          opacity={interpolate(frame, [20, 45], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })}
          transform="translate(80,90)"
        >
          <rect x="0" y="-22" width="46" height="3" fill={gold} />
          <text
            x="0"
            y="6"
            fill={muted}
            fontFamily={MONT}
            fontSize="22"
            fontWeight={600}
            letterSpacing="8"
          >
            EN TODA LA ISLA
          </text>
        </g>

        {/* ---- atmospheric foreground haze / vignette ---- */}
        <rect
          x="0"
          y="0"
          width="1920"
          height="1080"
          fill="url(#sky)"
          opacity={0.12}
          style={{ mixBlendMode: "multiply" as React.CSSProperties["mixBlendMode"] }}
        />
        <radialGradient id="vig" cx="0.5" cy="0.52" r="0.72">
          <stop offset="0.55" stopColor="rgba(0,0,0,0)" />
          <stop offset="1" stopColor="rgba(0,0,0,0.55)" />
        </radialGradient>
        <rect x="0" y="0" width="1920" height="1080" fill="url(#vig)" />

        {/* faint floating dust motes (near layer parallax) */}
        {Array.from({ length: 22 }).map((_, i) => {
          const px = (h(i, 41) * 1920 + noise3D("dust", i, frame * 0.01, 0) * 60) % 1920;
          const py =
            (h(i, 43) * 1080 + frame * (0.3 + h(i, 7) * 0.6)) % 1080;
          const op = (0.1 + h(i, 3) * 0.2) * cityGlow;
          return (
            <circle
              key={`dm${i}`}
              cx={px}
              cy={py}
              r={1 + h(i, 9) * 2}
              fill={`rgba(${windowWarm},1)`}
              opacity={op}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
