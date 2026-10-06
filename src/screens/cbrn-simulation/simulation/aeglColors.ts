// Matches pmbc_web's `AEGL_COLORS` (mophongphattan.component.ts:681-686)
// exactly — shared by `runSimulation.ts` (building `ThreatLevel[]`),
// `realtimeModel.ts` (building `RtLevel[]`), `ThreatZoneView.tsx` and
// `buildMapHtml.ts` so every tab colors the same AEGL level identically.
export const AEGL_COLORS = {
  aegl1: { stroke: '#F5D949', fill: '#F5D949', fillOpacity: 0.22 },
  aegl2: { stroke: '#F0A83B', fill: '#E6702E', fillOpacity: 0.32 },
  aegl3: { stroke: '#E6555C', fill: '#C93A41', fillOpacity: 0.45 },
  loc: { stroke: '#FFB169', fill: '#E6702E', fillOpacity: 0.35 },
} as const;
