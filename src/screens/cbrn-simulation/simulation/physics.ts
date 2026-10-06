// Ported verbatim from pmbc_web's
// `features/thongtin/mophongphattan/mophongphattan.component.ts` (lines
// 33-594) — chemical dispersion physics (Brighton puddle evaporation,
// Bernoulli/LEAKR/HNE/DIERS tank release, Wilson pipeline blowdown,
// Gaussian plume, DEGADIS-style heavy-gas dispersion). Keep this file a
// 1:1 port — do not "clean up" the math, it must match the web reference
// exactly. Only naming/formatting (semicolons→as-is, `const`/`function`
// kept as-is) was preserved; only added TS types where the original used
// implicit `any`.

import type { Chemical, ContourPoint, ScenarioKey, SimulationStep } from './types';

export const R_GAS = 8.314;
export const P_ATM = 101325.0;
export const AIR_DENSITY = 1.2;
export const G = 9.8;

// --- Pasquill atmospheric stability class ---

const DAY_TABLE: [number, number, Record<string, string>][] = [
  [0, 2, { manh: 'A', vua: 'A-B', nhe: 'B' }],
  [2, 3, { manh: 'A-B', vua: 'B', nhe: 'C' }],
  [3, 5, { manh: 'B', vua: 'B-C', nhe: 'C' }],
  [5, 6, { manh: 'C', vua: 'C-D', nhe: 'D' }],
  [6, 999, { manh: 'C', vua: 'D', nhe: 'D' }],
];

const NIGHT_TABLE: [number, number, Record<string, string>][] = [
  [0, 2, { nhieu_may: 'E', it_may: 'F' }],
  [2, 999, { nhieu_may: 'D', it_may: 'D' }],
];

const STAB_ORDER = 'ABCDEF';

function mostStable(candidates: string): string {
  const letters = [...candidates].filter((c) => STAB_ORDER.includes(c));
  return letters.reduce((a, b) =>
    STAB_ORDER.indexOf(b) > STAB_ORDER.indexOf(a) ? b : a
  );
}

export function pasquillStabilityClass(
  U10: number,
  isDaytime: boolean,
  insolation: string,
  cloudCoverPct: number
): string {
  if (isDaytime) {
    for (const [lo, hi, row] of DAY_TABLE) {
      if (U10 >= lo && U10 < hi) return mostStable(row[insolation]);
    }
  } else {
    const key = cloudCoverPct > 50 ? 'nhieu_may' : 'it_may';
    for (const [lo, hi, row] of NIGHT_TABLE) {
      if (U10 >= lo && U10 < hi) return mostStable(row[key]);
    }
  }
  return 'D';
}

export function deaconFrictionVelocity(U10: number, z0 = 0.03, k = 0.4): number {
  return (k * U10) / Math.log(10.0 / z0);
}

// --- Brighton puddle evaporation ---

export const BRIGHTON_N: Record<string, number> = {
  A: 0.108,
  B: 0.112,
  C: 0.12,
  D: 0.142,
  E: 0.203,
  F: 0.253,
};
const K_VK = 0.4,
  SC_T = 0.85,
  GAMMA_E = 0.577;
const KAPPA_WATER = 2.39e-5,
  MW_WATER = 0.018015,
  NU_AIR = 1.5e-5;

function deaconFrictionVelocityPuddle(U: number, stability: string, z = 10.0): number {
  const n = BRIGHTON_N[stability] ?? 0.142;
  return 0.03 * U * Math.pow(10.0 / z, n);
}

function fSc(Sc: number, Re0: number): number {
  const fSmooth = (sc: number) =>
    Math.pow(3.85 * Math.pow(sc, 1 / 3) - 1.3, 2) + (SC_T / K_VK) * Math.log(0.13 * sc);
  const fRough = (sc: number, re0: number) =>
    7.3 * Math.pow(re0, 0.25) * Math.sqrt(sc) - 5 * SC_T;
  if (Re0 < 0.13) return fSmooth(Sc);
  if (Re0 > 2) return fRough(Sc, Re0);
  const fLo = fSmooth(Sc),
    fHi = fRough(Sc, 2.0);
  const frac = (Re0 - 0.13) / (2.0 - 0.13);
  return fLo + frac * (fHi - fLo);
}

function brightonMassTransferCoefficient(
  n: number,
  D_P: number,
  z0: number,
  U_star: number,
  Mc: number
): number {
  const kappa_c = KAPPA_WATER * Math.sqrt(MW_WATER / Mc);
  const Sc = kappa_c / NU_AIR;
  const Re0 = (U_star * z0) / NU_AIR;
  const fScVal = fSc(Sc, Re0);
  const Lambda =
    1 / n + 1 + 2 * Math.log(1 + n) - 2 * GAMMA_E + (K_VK / SC_T) * (1 + n) * fScVal;
  const X1 = (n * K_VK ** 2 * D_P) / (SC_T * z0 * Math.exp(1 / n));
  const Y = Lambda + Math.log(X1);
  const term1 =
    0.5 - (1 / Math.PI) * Math.atan(Y / Math.PI) + (1 - GAMMA_E) / (Y ** 2 + Math.PI ** 2);
  const term2 =
    ((1 + (1 - GAMMA_E) ** 2 + Math.PI ** 2 / 6) * Y) / (Y ** 2 + Math.PI ** 2) ** 2;
  return (K_VK / SC_T) * (1 + n) * (term1 + term2);
}

function saturationConcentration(chem: Chemical, T: number): number {
  return (chem.vp_pa * chem.mw) / (R_GAS * T);
}

// Clausius–Clapeyron extrapolation of vapor pressure to temperature `T`,
// anchored at the chemical's (vp_pa, vp_ref_K) reference point and its
// boiling point (bp_K, where P = P_ATM). Falls back to the reference
// pressure unmodified when there isn't enough data to anchor a curve.
export function vaporPressureAtTemperature(
  chem: Chemical,
  T: number
): { P: number; extrapolated: boolean } {
  const T_bp = chem.bp_K,
    T_ref = chem.vp_ref_K,
    P_ref = chem.vp_pa;
  if (T_bp == null || T_ref == null || Math.abs(1.0 / T_ref - 1.0 / T_bp) < 1e-9) {
    return { P: P_ref, extrapolated: false };
  }
  const B = (Math.log(P_ATM) - Math.log(P_ref)) / (1.0 / T_ref - 1.0 / T_bp);
  const A = Math.log(P_ATM) + B / T_bp;
  return { P: Math.exp(A - B / T), extrapolated: true };
}

export function puddleEvaporationRate(
  chem: Chemical,
  U10: number,
  area: number,
  stability: string,
  z0 = 0.03,
  T = 293.0,
  P_a = P_ATM
): number {
  const D_P = 2 * Math.sqrt(area / Math.PI);
  const n = BRIGHTON_N[stability] ?? 0.142;
  const U_star = deaconFrictionVelocityPuddle(U10, stability, 10.0);
  const j_bar = brightonMassTransferCoefficient(n, D_P, z0, U_star, chem.mw);
  const Pv = chem.vp_pa;
  const j_c = -j_bar * (P_a / Pv) * Math.log(1 - Pv / P_a);
  const Cs = saturationConcentration(chem, T);
  return Cs * U_star * j_c * area;
}

// --- Bernoulli liquid release (draining tank) ---

function bernoulliLiquidRelease(
  C_dis: number,
  A_f: number,
  rho_l: number,
  P_h: number,
  P_a: number
): number {
  const dp = Math.max(P_h - P_a, 0.0);
  return C_dis * A_f * Math.sqrt(2.0 * rho_l * dp);
}

function submergedHolePressure(
  P_vapor: number,
  rho_l: number,
  hAboveHole: number,
  P_a = P_ATM,
  g = G
): number {
  if (hAboveHole <= 0) return P_a;
  const P_h_natural = P_vapor + rho_l * g * hAboveHole;
  if (P_h_natural <= P_a) return P_h_natural;
  return Math.max(P_h_natural, 1.01 * P_a);
}

export function drainingTankLiquidTimeSeries(
  C_dis: number,
  A_f: number,
  rho_l: number,
  P_vapor: number,
  tankArea: number,
  holeHeight: number,
  initialHeight: number,
  P_a = P_ATM,
  g = G,
  dt = 2.0,
  maxDuration = 3600.0
): { times: number[]; rates: number[] } {
  let liquidHeight = initialHeight,
    t = 0.0;
  const times: number[] = [],
    rates: number[] = [];
  while (t < maxDuration) {
    const hAboveHole = liquidHeight - holeHeight;
    if (hAboveHole <= 0) break;
    const P_h = submergedHolePressure(P_vapor, rho_l, hAboveHole, P_a, g);
    const Q = bernoulliLiquidRelease(C_dis, A_f, rho_l, P_h, P_a);
    if (Q <= 0) break;
    times.push(t);
    rates.push(Q);
    liquidHeight -= (Q / (rho_l * tankArea)) * dt;
    t += dt;
  }
  return { times, rates };
}

const DEPTH_STOP_M = 0.005;

export function spreadingPuddleTimeSeries(
  chem: Chemical,
  Q_tank: number | { times: number[]; rates: number[] },
  U10: number,
  stability: string,
  T: number,
  rho_l: number,
  r0 = 0.05,
  dt = 2.0,
  duration = 1800.0,
  tankDuration = 300.0
): { times: number[]; rates: number[] } {
  let Q_in_fn: (t: number) => number;
  if (Q_tank && typeof Q_tank === 'object' && Array.isArray(Q_tank.times)) {
    const tt = Q_tank.times,
      tr = Q_tank.rates;
    Q_in_fn = (t: number) => {
      if (!tt.length || t >= tt[tt.length - 1]) return 0.0;
      if (t <= tt[0]) return tr[0];
      for (let i = 0; i < tt.length - 1; i++) {
        if (tt[i] <= t && t < tt[i + 1]) {
          const frac = (t - tt[i]) / (tt[i + 1] - tt[i]);
          return tr[i] + frac * (tr[i + 1] - tr[i]);
        }
      }
      return 0.0;
    };
  } else {
    const rate = Q_tank as number;
    Q_in_fn = (t: number) => (t < tankDuration ? rate : 0.0);
  }

  const nSteps = Math.floor(duration / dt);
  let r_p = r0,
    mass = 0.0,
    t = 0.0;
  const times: number[] = [],
    rates: number[] = [];
  for (let i = 0; i < nSteps; i++) {
    const Q_in = Q_in_fn(t);
    const area = Math.PI * r_p ** 2;
    let evap = 0.0;
    if (area > 1e-9 && mass > 1e-9) {
      evap = puddleEvaporationRate(chem, U10, area, stability, 0.03, T);
      evap = Math.min(evap, mass / dt);
    }
    times.push(t);
    rates.push(evap);
    const d_p = area > 1e-9 ? mass / (area * rho_l) : 0.0;
    if (d_p > DEPTH_STOP_M) r_p += Math.sqrt(2.0 * G * d_p) * dt;
    mass = Math.max(mass + (Q_in - evap) * dt, 0.0);
    t += dt;
  }
  return { times, rates };
}

export function directReleaseTimeSeries(
  rate: number,
  duration: number,
  nSteps = 150
): { times: number[]; rates: number[] } {
  const dt = duration / nSteps;
  const times: number[] = [],
    rates: number[] = [];
  for (let i = 0; i < nSteps; i++) {
    times.push(i * dt);
    rates.push(rate);
  }
  return { times, rates };
}

// --- Tank release evaluation (LEAKR / HNE / DIERS) ---

function diersSwellingCheck(
  volRate: number,
  tankArea: number,
  voidFraction: number,
  sigma: number,
  rho_l: number,
  rho_g: number,
  C0 = 1.0
) {
  const U_super = volRate / tankArea;
  const U_rise = 1.53 * Math.pow((sigma * G * (rho_l - rho_g)) / rho_l ** 2, 0.25);
  const psi = (1 - voidFraction) / C0;
  const drift = U_rise * psi;
  return { U_super, drift, swells: U_super > drift };
}

function criticalPressureRatio(gamma: number): number {
  return Math.pow(2 / (gamma + 1), gamma / (gamma - 1));
}

function leakrGasRelease(
  P_h: number,
  P_a: number,
  A_f: number,
  gamma: number,
  MW: number,
  T: number,
  C_dis = 1.0
) {
  const Rc = criticalPressureRatio(gamma);
  const RP = P_a / P_h;
  if (RP <= Rc) {
    const GammaLeakr = Math.pow(2 / (gamma + 1), (gamma + 1) / (2 * (gamma - 1)));
    const Q = C_dis * A_f * P_h * GammaLeakr * Math.sqrt((gamma * MW) / (R_GAS * T));
    return { Q, mode: 'choked' };
  } else {
    const term = Math.max(
      Math.pow(RP, 2 / gamma) - Math.pow(RP, (gamma + 1) / gamma),
      0.0
    );
    const Q =
      C_dis * A_f * P_h * Math.sqrt(((2 * gamma) / (gamma - 1)) * (MW / (R_GAS * T)) * term);
    return { Q, mode: 'unchoked' };
  }
}

function hneRelease(
  pipeLength: number,
  A_f: number,
  C_dis: number,
  rho_l: number,
  P_h: number,
  P_a: number,
  T: number,
  MW: number,
  L_c = 2.88e5,
  cpLiquid = 950.0,
  l_e = 0.1
): number {
  const v_l = 1.0 / rho_l;
  const v_g = (R_GAS * T) / (MW * P_h);
  const dp = P_h - P_a;
  const N =
    (L_c ** 2 * v_l) / (2 * dp * C_dis ** 2 * (v_g - v_l) ** 2 * T * cpLiquid) +
    pipeLength / l_e;
  const G_flux = (L_c / (v_g - v_l)) * Math.pow(N * cpLiquid * T, -0.5);
  return G_flux * A_f;
}

export interface TankReleaseOpts {
  holeBelowLiquidLevel: boolean;
  isSuperheated: boolean;
  isNh3OrCl2: boolean;
  C_dis: number;
  A_f: number;
  rho_l: number;
  P_h: number;
  P_a: number;
  MW?: number;
  T?: number;
  pipeLength?: number;
  volumetricReleaseRate?: number;
  tankArea?: number;
  voidFraction?: number;
  sigma?: number;
  rho_g?: number;
  gamma?: number;
  L_c?: number;
  cpLiquid?: number;
}

export function evaluateTankRelease(opts: TankReleaseOpts): {
  algorithm: string;
  rate: number;
  phase: string;
  path: string[];
} {
  const path: string[] = ['Bồn chứa'];

  if (opts.holeBelowLiquidLevel) {
    if (!opts.isSuperheated) {
      path.push('Dưới mực lỏng, chưa quá nhiệt');
      const Q = bernoulliLiquidRelease(opts.C_dis, opts.A_f, opts.rho_l, opts.P_h, opts.P_a);
      path.push(`#2 Bernoulli -> Q_lỏng = ${Q.toFixed(4)} kg/s -> tạo vũng`);
      return { algorithm: '#2 Bernoulli', rate: Q, phase: 'long_tao_vung', path };
    }
    path.push('Dưới mực lỏng, quá nhiệt -> thoát lỏng/2-pha trực tiếp');
    path.push(
      '   (BỎ QUA #5 DIERS - swelling chỉ hỏi về miệng lỗ Ở KHOẢNG KHÔNG, vô nghĩa khi lỗ đã ngập sẵn trong lỏng)'
    );
    const Q = hneRelease(
      opts.pipeLength ?? 0,
      opts.A_f,
      opts.C_dis,
      opts.rho_l,
      opts.P_h,
      opts.P_a,
      opts.T ?? 293,
      opts.MW ?? 1,
      opts.L_c,
      opts.cpLiquid
    );
    path.push(`#4 HNE -> Q = ${Q.toFixed(4)} kg/s`);
    return { algorithm: '#4 HNE', rate: Q, phase: '2_pha', path };
  }

  if (!opts.isSuperheated) {
    path.push('Ở khoảng không, chưa quá nhiệt -> bình khí nén thuần (Chương 3.4.6)');
    const r = leakrGasRelease(opts.P_h, opts.P_a, opts.A_f, opts.gamma ?? 1.35, opts.MW ?? 1, opts.T ?? 293);
    path.push(`#3 LEAKR (${r.mode}) -> Q = ${r.Q.toFixed(4)} kg/s`);
    return { algorithm: '#3 LEAKR', rate: r.Q, phase: 'khi', path };
  }

  path.push('Ở khoảng không, quá nhiệt');
  if (opts.isNh3OrCl2) {
    path.push('Hóa chất là NH3/Cl2 -> chạy #5 DIERS');
    const d = diersSwellingCheck(
      opts.volumetricReleaseRate ?? 0,
      opts.tankArea ?? 1,
      opts.voidFraction ?? 0.3,
      opts.sigma ?? 0.02,
      opts.rho_l,
      opts.rho_g ?? 5.0
    );
    path.push(
      `   U_superficial=${d.U_super.toFixed(4)} m/s, drift_flux=${d.drift.toFixed(4)} m/s`
    );
    if (!d.swells) {
      path.push('   -> Không phồng -> #3 LEAKR (khí thuần)');
      const r = leakrGasRelease(opts.P_h, opts.P_a, opts.A_f, opts.gamma ?? 1.35, opts.MW ?? 1, opts.T ?? 293);
      path.push(`#3 LEAKR (${r.mode}) -> Q = ${r.Q.toFixed(4)} kg/s`);
      return { algorithm: '#3 LEAKR', rate: r.Q, phase: 'khi', path };
    } else {
      path.push('   -> Phồng -> #4 HNE (2 pha)');
      const Q = hneRelease(
        opts.pipeLength ?? 0,
        opts.A_f,
        opts.C_dis,
        opts.rho_l,
        opts.P_h,
        opts.P_a,
        opts.T ?? 293,
        opts.MW ?? 1,
        opts.L_c,
        opts.cpLiquid
      );
      path.push(`#4 HNE -> Q = ${Q.toFixed(4)} kg/s`);
      return { algorithm: '#4 HNE', rate: Q, phase: '2_pha', path };
    }
  }
  path.push('Hóa chất khác NH3/Cl2 -> mặc định giả định PHỒNG');
  const Q = hneRelease(
    opts.pipeLength ?? 0,
    opts.A_f,
    opts.C_dis,
    opts.rho_l,
    opts.P_h,
    opts.P_a,
    opts.T ?? 293,
    opts.MW ?? 1,
    opts.L_c,
    opts.cpLiquid
  );
  path.push(`#4 HNE (mặc định) -> Q = ${Q.toFixed(4)} kg/s`);
  return { algorithm: '#4 HNE', rate: Q, phase: '2_pha', path };
}

export function syntheticDeclineSeries(
  Q0: number,
  tau = 240.0,
  nRaw = 150,
  duration = 1200.0
): { times: number[]; rates: number[] } {
  const dt = duration / nRaw;
  const times: number[] = [],
    rates: number[] = [];
  for (let i = 0; i < nRaw; i++) {
    const t = i * dt;
    times.push(t);
    rates.push(Q0 * Math.exp(-t / tau));
  }
  return { times, rates };
}

export function reduceTimesteps(
  times: number[],
  rates: number[],
  nSteps = 5
): SimulationStep[] {
  const n = times.length;
  const dtRaw = n > 1 ? times[1] - times[0] : 1.0;
  const totalDuration = n > 0 ? times[n - 1] - times[0] + dtRaw : 0.0;
  const stepDur = totalDuration / nSteps;
  const steps: SimulationStep[] = [];
  for (let s = 0; s < nSteps; s++) {
    const tStart = times[0] + s * stepDur;
    const tEnd = tStart + stepDur;
    let sum = 0.0,
      cnt = 0;
    for (let i = 0; i < n; i++) {
      if (times[i] >= tStart && times[i] < tEnd) {
        sum += rates[i];
        cnt++;
      }
    }
    const rate = cnt > 0 ? sum / cnt : rates[rates.length - 1] || 0;
    steps.push({ tStart, tEnd, rate, duration: stepDur });
  }
  return steps;
}

// --- Dispersion model selection ---

export function criticalRichardsonNumber(
  chemDensity: number,
  airDensity: number,
  U_star: number,
  E: number,
  diameter: number,
  U10: number
): number {
  const g_hat = (G * (chemDensity - airDensity)) / airDensity;
  const H = E / Math.max(airDensity * U10 * diameter, 1e-9);
  return (g_hat * H) / Math.max(U_star ** 2, 1e-9);
}

export function chooseDispersionModel(Ric: number): 'gaussian' | 'heavy_gas' {
  return Ric < 1 ? 'gaussian' : 'heavy_gas';
}

// --- Gaussian plume (Briggs sigma) ---

const BRIGGS: Record<
  string,
  { sy1: number; sy2: number; sz1: number; sz2: number; sz3: number }
> = {
  A: { sy1: 0.22, sy2: 0.0001, sz1: 0.2, sz2: 0, sz3: 0 },
  B: { sy1: 0.16, sy2: 0.0001, sz1: 0.12, sz2: 0, sz3: 0 },
  C: { sy1: 0.11, sy2: 0.0001, sz1: 0.08, sz2: 0.0002, sz3: -0.5 },
  D: { sy1: 0.08, sy2: 0.0001, sz1: 0.06, sz2: 0.0015, sz3: -0.5 },
  E: { sy1: 0.06, sy2: 0.0001, sz1: 0.03, sz2: 0.0003, sz3: -1 },
  F: { sy1: 0.04, sy2: 0.0001, sz1: 0.016, sz2: 0.0003, sz3: -1 },
};

function briggsSigmaY(x: number, stability: string): number {
  const c = BRIGGS[stability];
  return (c.sy1 * x) / Math.sqrt(1 + c.sy2 * x);
}

function briggsSigmaZ(x: number, stability: string): number {
  const c = BRIGGS[stability];
  return c.sz1 * x * Math.pow(1 + c.sz2 * x, c.sz3);
}

function gaussianGroundConcentration(
  Q: number,
  x: number,
  y: number,
  U: number,
  stability: string
): number {
  if (x <= 0) return 0.0;
  const sy = briggsSigmaY(x, stability),
    sz = briggsSigmaZ(x, stability);
  if (sy <= 0 || sz <= 0) return 0.0;
  const g_y = Math.exp(-(y ** 2) / (2 * sy ** 2)) / (Math.sqrt(2 * Math.PI) * sy);
  const g_z = 2.0 / (Math.sqrt(2 * Math.PI) * sz);
  return (Q / U) * g_y * g_z;
}

function findThreatDistanceGaussian(
  Q: number,
  U: number,
  stability: string,
  LOC: number,
  xMax = 20000.0
): number {
  if (gaussianGroundConcentration(Q, 1.0, 0, U, stability) < LOC) return 0.0;
  let lo = 1.0,
    hi = xMax;
  if (gaussianGroundConcentration(Q, hi, 0, U, stability) > LOC) return hi;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (gaussianGroundConcentration(Q, mid, 0, U, stability) > LOC) lo = mid;
    else hi = mid;
    if (hi - lo < 1.0) break;
  }
  return (lo + hi) / 2;
}

function halfwidthGaussian(
  Q: number,
  x: number,
  U: number,
  stability: string,
  LOC: number
): number {
  const cCenter = gaussianGroundConcentration(Q, x, 0, U, stability);
  if (cCenter <= LOC) return 0.0;
  const sy = briggsSigmaY(x, stability);
  return sy * Math.sqrt(2 * Math.log(cCenter / LOC));
}

// Matches pmbc_web's `contourArea()` (mophongphattan.component.ts:664-672)
// — trapezoidal integration of the half-width along x, doubled for both
// sides of the plume.
export function contourArea(contour: ContourPoint[]): number {
  if (!contour || contour.length < 2) return 0.0;
  let area = 0.0;
  for (let i = 0; i < contour.length - 1; i++) {
    const dx = contour[i + 1].x - contour[i].x;
    area += 0.5 * (contour[i].halfwidth + contour[i + 1].halfwidth) * dx;
  }
  return 2.0 * area;
}

export function computeGaussianContour(
  Q: number,
  U: number,
  stability: string,
  LOC: number,
  nPoints = 9
): { xl: number; contour: ContourPoint[] } {
  const xl = findThreatDistanceGaussian(Q, U, stability, LOC);
  if (xl <= 0) return { xl: 0, contour: [] };
  const contour: ContourPoint[] = [];
  for (let i = 0; i < nPoints; i++) {
    const x = (xl * i) / (nPoints - 1);
    const hw = x > 0 ? halfwidthGaussian(Q, x, U, stability, LOC) : 0.0;
    contour.push({ x, halfwidth: hw });
  }
  return { xl, contour };
}

// --- Heavy-gas (DEGADIS-style) dispersion ---

const C_E = 1.15,
  DELTA_L = 2.15;

function gammaFn(z: number): number {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6,
    1.5056327351493116e-7,
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gammaFn(1 - z));
  z -= 1;
  let x = p[0];
  for (let i = 1; i < g + 2; i++) x += p[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function phiStability(Ri: number): number {
  const r = Math.min(Math.max(Ri, 0.0), 1e4);
  return 0.88 + 0.099 * Math.pow(r, 1.04) + 1.4e-25 * Math.pow(r, 5.7);
}

function reducedGravity(rho: number, rhoA: number): number {
  return (G * (rho - rhoA)) / rhoA;
}
function mixtureDensity(ccMass: number, rhoGas: number, rhoA: number): number {
  return rhoA + ccMass * (1.0 - rhoA / rhoGas);
}
function effectiveCloudHeight(Sz: number, n: number): number {
  return (Sz / (1 + n)) * gammaFn(1 / (1 + n));
}
function effectiveCloudVelocity(Sz: number, Z_R: number, U_R: number, n: number): number {
  return (Math.pow(Sz / Z_R, n) * U_R) / gammaFn(1 / (1 + n));
}
function bulkRichardson(gHat: number, Heff: number, Ustar: number): number {
  return Ustar > 0 ? (gHat * Heff) / Ustar ** 2 : Infinity;
}
function maxAtmosphericTakeup(ccS: number, Ustar: number, n: number, RiRep: number): number {
  const phiHat = phiStability(RiRep);
  return ((ccS * (K_VK * Ustar * (1 + n))) / phiHat) * (DELTA_L / (DELTA_L - 1));
}

interface HeavyGasTracePoint {
  x: number;
  Sz: number;
  Beff: number;
  Heff: number;
  Ueff: number;
  RiStar: number;
  cc: number;
}

function marchDownwindHeavyGas(
  E: number,
  rhoGas: number,
  rhoA: number,
  Ustar: number,
  U_R: number,
  Z_R: number,
  n: number,
  dx = 10.0,
  xMax = 200000.0,
  LOC: number | null = null
): HeavyGasTracePoint[] {
  const ccS = rhoGas;
  const Qmax = maxAtmosphericTakeup(ccS, Ustar, n, 1.0);
  const R0 = Math.sqrt(E / (Math.PI * Qmax));
  const Gamma = gammaFn(1 / (1 + n));
  const H0 = 0.02 * R0;
  let Sz = (H0 * (1 + n)) / Gamma;
  let Beff = R0;
  const trace: HeavyGasTracePoint[] = [];
  let x = 0.0;
  while (x < xMax) {
    const Heff = effectiveCloudHeight(Sz, n);
    const Ueff = effectiveCloudVelocity(Sz, Z_R, U_R, n);
    const cc = E / Math.max(Ueff * Heff * 2.0 * Beff, 1e-12);
    const rho = mixtureDensity(cc, rhoGas, rhoA);
    const gHat = reducedGravity(rho, rhoA);
    const RiStar = bulkRichardson(gHat, Heff, Ustar);
    trace.push({ x, Sz, Beff, Heff, Ueff, RiStar, cc });
    const phi = phiStability(RiStar);
    const dSzDx = (K_VK * Ustar * (1 + n)) / (phi * U_R * Math.pow(Sz / Z_R, n));
    const dBeffDx =
      C_E * Gamma * Math.pow(Z_R / Sz, n) * Math.sqrt(Math.max(gHat * Heff, 0) / U_R ** 2);
    Sz += dSzDx * dx;
    Beff += dBeffDx * dx;
    x += dx;
    if (LOC !== null && cc < LOC) break;
  }
  return trace;
}

function concentrationAtHeavyGas(
  trace: HeavyGasTracePoint[],
  x: number,
  y = 0.0
): number {
  if (!trace.length) return 0.0;
  let pt: { cc: number; Beff: number };
  if (x <= trace[0].x) pt = trace[0];
  else if (x >= trace[trace.length - 1].x) pt = trace[trace.length - 1];
  else {
    pt = trace[trace.length - 1];
    for (let i = 0; i < trace.length - 1; i++) {
      if (trace[i].x <= x && x <= trace[i + 1].x) {
        const t0 = trace[i],
          t1 = trace[i + 1];
        const frac = t1.x > t0.x ? (x - t0.x) / (t1.x - t0.x) : 0.0;
        pt = { cc: t0.cc + frac * (t1.cc - t0.cc), Beff: t0.Beff + frac * (t1.Beff - t0.Beff) };
        break;
      }
    }
  }
  if (y === 0.0) return pt.cc;
  const Beff = Math.max(pt.Beff, 1e-6);
  return pt.cc * Math.exp(-((y / Beff) ** 2));
}

function heavyGasHalfwidth(trace: HeavyGasTracePoint[], x: number, LOC: number): number {
  const ccX = concentrationAtHeavyGas(trace, x, 0.0);
  if (ccX <= LOC) return 0.0;
  let Beff: number;
  if (x <= trace[0].x) Beff = trace[0].Beff;
  else if (x >= trace[trace.length - 1].x) Beff = trace[trace.length - 1].Beff;
  else {
    Beff = trace[trace.length - 1].Beff;
    for (let i = 0; i < trace.length - 1; i++) {
      if (trace[i].x <= x && x <= trace[i + 1].x) {
        const t0 = trace[i],
          t1 = trace[i + 1];
        const frac = t1.x > t0.x ? (x - t0.x) / (t1.x - t0.x) : 0.0;
        Beff = t0.Beff + frac * (t1.Beff - t0.Beff);
        break;
      }
    }
  }
  return Beff * Math.sqrt(Math.log(ccX / LOC));
}

export function computeHeavyGasContour(
  E: number,
  rhoGas: number,
  rhoA: number,
  Ustar: number,
  U_R: number,
  Z_R: number,
  n: number,
  LOC: number,
  nPoints = 9,
  dx = 10.0,
  xMax = 200000.0
): { xl: number; contour: ContourPoint[] } {
  const trace = marchDownwindHeavyGas(E, rhoGas, rhoA, Ustar, U_R, Z_R, n, dx, xMax, LOC);
  if (!trace.length) return { xl: 0, contour: [] };
  let xl = trace[trace.length - 1].x;
  if (trace[trace.length - 1].cc >= LOC) {
    // trace ended without dropping below LOC
  } else if (trace.length >= 2) {
    const p0 = trace[trace.length - 2],
      p1 = trace[trace.length - 1];
    if (p0.cc !== p1.cc) {
      const frac = (p0.cc - LOC) / (p0.cc - p1.cc);
      xl = p0.x + frac * (p1.x - p0.x);
    }
  }
  if (xl <= 0) return { xl: 0, contour: [] };
  const contour: ContourPoint[] = [];
  for (let i = 0; i < nPoints; i++) {
    const x = (xl * i) / (nPoints - 1);
    const hw = x > 0 ? heavyGasHalfwidth(trace, x, LOC) : 0.0;
    contour.push({ x, halfwidth: hw });
  }
  return { xl, contour };
}

// --- Pipeline blowdown (Wilson / Newton-Raphson) ---

export function initialChokedFlowRate(
  P0: number,
  A_h: number,
  gamma: number,
  MW: number,
  T: number
): number {
  const Gamma = Math.pow(2 / (gamma + 1), (gamma + 1) / (2 * (gamma - 1)));
  return A_h * P0 * Gamma * Math.sqrt((gamma * MW) / (R_GAS * T));
}

export function totalPipelineMass(
  P0: number,
  pipeArea: number,
  pipeLength: number,
  MW: number,
  T: number
): number {
  return (P0 * pipeArea * pipeLength * MW) / (R_GAS * T);
}

function darcyFrictionFactor(pipeDiameter: number, roughness = 0.0001): number {
  return 0.25 / Math.pow(Math.log10(roughness / (3.7 * pipeDiameter)), 2);
}

export function estimateAlphaBeta(
  Q0: number,
  MTotal: number,
  pipeLength: number,
  pipeDiameter: number,
  holeDiameter: number,
  gamma: number,
  MW: number,
  T: number,
  roughness = 0.0001
): { alpha: number; beta: number } {
  const c = Math.sqrt((gamma * R_GAS * T) / MW);
  const tauP = pipeLength / c;
  const pipeArea = Math.PI * (pipeDiameter / 2) ** 2,
    holeArea = Math.PI * (holeDiameter / 2) ** 2;
  const K_H = holeArea / pipeArea;
  const mu = darcyFrictionFactor(pipeDiameter, roughness);
  const K_F = (mu * pipeLength) / pipeDiameter;
  const Gamma = Math.pow(2 / (gamma + 1), (gamma + 1) / (2 * (gamma - 1)));
  const smallHoleParam = (K_H ** 2 / K_F) * Gamma;
  let beta: number;
  if (smallHoleParam <= 30) beta = (K_H * Gamma) / tauP;
  else beta = ((2.0 / 3.0) * K_F) / tauP;
  const alpha = MTotal / (Q0 * beta);
  return { alpha, beta };
}

function safeExp(x: number): number {
  if (x > 700) return Math.exp(700);
  if (x < -700) return 0.0;
  return Math.exp(x);
}

function wilsonReleaseRate(t: number, Q0: number, alpha: number, beta: number): number {
  return (Q0 / (alpha + 1.0)) * (alpha * safeExp(-beta * t) + safeExp(-(alpha + 1.0) * beta * t));
}

function cumulativeMassReleased(Q0: number, alpha: number, beta: number, t: number): number {
  const term1 = (alpha / beta) * (1.0 - safeExp(-beta * t));
  const term2 =
    (1.0 / ((alpha + 1.0) * beta)) * (1.0 - safeExp(-(alpha + 1.0) * beta * t));
  return (Q0 / (alpha + 1.0)) * (term1 + term2);
}

function findNextTimestep(
  Q0: number,
  alpha: number,
  beta: number,
  tI: number,
  massPerStep: number,
  minDt = 60.0,
  maxDuration = 3600.0,
  tol = 1e-6,
  maxIter = 50
): number {
  const MI = cumulativeMassReleased(Q0, alpha, beta, tI);
  const target = MI + massPerStep;
  const tHi = tI + maxDuration;
  let t = tI + minDt;
  for (let i = 0; i < maxIter; i++) {
    const f = cumulativeMassReleased(Q0, alpha, beta, t) - target;
    const fPrime = wilsonReleaseRate(t, Q0, alpha, beta);
    if (Math.abs(fPrime) < 1e-12) break;
    let tNew = t - f / fPrime;
    tNew = Math.min(Math.max(tNew, tI), tHi);
    if (Math.abs(tNew - t) < tol) {
      t = tNew;
      break;
    }
    t = tNew;
  }
  return Math.max(t, tI + minDt);
}

export function pipelineTimeSteps(
  Q0: number,
  alpha: number,
  beta: number,
  MTotal: number,
  nSteps = 5,
  maxDuration = 3600.0
): SimulationStep[] {
  const massPerStep = MTotal / nSteps;
  let tPrev = 0.0;
  const steps: SimulationStep[] = [];
  for (let i = 0; i < nSteps; i++) {
    let tNext = findNextTimestep(Q0, alpha, beta, tPrev, massPerStep, 60.0, maxDuration);
    if (tNext > maxDuration) tNext = maxDuration;
    const duration = tNext - tPrev;
    if (duration <= 0) break;
    const massInStep =
      cumulativeMassReleased(Q0, alpha, beta, tNext) -
      cumulativeMassReleased(Q0, alpha, beta, tPrev);
    steps.push({ tStart: tPrev, tEnd: tNext, duration, rate: massInStep / duration });
    tPrev = tNext;
    if (tPrev >= maxDuration) break;
  }
  return steps;
}

export type { ScenarioKey };
