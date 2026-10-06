import { useEffect, useMemo, useState } from 'react';

import { ChemicalApi } from '@/api/chemical';
import { useDebounce } from '@/hooks/useDebounce';

import {
  CHEM_DB,
  DEFAULT_SCENARIO_PARAMS,
  P_ATM,
  buildRtModel,
  computeRtFrame,
  isLiquidScenario,
  pasquillStabilityClass,
  runSimulation,
  vaporPressureAtTemperature,
} from './simulation';

import type {
  Chemical,
  Insolation,
  ScenarioKey,
  ScenarioParams,
  SimulationResult,
} from './simulation';

export type ResultTab = 'threat_zone' | 'map_2d' | 'realtime';

const RT_SPEED_OPTIONS = [1, 5, 10, 30, 60, 120] as const;

// Mirrors pmbc_web's MophongphattanComponent state/handlers 1:1
// (chemical search, atmosphere+stability, source location, scenario
// params, run/finishSimulation) — see `simulation/runSimulation.ts` for
// the ported physics orchestration this hook calls into.
export const useCbrnSimulation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // --- Chemical search --- (dropdown open/close is owned by AppSelect
  // itself now — this hook only owns the data: query, results, loading,
  // selection.)
  const [chemQuery, setChemQuery] = useState('');
  const debouncedChemQuery = useDebounce(chemQuery, 300);
  const [filteredChems, setFilteredChems] = useState<Chemical[]>([]);
  const [selectedChem, setSelectedChem] = useState<Chemical | null>(null);
  const [isChemSearching, setIsChemSearching] = useState(false);

  // Matches pmbc_web's onChemQueryChange exactly: local CHEM_DB (421
  // CAMEO chemicals with full AEGL data) is the PRIMARY source and
  // resolves instantly; the backend's `chemical/search` is only merged in
  // afterward for names not already found locally (and never has AEGL
  // data, since that's not a column on the backend table).
  useEffect(() => {
    const query = debouncedChemQuery.trim();
    if (!query) {
      setFilteredChems([]);
      return;
    }

    const q = query.toLowerCase();
    const localMatches = CHEM_DB.filter(
      (c) => c.name.toLowerCase().includes(q) || c.cas?.toLowerCase().includes(q)
    ).slice(0, 10);
    setFilteredChems(localMatches);

    setIsChemSearching(true);
    ChemicalApi.search({ keyword: query, pageIndex: 0, pageSize: 10 })
      .then((chems) => {
        setFilteredChems((prev) => {
          const existingNames = new Set(prev.map((c) => c.name.toLowerCase()));
          const extra = chems.filter((c) => !existingNames.has(c.name.toLowerCase()));
          return [...prev, ...extra];
        });
      })
      .catch(() => {})
      .finally(() => setIsChemSearching(false));
  }, [debouncedChemQuery]);

  const selectChemical = (chem: Chemical) => {
    setSelectedChem(chem);
    setChemQuery(chem.name);

    setScenarioParams((prev) => ({
      ...prev,
      p_isNh3Cl2: chem.cas === '7782-50-5' || chem.cas === '7664-41-7',
      p_Ph: Math.round(chem.vp_pa ?? 0),
      p_T_tank: chem.bp_K != null ? Number(chem.bp_K.toFixed(1)) : 293,
    }));
  };

  // --- Atmosphere ---
  const [windSpeed, setWindSpeed] = useState(3.0);
  const [windDirTo, setWindDirTo] = useState(90);
  const [isDaytime, setIsDaytime] = useState(true);
  const [insolation, setInsolation] = useState<Insolation>('vua');
  const [cloudCoverPct, setCloudCoverPct] = useState(50);
  // Shared by #1 Direct, #6 Vũng, #2 Bồn lỏng rò rỉ, #7 Đường ống — each
  // re-derives its vapor pressure at this temperature via Clausius-
  // Clapeyron (`vaporPressureAtTemperature`) instead of a hardcoded 293K.
  // #4/#5 Bồn quá nhiệt keeps its own separate `p_T_tank` field.
  const [ambientTemp, setAmbientTemp] = useState(293.0);

  const calculatedStability = useMemo(
    () => pasquillStabilityClass(windSpeed || 0, isDaytime, insolation, cloudCoverPct),
    [windSpeed, isDaytime, insolation, cloudCoverPct]
  );

  // --- Source location ---
  const [sourceLat, setSourceLat] = useState(21.0285);
  const [sourceLon, setSourceLon] = useState(105.8542);

  // --- Scenario ---
  const [currentScenario, setCurrentScenario] = useState<ScenarioKey>('direct');
  const [scenarioParams, setScenarioParams] = useState<ScenarioParams>(
    DEFAULT_SCENARIO_PARAMS
  );
  const updateScenarioParam = <K extends keyof ScenarioParams>(
    key: K,
    value: ScenarioParams[K]
  ) => setScenarioParams((prev) => ({ ...prev, [key]: value }));

  // Matches web's `checkLiquidValidity()` — now re-estimates vapor
  // pressure AT `ambientTemp` (Clausius-Clapeyron) instead of comparing
  // the chemical's raw reference `vp_pa`, and is purely advisory: web no
  // longer blocks the run button over it (see `isRunDisabled` below).
  const liquidWarningMessage = useMemo(() => {
    if (!selectedChem || !isLiquidScenario(currentScenario)) return null;
    const T = Number(ambientTemp) || 293.0;
    const vpAtT = vaporPressureAtTemperature(selectedChem, T).P;
    if (vpAtT >= P_ATM) {
      return (
        `⚠ ${selectedChem.name} có áp suất hơi ước tính (${vpAtT.toLocaleString('en-US', { maximumFractionDigits: 0 })} Pa) ` +
        `vượt áp suất khí quyển ở ${T}K — chất này là KHÍ ở nhiệt độ này, không thể tạo vũng lỏng ổn định. ` +
        `Dùng kịch bản "Bồn quá nhiệt" thay vì "Vũng"/"Bồn lỏng rò rỉ", hoặc giảm nhiệt độ môi trường.`
      );
    }
    return null;
  }, [selectedChem, currentScenario, ambientTemp]);

  // Matches web's `checkTankHeightValidity()` — only relevant to #2 Bồn
  // lỏng rò rỉ, where the hole/liquid levels must physically fit inside
  // the tank.
  const tankHeightWarning = useMemo(() => {
    if (currentScenario !== 'tank_liquid_spreading') return null;
    const holeHeight = Number(scenarioParams.p_holeHeight) || 0;
    const liquidHeight = Number(scenarioParams.p_liquidHeight) || 0;
    const tankHeight = Number(scenarioParams.p_tankHeight) || 0;
    const problems: string[] = [];
    if (liquidHeight > tankHeight) {
      problems.push(`mực lỏng ban đầu (${liquidHeight}m) vượt quá chiều cao bồn (${tankHeight}m)`);
    }
    if (holeHeight > tankHeight) {
      problems.push(`độ cao lỗ (${holeHeight}m) vượt quá chiều cao bồn (${tankHeight}m)`);
    }
    if (!problems.length) return null;
    return (
      `⚠ Không hợp lệ: ${problems.join('; ')} — bồn không thể chứa cột chất lỏng hoặc có lỗ cao hơn chính chiều cao vật lý của nó.`
    );
  }, [currentScenario, scenarioParams.p_holeHeight, scenarioParams.p_liquidHeight, scenarioParams.p_tankHeight]);

  // Matches web's `get isRunDisabled()` — only blocks on "no chemical
  // selected" now; the liquid-at-this-temperature case is advisory only
  // (`liquidWarningMessage`), same for the tank-geometry case (the run
  // itself reports it in `decisionPath` instead of refusing to run).
  const isRunDisabled = useMemo(() => !selectedChem, [selectedChem]);

  // --- Result ---
  const [result, setResult] = useState<SimulationResult | null>(null);
  // Bumped on every run — used as a stable React key for the map WebView
  // (which must fully reload its HTML per run; `result` itself is a new
  // object reference each time, but that's not a safe/unique key on its
  // own).
  const [resultVersion, setResultVersion] = useState(0);
  const [activeResultTab, setActiveResultTab] = useState<ResultTab>('threat_zone');

  const run = (): SimulationResult | null => {
    if (isRunDisabled || !selectedChem) return null;
    const nextResult = runSimulation({
      chem: selectedChem,
      windSpeed,
      windDirTo,
      stability: calculatedStability,
      ambientTemp,
      sourceLat,
      sourceLon,
      scenario: currentScenario,
      params: scenarioParams,
    });
    setResult(nextResult);
    setResultVersion((v) => v + 1);
    return nextResult;
  };

  const maxHalfwidth = useMemo(() => result?.maxHalfwidth ?? 0, [result]);

  // Matches pmbc_web's `setSourceAtDomainCenter` — moves the source marker
  // to the domain-selection rectangle's center WITHOUT re-running the
  // physics (same contour, just re-anchored), then bumps `resultVersion`
  // so the map WebView reloads showing it at the new position.
  const setSourceAtDomainCenter = (lat: number, lon: number) => {
    const roundedLat = Number(lat.toFixed(4));
    const roundedLon = Number(lon.toFixed(4));
    setSourceLat(roundedLat);
    setSourceLon(roundedLon);
    setResult((prev) => (prev ? { ...prev, sourceLat: roundedLat, sourceLon: roundedLon } : prev));
    setResultVersion((v) => v + 1);
  };

  // --- Realtime tab ("⏱️ THỜI GIAN THỰC") ---
  // Playback state lives here (not in RealtimeView) so re-running the
  // simulation or switching tabs doesn't lose it, matching web's
  // component-level `rt*` fields.
  const rtModel = useMemo(() => (result ? buildRtModel(result) : null), [result]);
  const [rtTime, setRtTime] = useState(0);
  const [rtPlaying, setRtPlaying] = useState(false);
  const [rtSpeed, setRtSpeed] = useState<number>(RT_SPEED_OPTIONS[0]);
  const [rtStartClock, setRtStartClock] = useState(() => new Date());
  const [rtAutoPlayPending, setRtAutoPlayPending] = useState(false);

  // Matches web's `onRtResultChanged` — a freshly (re)run model always
  // restarts from t = 0, paused.
  useEffect(() => {
    setRtPlaying(false);
    setRtTime(0);
  }, [rtModel]);

  const rtFrame = useMemo(
    () => (rtModel ? computeRtFrame(rtModel, rtTime) : null),
    [rtModel, rtTime]
  );

  // 250ms tick, matching web's `rtPlay` interval — advances by real
  // elapsed time scaled by `rtSpeed`, not a fixed step, so playback speed
  // changes take effect immediately without a restart.
  useEffect(() => {
    if (!rtPlaying || !rtModel) return;
    let lastTick = Date.now();
    const timer = setInterval(() => {
      const now = Date.now();
      const dt = ((now - lastTick) / 1000) * (Number(rtSpeed) || 1);
      lastTick = now;
      setRtTime((prev) => {
        const next = Math.min(rtModel.tMax, prev + dt);
        if (next >= rtModel.tMax) setRtPlaying(false);
        return next;
      });
    }, 250);
    return () => clearInterval(timer);
  }, [rtPlaying, rtModel, rtSpeed]);

  const rtTogglePlay = () => {
    if (!rtModel) return;
    setRtPlaying((prev) => {
      if (!prev && rtTime >= rtModel.tMax) setRtTime(0);
      return !prev;
    });
  };

  const rtReset = () => {
    setRtPlaying(false);
    setRtTime(0);
  };

  const rtSeek = (t: number) => {
    if (!rtModel) return;
    setRtTime(Math.max(0, Math.min(rtModel.tMax, t)));
  };

  const rtSetStartNow = () => setRtStartClock(new Date());

  const rtCurrentClock = useMemo(
    () => new Date(rtStartClock.getTime() + rtTime * 1000),
    [rtStartClock, rtTime]
  );

  // Matches web's "⏱ CHẠY THỜI GIAN THỰC" button: run the model, jump to
  // the realtime tab, and auto-play — but only once a *new* result
  // actually lands (a run that bailed out on bad params keeps showing the
  // previous one, so it shouldn't restart playback).
  const runRealtime = () => {
    const prevResult = result;
    const nextResult = run();
    setActiveResultTab('realtime');
    if (nextResult && nextResult !== prevResult) setRtAutoPlayPending(true);
  };

  useEffect(() => {
    if (rtAutoPlayPending && rtModel) {
      setRtTime(0);
      setRtPlaying(true);
      setRtAutoPlayPending(false);
    }
  }, [rtAutoPlayPending, rtModel]);

  return {
    isSidebarOpen,
    toggleSidebar,

    chemQuery,
    setChemQuery,
    filteredChems,
    isChemSearching,
    selectedChem,
    selectChemical,

    windSpeed,
    setWindSpeed,
    windDirTo,
    setWindDirTo,
    isDaytime,
    setIsDaytime,
    insolation,
    setInsolation,
    cloudCoverPct,
    setCloudCoverPct,
    calculatedStability,
    ambientTemp,
    setAmbientTemp,

    sourceLat,
    setSourceLat,
    sourceLon,
    setSourceLon,

    currentScenario,
    setCurrentScenario,
    scenarioParams,
    updateScenarioParam,
    liquidWarningMessage,
    tankHeightWarning,
    isRunDisabled,

    result,
    resultVersion,
    activeResultTab,
    setActiveResultTab,
    run,
    maxHalfwidth,
    setSourceAtDomainCenter,

    rtModel,
    rtFrame,
    rtTime,
    rtPlaying,
    rtSpeed,
    rtSpeedOptions: RT_SPEED_OPTIONS,
    setRtSpeed,
    rtStartClock,
    rtCurrentClock,
    rtTogglePlay,
    rtReset,
    rtSeek,
    rtSetStartNow,
    runRealtime,
  };
};

export type UseCbrnSimulationResult = ReturnType<typeof useCbrnSimulation>;
