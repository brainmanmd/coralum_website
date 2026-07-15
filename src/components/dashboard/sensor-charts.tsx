function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Point {
  x: number;
  y: number;
}

function genTimeSeries(seed: number, baseline: number, onset: number): Point[] {
  const rnd = mulberry32(seed);
  const pts: Point[] = [];
  const N = 900;
  const T = 50;
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * T;
    let v: number;
    if (t < onset) {
      v = baseline + (rnd() - 0.5) * 0.4;
    } else {
      const env = Math.min((t - onset) / 7, 1);
      const amp = 2.2 + env * 4.2;
      v = (rnd() - 0.5) * 2 * amp;
      if (rnd() < 0.03) v += (rnd() - 0.4) * (14 + env * 12);
    }
    v = Math.max(-8, Math.min(18.5, v));
    pts.push({ x: t, y: v });
  }
  return pts;
}

function interpLog(anchors: [number, number][], f: number): number {
  if (f <= anchors[0][0]) return anchors[0][1];
  const last = anchors[anchors.length - 1];
  if (f >= last[0]) return last[1];
  for (let i = 0; i < anchors.length - 1; i++) {
    const a = anchors[i];
    const b = anchors[i + 1];
    if (f >= a[0] && f <= b[0]) {
      const t = (f - a[0]) / (b[0] - a[0]);
      const lv = Math.log10(a[1]) + (Math.log10(b[1]) - Math.log10(a[1])) * t;
      return Math.pow(10, lv);
    }
  }
  return last[1];
}

function genPsd(seed: number, anchors: [number, number][]): Point[] {
  const rnd = mulberry32(seed);
  const pts: Point[] = [];
  for (let f = 0; f <= 15.001; f += 0.3) {
    let v = interpLog(anchors, f);
    v *= Math.pow(10, (rnd() - 0.5) * 0.16);
    pts.push({ x: f, y: v });
  }
  return pts;
}

function buildPath(sx: (x: number) => number, sy: (y: number) => number, pts: Point[]): string {
  return pts.map((p, i) => (i ? "L" : "M") + sx(p.x).toFixed(1) + " " + sy(p.y).toFixed(1)).join(" ");
}

const MONO_FONT = "'DM Mono', monospace";

export function TimeDomainChart() {
  const W = 500;
  const H = 300;
  const m = { l: 50, r: 14, t: 12, b: 40 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const xD: [number, number] = [0, 50];
  const yD: [number, number] = [-8, 19];
  const sx = (x: number) => m.l + ((x - xD[0]) / (xD[1] - xD[0])) * pw;
  const sy = (y: number) => m.t + ((yD[1] - y) / (yD[1] - yD[0])) * ph;
  const blue = genTimeSeries(11, -2.7, 5.2);
  const coral = genTimeSeries(47, -0.5, 7.0);
  const xTicks = [0, 10, 20, 30, 40, 50];
  const yTicks = [-5, 0, 5, 10, 15];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: "block" }}>
      {yTicks.map((t) => (
        <line key={`gy${t}`} x1={m.l} x2={m.l + pw} y1={sy(t)} y2={sy(t)} stroke="#EFEDE6" strokeWidth={1} />
      ))}
      {xTicks.map((t) => (
        <line key={`gx${t}`} x1={sx(t)} x2={sx(t)} y1={m.t} y2={m.t + ph} stroke="#EFEDE6" strokeWidth={1} />
      ))}
      <path d={buildPath(sx, sy, blue)} fill="none" stroke="#2E80D8" strokeWidth={0.9} strokeLinejoin="round" opacity={0.92} />
      <path d={buildPath(sx, sy, coral)} fill="none" stroke="#E1875A" strokeWidth={0.9} strokeLinejoin="round" opacity={0.9} />
      <rect x={m.l} y={m.t} width={pw} height={ph} fill="none" stroke="#DAD7CE" strokeWidth={1} />
      {xTicks.map((t) => (
        <text key={`xt${t}`} x={sx(t)} y={m.t + ph + 16} textAnchor="middle" fontFamily={MONO_FONT} fontSize={11} fill="#6E8091">
          {t}
        </text>
      ))}
      {yTicks.map((t) => (
        <text key={`yt${t}`} x={m.l - 8} y={sy(t) + 4} textAnchor="end" fontFamily={MONO_FONT} fontSize={11} fill="#6E8091">
          {t}
        </text>
      ))}
      <text x={m.l + pw / 2} y={H - 4} textAnchor="middle" fontFamily={MONO_FONT} fontSize={12} fill="#51677C">
        time (s)
      </text>
      <text
        x={13}
        y={m.t + ph / 2}
        textAnchor="middle"
        fontFamily={MONO_FONT}
        fontSize={11}
        fill="#51677C"
        transform={`rotate(-90 13 ${m.t + ph / 2})`}
      >
        |acc| (g, mean-removed)
      </text>
    </svg>
  );
}

const PSD_BLUE_ANCHORS: [number, number][] = [
  [0, 0.5], [0.6, 1.5], [1.1, 3.2], [1.6, 2.6], [2.1, 3.6], [2.6, 1.4], [3, 1.1], [3.5, 0.9],
  [4, 0.85], [4.5, 0.6], [5, 0.5], [5.5, 0.45], [6, 0.35], [6.5, 0.28], [7, 0.22], [7.5, 0.2],
  [8, 0.19], [8.5, 0.18], [9, 0.16], [9.5, 0.14], [10, 0.13], [11, 0.11], [12, 0.095], [13, 0.085],
  [14, 0.078], [15, 0.072],
];

const PSD_RED_ANCHORS: [number, number][] = [
  [0, 0.03], [0.5, 0.3], [1, 1.2], [1.5, 2.2], [2, 5.0], [2.3, 3.5], [2.6, 1.2], [3, 0.42],
  [3.5, 0.16], [4, 0.12], [4.5, 0.11], [5, 0.1], [5.5, 0.09], [6, 0.075], [6.5, 0.06], [7, 0.05],
  [7.5, 0.055], [8, 0.085], [8.5, 0.05], [9, 0.02], [9.3, 0.05], [9.7, 0.085], [10, 0.09], [10.5, 0.08],
  [11, 0.06], [11.5, 0.05], [12, 0.045], [12.5, 0.035], [13, 0.028], [13.5, 0.04], [14, 0.05], [14.5, 0.02],
  [15, 0.006],
];

export function PsdChart() {
  const W = 520;
  const H = 300;
  const m = { l: 54, r: 16, t: 26, b: 40 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;
  const xD: [number, number] = [0, 15];
  const lgHi = 1;
  const lgLo = -5;
  const span = lgHi - lgLo;
  const sx = (x: number) => m.l + ((x - xD[0]) / (xD[1] - xD[0])) * pw;
  const sy = (v: number) => m.t + ((lgHi - Math.log10(v)) / span) * ph;
  const blue = genPsd(5, PSD_BLUE_ANCHORS);
  const coral = genPsd(9, PSD_RED_ANCHORS);
  const xTicks = [0, 2, 4, 6, 8, 10, 12, 14];
  const yExp = [1, 0, -1, -2, -3, -4, -5];
  const d1 = sx(3.6);
  const d2 = sx(9.0);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W, display: "block" }}>
      {yExp.map((e) => (
        <line
          key={`gy${e}`}
          x1={m.l}
          x2={m.l + pw}
          y1={sy(Math.pow(10, e))}
          y2={sy(Math.pow(10, e))}
          stroke="#EFEDE6"
          strokeWidth={1}
        />
      ))}
      {xTicks.map((t) => (
        <line key={`gx${t}`} x1={sx(t)} x2={sx(t)} y1={m.t} y2={m.t + ph} stroke="#EFEDE6" strokeWidth={1} />
      ))}
      <line x1={d1} x2={d1} y1={m.t} y2={m.t + ph} stroke="#2E80D8" strokeWidth={2} strokeDasharray="2 4" strokeLinecap="round" />
      <line x1={d2} x2={d2} y1={m.t} y2={m.t + ph} stroke="#2E80D8" strokeWidth={2} strokeDasharray="2 4" strokeLinecap="round" />
      <text x={(d1 + d2) / 2} y={16} textAnchor="middle" fontFamily="'DM Sans', sans-serif" fontWeight={700} fontSize={14} fill="#2E80D8">
        Dyskinesia Range
      </text>
      <path d={buildPath(sx, sy, blue)} fill="none" stroke="#2E80D8" strokeWidth={1.6} strokeLinejoin="round" />
      <path d={buildPath(sx, sy, coral)} fill="none" stroke="#E1875A" strokeWidth={1.6} strokeLinejoin="round" />
      <rect x={m.l} y={m.t} width={pw} height={ph} fill="none" stroke="#DAD7CE" strokeWidth={1} />
      {xTicks.map((t) => (
        <text key={`xt${t}`} x={sx(t)} y={m.t + ph + 16} textAnchor="middle" fontFamily={MONO_FONT} fontSize={11} fill="#6E8091">
          {t}
        </text>
      ))}
      {yExp.map((e) => (
        <text
          key={`yt${e}`}
          x={m.l - 8}
          y={sy(Math.pow(10, e)) + 4}
          textAnchor="end"
          fontFamily={MONO_FONT}
          fontSize={11}
          fill="#6E8091"
        >
          <tspan>10</tspan>
          <tspan dy={-4} fontSize={8}>
            {e}
          </tspan>
        </text>
      ))}
      <text x={m.l + pw / 2} y={H - 4} textAnchor="middle" fontFamily={MONO_FONT} fontSize={12} fill="#51677C">
        frequency (Hz)
      </text>
      <text
        x={15}
        y={m.t + ph / 2}
        textAnchor="middle"
        fontFamily={MONO_FONT}
        fontSize={12}
        fill="#51677C"
        transform={`rotate(-90 15 ${m.t + ph / 2})`}
      >
        PSD
      </text>
    </svg>
  );
}
