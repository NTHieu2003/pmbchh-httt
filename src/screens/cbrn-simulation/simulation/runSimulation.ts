// Ported from pmbc_web's `runPipeline()` + `finishSimulation()`
// (mophongphattan.component.ts lines 784-1141, 1143-1196) — orchestrates
// the physics functions in `physics.ts` per selected scenario, exactly
// mirroring the web branching (including the per-scenario
// `diameterForRic`/`T_use` values and decision-path text). Every scenario
// now derives its vapor pressure from the shared `ambientTemp` input via
// Clausius-Clapeyron (`vaporPressureAtTemperature`) instead of a hardcoded
// 293K, matching web's latest update.
import { AEGL_COLORS } from './aeglColors';
import {
  AIR_DENSITY,
  BRIGHTON_N,
  G,
  P_ATM,
  R_GAS,
  chooseDispersionModel,
  computeGaussianContour,
  computeHeavyGasContour,
  contourArea,
  criticalRichardsonNumber,
  deaconFrictionVelocity,
  directReleaseTimeSeries,
  drainingTankLiquidTimeSeries,
  estimateAlphaBeta,
  evaluateTankRelease,
  initialChokedFlowRate,
  pipelineTimeSteps,
  puddleEvaporationRate,
  reduceTimesteps,
  spreadingPuddleTimeSeries,
  syntheticDeclineSeries,
  totalPipelineMass,
  vaporPressureAtTemperature,
} from './physics';

import type { Chemical, ScenarioKey, ScenarioParams, SimulationResult, ThreatLevel } from './types';

export interface RunSimulationInput {
  chem: Chemical;
  windSpeed: number;
  windDirTo: number;
  stability: string;
  ambientTemp: number;
  sourceLat: number;
  sourceLon: number;
  scenario: ScenarioKey;
  params: ScenarioParams;
}

export function runSimulation({
  chem,
  windSpeed,
  windDirTo,
  stability,
  ambientTemp,
  sourceLat,
  sourceLon,
  scenario,
  params,
}: RunSimulationInput): SimulationResult {
  const U10 = Number(windSpeed) || 3.0;
  const Ustar = deaconFrictionVelocity(U10);
  const ambient = Number(ambientTemp) || 293.0;

  let times: number[] = [];
  let rates: number[] = [];
  let T_use = ambient;
  let decisionPath: string[] = [];
  let diameterForRic = 5.0;

  if (scenario === 'direct') {
    T_use = ambient;
    const rate = Number(params.p_rate) || 0;
    const mass = Number(params.p_mass) || 0;
    const duration = rate > 0 ? mass / rate : 0;
    ({ times, rates } = directReleaseTimeSeries(rate, duration, 150));
    if (rate <= 0) {
      decisionPath = [
        `#1 Direct — lưu lượng phải > 0 để tính được thời gian phát tán (mass/rate), hiện đang là ${rate} kg/s.`,
      ];
    } else {
      decisionPath = [
        `#1 Direct — người dùng tự khai báo ${rate} kg/s, khối lượng ban đầu ${mass} kg` +
          ` → thời gian phát tán = ${duration.toFixed(1)}s (nội suy = khối lượng ÷ lưu lượng, không qua mô hình vật lý nào)`,
      ];
    }
    diameterForRic = 1.0;
  } else if (scenario === 'puddle') {
    T_use = ambient;
    const area = Number(params.p_area) || 50;
    const vpEst = vaporPressureAtTemperature(chem, T_use);
    const vpAtT = vpEst.P;
    const chemAtT: Chemical = { ...chem, vp_pa: vpAtT };

    decisionPath = [];
    if (vpEst.extrapolated) {
      decisionPath.push(
        `Áp suất hơi tại ${T_use}K (Clausius-Clapeyron từ điểm sôi ${chem.bp_K}K` +
          ` + điểm tham chiếu CAMEO ${chem.vp_ref_K}K/${chem.vp_pa.toFixed(0)}Pa): ${vpAtT.toFixed(0)} Pa` +
          ` (so với ${chem.vp_pa.toFixed(0)} Pa ở nhiệt độ tham chiếu gốc)`
      );
    } else {
      decisionPath.push(
        `[!] Thiếu dữ liệu điểm sôi hoặc nhiệt độ tham chiếu CAMEO cho ${chem.name} -` +
          ` KHÔNG thể ngoại suy áp suất hơi theo nhiệt độ, dùng nguyên giá trị CAMEO` +
          ` (${chem.vp_pa.toFixed(0)} Pa, không phụ thuộc nhiệt độ ${T_use}K đã nhập).`
      );
    }

    if (vpAtT >= P_ATM) {
      decisionPath.push(
        `[!] Ở nhiệt độ ${T_use}K, áp suất hơi ước tính (${vpAtT.toFixed(0)} Pa)` +
          ` VƯỢT áp suất khí quyển - ${chem.name} không thể tồn tại dạng lỏng ổn định ở nhiệt độ` +
          ` này, hãy dùng kịch bản "Bồn quá nhiệt" thay vì "Vũng".`
      );
      times = [];
      rates = [];
      for (let i = 0; i < 150; i++) {
        times.push(i * 12);
        rates.push(0);
      }
    } else {
      const E = puddleEvaporationRate(chemAtT, U10, area, stability, 0.03, T_use);
      times = [];
      rates = [];
      for (let i = 0; i < 150; i++) {
        times.push(i * 12);
        rates.push(E);
      }
      decisionPath.push(`#6 Vũng diện tích cố định (${area} m²) — Brighton → bay hơi = ${E.toFixed(5)} kg/s`);
    }
    diameterForRic = Math.sqrt((4 * area) / Math.PI);
  } else if (scenario === 'tank_liquid_spreading') {
    T_use = ambient;
    const A_f = Number(params.p_Af_liquid) || 0.005;
    const tankRadius = Number(params.p_tankRadius) || 5.0;
    const holeHeight = Number(params.p_holeHeight) || 0.3;
    const liquidHeight = Number(params.p_liquidHeight) || 15.0;
    const tankHeight = Number(params.p_tankHeight) || 20.0;
    const tankArea = Math.PI * tankRadius ** 2;

    if (liquidHeight > tankHeight || holeHeight > tankHeight) {
      const problems: string[] = [];
      if (liquidHeight > tankHeight) {
        problems.push(`mực lỏng ban đầu (${liquidHeight}m) vượt quá chiều cao bồn (${tankHeight}m)`);
      }
      if (holeHeight > tankHeight) {
        problems.push(`độ cao lỗ (${holeHeight}m) vượt quá chiều cao bồn (${tankHeight}m)`);
      }
      decisionPath = [
        `[LỖI] Số liệu hình học không hợp lệ: ${problems.join('; ')}.` +
          ` Bồn không thể chứa cột chất lỏng hoặc có lỗ cao hơn chính chiều cao vật lý của nó — hãy sửa lại số liệu.`,
      ];
      diameterForRic = 6.0;
      const steps = reduceTimesteps([0], [0], 5);
      return finishSimulation(steps, chem, T_use, U10, Ustar, stability, decisionPath, diameterForRic, windDirTo, sourceLat, sourceLon);
    }

    const vpEst = vaporPressureAtTemperature(chem, T_use);
    const vpAtT = vpEst.P;
    const chemAtT: Chemical = { ...chem, vp_pa: vpAtT };

    const evalRes = evaluateTankRelease({
      holeBelowLiquidLevel: true,
      isSuperheated: false,
      isNh3OrCl2: false,
      C_dis: 0.61,
      A_f,
      rho_l: chem.rho_l,
      P_h: 200000,
      P_a: P_ATM,
    });
    decisionPath = evalRes.path.filter((l) => !l.startsWith('#2 Bernoulli'));

    if (vpEst.extrapolated) {
      decisionPath.push(
        `   Áp suất hơi tại ${T_use}K (Clausius-Clapeyron từ điểm sôi ${chem.bp_K}K` +
          ` + điểm tham chiếu CAMEO ${chem.vp_ref_K}K/${chem.vp_pa.toFixed(0)}Pa): ${vpAtT.toFixed(0)} Pa` +
          ` (so với ${chem.vp_pa.toFixed(0)} Pa ở nhiệt độ tham chiếu gốc)`
      );
    } else {
      decisionPath.push(
        `   [!] Thiếu dữ liệu điểm sôi hoặc nhiệt độ tham chiếu CAMEO cho ${chem.name} -` +
          ` KHÔNG thể ngoại suy áp suất hơi theo nhiệt độ, dùng nguyên giá trị CAMEO` +
          ` (${chem.vp_pa.toFixed(0)} Pa, không phụ thuộc nhiệt độ ${T_use}K đã nhập).`
      );
    }

    if (vpAtT >= P_ATM) {
      decisionPath.push(
        `   [!] Ở nhiệt độ ${T_use}K, áp suất hơi ước tính (${vpAtT.toFixed(0)} Pa)` +
          ` VƯỢT áp suất khí quyển - ${chem.name} không thể tồn tại dạng lỏng ổn định ở nhiệt độ` +
          ` này, hãy dùng kịch bản "Bồn quá nhiệt" thay vì "Bồn lỏng rò rỉ".`
      );
      ({ times, rates } = spreadingPuddleTimeSeries(
        chemAtT,
        { times: [], rates: [] },
        U10,
        stability,
        T_use,
        chem.rho_l,
        0.05,
        10.0,
        7200.0
      ));
    } else {
      const tankSeries = drainingTankLiquidTimeSeries(
        0.61,
        A_f,
        chem.rho_l,
        vpAtT,
        tankArea,
        holeHeight,
        liquidHeight,
        P_ATM,
        G,
        10.0,
        7200.0
      );

      if (!tankSeries.times.length) {
        decisionPath.push(
          `   [!] Áp suất hơi (${vpAtT.toFixed(0)} Pa tại ${T_use}K) + cột thủy tĩnh` +
            ` (cao ${liquidHeight}m) KHÔNG ĐỦ vượt áp suất khí quyển - không có dòng chảy.` +
            ` Thử tăng chiều cao bồn, tăng nhiệt độ, hoặc chọn hóa chất bay hơi mạnh hơn.`
        );
      } else {
        decisionPath.push(
          `   #2 Bernoulli (độ sâu ngập đầy đủ): Q đầu=${tankSeries.rates[0].toFixed(4)} kg/s,` +
            ` Q cuối=${tankSeries.rates[tankSeries.rates.length - 1].toFixed(4)} kg/s sau` +
            ` ${(tankSeries.times[tankSeries.times.length - 1] / 60).toFixed(0)} phút (giảm dần tự nhiên)`
        );
      }

      ({ times, rates } = spreadingPuddleTimeSeries(chemAtT, tankSeries, U10, stability, T_use, chem.rho_l, 0.05, 10.0, 7200.0));
    }
    diameterForRic = 6.0;
  } else if (scenario === 'tank_pressurized') {
    const isNh3Cl2 = params.p_isNh3Cl2;
    T_use = Number(params.p_T_tank) || 293;
    const A_f = Number(params.p_Af_tank) || 0.01;
    const P_h = Number(params.p_Ph) || 700000;
    const volRate = Number(params.p_volRate) || 0.5;
    const tankArea = Number(params.p_tankArea) || 3.14;

    const evalRes = evaluateTankRelease({
      holeBelowLiquidLevel: false,
      isSuperheated: true,
      isNh3OrCl2: isNh3Cl2,
      C_dis: 0.61,
      A_f,
      rho_l: chem.rho_l,
      P_h,
      P_a: P_ATM,
      MW: chem.mw,
      T: T_use,
      pipeLength: 0.0,
      volumetricReleaseRate: volRate,
      tankArea,
      voidFraction: 0.3,
      sigma: 0.02,
      rho_g: 5.0,
      gamma: 1.35,
      L_c: 3.0e5,
      cpLiquid: 1000.0,
    });
    decisionPath = evalRes.path;
    ({ times, rates } = syntheticDeclineSeries(evalRes.rate, 240));
    diameterForRic = 2.5;
  } else if (scenario === 'pipeline') {
    T_use = ambient;
    const pipeLength = Number(params.p_pipeLength) || 500;
    const pipeDiameter = Number(params.p_pipeDiameter) || 0.3;
    const holeDiameter = Number(params.p_holeDiameter) || 0.05;
    const P0 = Number(params.p_P0) || 5000000;
    const gamma = Number(params.p_gamma_pipe) || 1.31;
    const pipeArea = Math.PI * (pipeDiameter / 2) ** 2;
    const holeArea = Math.PI * (holeDiameter / 2) ** 2;

    const Q0 = initialChokedFlowRate(P0, holeArea, gamma, chem.mw, T_use);
    const MTotal = totalPipelineMass(P0, pipeArea, pipeLength, chem.mw, T_use);
    const { alpha, beta } = estimateAlphaBeta(
      Q0,
      MTotal,
      pipeLength,
      pipeDiameter,
      holeDiameter,
      gamma,
      chem.mw,
      T_use
    );
    const steps = pipelineTimeSteps(Q0, alpha, beta, MTotal, 5);

    decisionPath = [
      `#7 Newton-Raphson (Wilson) — Q0=${Q0.toFixed(3)} kg/s, tự sinh ${steps.length}/5 bước ổn định`,
    ];
    diameterForRic = pipeDiameter;

    return finishSimulation(
      steps,
      chem,
      T_use,
      U10,
      Ustar,
      stability,
      decisionPath,
      diameterForRic,
      windDirTo,
      sourceLat,
      sourceLon
    );
  }

  const steps = reduceTimesteps(times, rates, 5);
  return finishSimulation(
    steps,
    chem,
    T_use,
    U10,
    Ustar,
    stability,
    decisionPath,
    diameterForRic,
    windDirTo,
    sourceLat,
    sourceLon
  );
}

function finishSimulation(
  steps: SimulationResult['steps'],
  chem: Chemical,
  T_use: number,
  U10: number,
  Ustar: number,
  stability: string,
  decisionPath: string[],
  diameterForRic: number,
  windDirTo: number,
  sourceLat: number,
  sourceLon: number
): SimulationResult {
  const Qpeak = Math.max(...steps.map((s) => s.rate));
  const vpAtT_use = vaporPressureAtTemperature(chem, T_use).P;
  const chemVaporDensity = (vpAtT_use * chem.mw) / (R_GAS * T_use);

  const Ric = criticalRichardsonNumber(
    chemVaporDensity,
    AIR_DENSITY,
    Ustar,
    Qpeak,
    diameterForRic,
    U10
  );
  const model = chooseDispersionModel(Ric);
  const n = BRIGHTON_N[stability] ?? 0.142;

  // Matches pmbc_web's `contourAt` closure inside `finishSimulation`
  // (mophongphattan.component.ts:1143-1160) — one threat-level contour per
  // exposure threshold (ppm), each with its own derived LOC_kg_m3.
  const contourAt = (loc_ppm: number) => {
    const LOC_kg_m3 = (loc_ppm * 1e-6 * chem.mw * P_ATM) / (R_GAS * T_use);
    const r =
      model === 'heavy_gas'
        ? computeHeavyGasContour(Qpeak, chemVaporDensity, AIR_DENSITY, Ustar, U10, 10.0, n, LOC_kg_m3)
        : computeGaussianContour(Qpeak, U10, stability, LOC_kg_m3);
    return { ...r, loc_ppm, LOC_kg_m3, area: contourArea(r.contour) };
  };

  const hasAegl = chem.aegl1_ppm != null || chem.aegl2_ppm != null || chem.aegl3_ppm != null;
  let levels: ThreatLevel[] = [];

  if (hasAegl) {
    if (chem.aegl1_ppm != null) {
      levels.push({ key: 'aegl1', label: 'AEGL-1', ...AEGL_COLORS.aegl1, ...contourAt(chem.aegl1_ppm) });
    }
    if (chem.aegl2_ppm != null) {
      levels.push({ key: 'aegl2', label: 'AEGL-2', ...AEGL_COLORS.aegl2, ...contourAt(chem.aegl2_ppm) });
    }
    if (chem.aegl3_ppm != null) {
      levels.push({ key: 'aegl3', label: 'AEGL-3', ...AEGL_COLORS.aegl3, ...contourAt(chem.aegl3_ppm) });
    }
  } else {
    levels = [{ key: 'loc', label: chem.loc_src || 'LOC', ...AEGL_COLORS.loc, ...contourAt(chem.loc_ppm) }];
  }

  const xl = Math.max(0, ...levels.map((l) => l.xl));
  const maxHalfwidth = Math.max(
    0,
    ...levels.map((l) => (l.contour.length ? Math.max(...l.contour.map((c) => c.halfwidth)) : 0))
  );
  const maxArea = Math.max(0, ...levels.map((l) => l.area || 0));

  return {
    chem,
    steps,
    Qpeak,
    Ric,
    model,
    levels,
    xl,
    maxHalfwidth,
    maxArea,
    stability,
    U10,
    decisionPath,
    windDirTo: Number(windDirTo) || 90,
    sourceLat: Number(sourceLat) || 21.0285,
    sourceLon: Number(sourceLon) || 105.8542,
    ambientTemp: T_use,
  };
}
