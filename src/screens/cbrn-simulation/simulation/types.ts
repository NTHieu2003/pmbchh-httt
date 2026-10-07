import type { Chemical } from '@/types';

export type { Chemical };

// Matches pmbc_web's `SimulationResult` (mophongphattan.component.ts) 1:1 —
// `levels` replaces the old single `contour`/`LOC_kg_m3` pair: one entry
// per AEGL-1/2/3 threshold the chemical has data for (`chem.aegl*_ppm` from
// `chemData.ts`'s CHEM_DB), or a single LOC-based entry as a fallback for
// chemicals without AEGL data (see `finishSimulation` in runSimulation.ts).
export interface SimulationResult {
  chem: Chemical;
  steps: SimulationStep[];
  Qpeak: number;
  Ric: number;
  model: 'gaussian' | 'heavy_gas';
  levels: ThreatLevel[];
  // Max across `levels` — kept as top-level fields since most of the UI
  // (badges, map fitBounds, the single-shape "VÙNG ĐE DỌA" SVG) only cares
  // about the outermost/widest level, matching web's own `xl`/
  // `maxHalfwidth`/`maxArea` top-level fields.
  xl: number;
  maxHalfwidth: number;
  maxArea: number;
  stability: string;
  U10: number;
  decisionPath: string[];
  windDirTo: number;
  sourceLat: number;
  sourceLon: number;
  // Ambient temperature (K) the run used — needed by the realtime tab's
  // `buildRtModel` to re-derive the gas density for its own contour calc.
  ambientTemp: number;
  // Scenario the run used — web reads its live `currentScenario` for the
  // detailed report's "Kịch bản sự cố" row; mobile pins it to the result.
  scenario: ScenarioKey;
}

// Matches pmbc_web's `ThreatLevel` (mophongphattan.component.ts:21-31).
export interface ThreatLevel {
  key: string;
  label: string;
  stroke: string;
  fill: string;
  fillOpacity: number;
  xl: number;
  contour: ContourPoint[];
  area: number;
  loc_ppm: number | null;
  LOC_kg_m3: number;
}

export interface ContourPoint {
  x: number;
  halfwidth: number;
}

export interface SimulationStep {
  tStart: number;
  tEnd: number;
  rate: number;
  duration: number;
}

export type ScenarioKey =
  | 'direct'
  | 'puddle'
  | 'tank_liquid_spreading'
  | 'tank_pressurized'
  | 'pipeline';

export type Insolation = 'manh' | 'vua' | 'nhe';

// Every `p_*` field mirrors the Angular component's scenario input fields —
// kept together in one bag (rather than split per-scenario) since the web
// component itself keeps them as flat sibling fields on one class, and the
// mobile form sidebar only ever shows the subset relevant to
// `currentScenario` at a time (see ScenarioFormCard).
export interface ScenarioParams {
  p_rate: number;
  // Replaces the old `p_duration` — web now takes the initial mass and
  // derives the release duration as mass ÷ rate (see runSimulation.ts).
  p_mass: number;

  p_area: number;

  p_Af_liquid: number;
  p_tankRadius: number;
  p_holeHeight: number;
  p_liquidHeight: number;
  p_tankHeight: number;

  p_isNh3Cl2: boolean;
  p_Ph: number;
  p_T_tank: number;
  p_Af_tank: number;
  p_volRate: number;
  p_tankArea: number;

  p_pipeLength: number;
  p_pipeDiameter: number;
  p_holeDiameter: number;
  p_P0: number;
  p_gamma_pipe: number;
}

export const DEFAULT_SCENARIO_PARAMS: ScenarioParams = {
  p_rate: 0.8,
  p_mass: 720,

  p_area: 50,

  p_Af_liquid: 0.005,
  p_tankRadius: 5.0,
  p_holeHeight: 0.3,
  p_liquidHeight: 15.0,
  p_tankHeight: 20.0,

  p_isNh3Cl2: false,
  p_Ph: 700000,
  p_T_tank: 293,
  p_Af_tank: 0.01,
  p_volRate: 0.5,
  p_tankArea: 3.14,

  p_pipeLength: 500,
  p_pipeDiameter: 0.3,
  p_holeDiameter: 0.05,
  p_P0: 5000000,
  p_gamma_pipe: 1.31,
};
