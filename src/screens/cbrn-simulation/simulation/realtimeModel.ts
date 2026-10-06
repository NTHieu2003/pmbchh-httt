// Ported from pmbc_web's "MÔ HÌNH THỜI GIAN THỰC" block
// (mophongphattan.component.ts lines ~1198-1351: `buildRtModel`,
// `rtStepIndex`, `rtInterpHalfwidth`, `computeRtFrame`) — keep this a 1:1
// port of the math, not a redesign.
//
// Idea: gas released at time τ drifts downwind at speed U. At time t, the
// point x meters from the source holds gas released at τ = t - x/U — so
// its half-width is read off the threat-level contour belonging to
// whichever emission step covers τ. Net effect: the threat zone grows
// outward from the source, tracks the (possibly stepped) emission rate,
// then detaches and drifts away once the leak stops.
//
// Web builds one `rtModel.levels` entry per AEGL threshold (AEGL-1/2/3,
// falling back to a single "LOC" level when the chemical has no AEGL
// data) — `result.levels` (see `runSimulation.ts`'s `finishSimulation`)
// already carries exactly that shape, one `ThreatLevel` per threshold, so
// `buildRtModel` below just re-runs the per-step contour math once per
// level instead of once overall.
import {
  AIR_DENSITY,
  BRIGHTON_N,
  R_GAS,
  computeGaussianContour,
  computeHeavyGasContour,
  deaconFrictionVelocity,
  vaporPressureAtTemperature,
} from './physics';

import type { ContourPoint, SimulationResult, SimulationStep } from './types';

interface RtLevelStep {
  xl: number;
  contour: ContourPoint[];
}

interface RtLevel {
  key: string;
  label: string;
  stroke: string;
  fill: string;
  fillOpacity: number;
  loc_ppm: number;
  perStep: RtLevelStep[];
  xlMax: number;
}

export interface RtModel {
  U: number;
  steps: SimulationStep[];
  releaseEnd: number;
  Qmax: number;
  levels: RtLevel[];
  xlAll: number;
  hwMax: number;
  tMax: number;
  model: 'gaussian' | 'heavy_gas';
}

export interface RtFrameLevel {
  key: string;
  label: string;
  stroke: string;
  fill: string;
  fillOpacity: number;
  loc_ppm: number;
  contour: ContourPoint[];
  reach: number;
  tail: number;
  area: number;
}

export type RtStatus =
  | 'not_started'
  | 'leaking'
  | 'drifting'
  | 'dissipated';

export interface RtFrame {
  t: number;
  levels: RtFrameLevel[];
  rateNow: number;
  massReleased: number;
  reach: number;
  area: number;
  status: RtStatus;
  front: number;
}

// Builds the per-step contours every level needs to answer "what was the
// half-width at distance x when this step was releasing" — same contour
// functions the main result already used, just re-run per emission step
// instead of only at Qpeak.
export const buildRtModel = (result: SimulationResult): RtModel | null => {
  const chem = result.chem;
  const T = result.ambientTemp;
  const U = Math.max(0.5, Number(result.U10) || 0.5);
  const Ustar = deaconFrictionVelocity(result.U10);
  const n = BRIGHTON_N[result.stability] ?? 0.142;

  const vp = vaporPressureAtTemperature(chem, T).P;
  const rhoGas = (vp * chem.mw) / (R_GAS * T);
  const steps = (result.steps || []).filter((s) => s.tEnd > s.tStart);
  if (!steps.length) return null;
  const releaseEnd = steps[steps.length - 1].tEnd;
  const Qmax = Math.max(0, ...steps.map((s) => s.rate || 0));

  const perStepFor = (rate: number, LOC_kg_m3: number): RtLevelStep => {
    if (!(rate > 0)) return { xl: 0, contour: [] };
    return result.model === 'heavy_gas'
      ? computeHeavyGasContour(rate, rhoGas, AIR_DENSITY, Ustar, result.U10, 10.0, n, LOC_kg_m3)
      : computeGaussianContour(rate, result.U10, result.stability, LOC_kg_m3);
  };

  const levels: RtLevel[] = result.levels.map((lvl) => {
    const perStep = steps.map((s) => perStepFor(s.rate, lvl.LOC_kg_m3));
    return {
      key: lvl.key,
      label: lvl.label,
      stroke: lvl.stroke,
      fill: lvl.fill,
      fillOpacity: lvl.fillOpacity,
      loc_ppm: lvl.loc_ppm ?? chem.loc_ppm,
      perStep,
      xlMax: Math.max(0, ...perStep.map((c) => c.xl || 0)),
    };
  });

  const xlAll = Math.max(0, ...levels.map((l) => l.xlMax));
  let hwMax = 0;
  levels.forEach((l) =>
    l.perStep.forEach((c) => c.contour.forEach((p) => { hwMax = Math.max(hwMax, p.halfwidth); }))
  );
  // Ends once the last emitted parcel has drifted past the farthest
  // dangerous distance.
  const tMax = Math.ceil(releaseEnd + (xlAll > 0 ? xlAll / U : 0) + 30);

  return { U, steps, releaseEnd, Qmax, levels, xlAll, hwMax, tMax, model: result.model };
};

const rtStepIndex = (model: RtModel, tau: number): number => {
  const { steps } = model;
  for (let i = 0; i < steps.length; i++) {
    const last = i === steps.length - 1;
    if (tau >= steps[i].tStart && (tau < steps[i].tEnd || (last && tau <= steps[i].tEnd))) return i;
  }
  return -1;
};

const rtInterpHalfwidth = (c: RtLevelStep, x: number): number => {
  if (!c || !c.contour.length || x <= 0 || x > c.xl) return 0;
  const pts = c.contour;
  for (let i = 1; i < pts.length; i++) {
    if (x <= pts[i].x) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const f = p1.x > p0.x ? (x - p0.x) / (p1.x - p0.x) : 0;
      return p0.halfwidth + f * (p1.halfwidth - p0.halfwidth);
    }
  }
  return 0;
};

// Snapshot at time t: every level's contour (clipped to its live extent),
// reach, swept area, current emission rate, cumulative mass released, and
// a human-readable status line.
export const computeRtFrame = (model: RtModel, t: number): RtFrame => {
  const N = 80;
  const levels: RtFrameLevel[] = model.levels.map((lvl) => {
    const pts: ContourPoint[] = [];
    let reach = 0;
    let area = 0;
    for (let i = 0; i <= N; i++) {
      const x = (lvl.xlMax * i) / N;
      const tau = t - x / model.U;
      let hw = 0;
      if (tau >= 0 && tau <= model.releaseEnd) {
        const idx = rtStepIndex(model, tau);
        if (idx >= 0) hw = rtInterpHalfwidth(lvl.perStep[idx], x);
      }
      if (hw > 0) reach = x;
      if (pts.length) {
        const prev = pts[pts.length - 1];
        area += (prev.halfwidth + hw) * (x - prev.x);
      }
      pts.push({ x, halfwidth: hw });
    }
    const first = pts.findIndex((p) => p.halfwidth > 0);
    let last = -1;
    for (let i = pts.length - 1; i >= 0; i--) {
      if (pts[i].halfwidth > 0) {
        last = i;
        break;
      }
    }
    const contour = first >= 0 ? pts.slice(Math.max(0, first - 1), Math.min(pts.length, last + 2)) : [];
    return {
      key: lvl.key,
      label: lvl.label,
      stroke: lvl.stroke,
      fill: lvl.fill,
      fillOpacity: lvl.fillOpacity,
      loc_ppm: lvl.loc_ppm,
      contour,
      reach,
      tail: first >= 0 ? pts[first].x : 0,
      area,
    };
  });

  const idxNow = t <= model.releaseEnd ? rtStepIndex(model, t) : -1;
  const rateNow = idxNow >= 0 ? model.steps[idxNow].rate : 0;
  let massReleased = 0;
  model.steps.forEach((s) => {
    const overlap = Math.max(0, Math.min(t, s.tEnd) - s.tStart);
    massReleased += (s.rate || 0) * overlap;
  });
  const reach = Math.max(0, ...levels.map((l) => l.reach));
  const area = Math.max(0, ...levels.map((l) => l.area));
  const anyCloud = levels.some((l) => l.contour.length);

  let status: RtStatus;
  if (t <= 0) status = 'not_started';
  else if (t <= model.releaseEnd) status = 'leaking';
  else if (anyCloud) status = 'drifting';
  else status = 'dissipated';

  return { t, levels, rateNow, massReleased, reach, area, status, front: Math.min(model.U * t, model.xlAll) };
};

export const RT_STATUS_LABEL: Record<RtStatus, string> = {
  not_started: 'Chưa bắt đầu',
  leaking: 'Đang rò rỉ - đám mây độc đang lan rộng',
  drifting: 'Đã ngừng rò rỉ - đám mây độc đang trôi theo gió',
  dissipated: 'Đám mây đã loãng dưới ngưỡng nguy hiểm',
};

export const rtFormatDuration = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  const pad = (v: number) => (v < 10 ? '0' + v : '' + v);
  return (h > 0 ? h + ':' : '') + pad(m) + ':' + pad(r);
};
