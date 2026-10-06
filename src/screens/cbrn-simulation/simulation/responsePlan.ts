// Matches pmbc_web's response-plan helpers exactly
// (mophongphattan.component.ts:3214-3226, `getLevelDescription` at
// :2777-2789) — pure functions so both the native floating card/modal AND
// the WebView's response-layer rendering (buildMapHtml.ts, which computes
// the same numbers independently in its own JS context) agree.
import type { SimulationResult } from './types';

export function getIsolationRadius(result: SimulationResult): number {
  return Math.max(150, Math.round(result.xl * 0.15));
}

export function getEvacBearing1(result: SimulationResult): number {
  return Math.round((result.windDirTo + 90) % 360);
}

export function getEvacBearing2(result: SimulationResult): number {
  return Math.round((result.windDirTo + 270) % 360);
}

// Matches pmbc_web's `formatArea()` (mophongphattan.component.ts:674-679).
export function formatArea(m2: number): string {
  if (!m2 || m2 <= 0) return '0 m²';
  if (m2 >= 1e6) return (m2 / 1e6).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' km²';
  if (m2 >= 10000) return (m2 / 10000).toLocaleString('en-US', { maximumFractionDigits: 2 }) + ' ha';
  return m2.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' m²';
}

export function getLevelDescription(key: string): string {
  const k = (key || '').toLowerCase();
  if (k.includes('aegl3') || k.includes('3')) {
    return 'Vùng đe dọa tính mạng hoặc gây tử vong (AEGL-3 / Cực kỳ nguy hiểm)';
  }
  if (k.includes('aegl2') || k.includes('2')) {
    return 'Vùng gây tổn thương không thể hồi phục hoặc suy giảm nghiêm trọng khả năng tự thoát hiểm (AEGL-2 / Nguy hiểm cao)';
  }
  if (k.includes('aegl1') || k.includes('1')) {
    return 'Vùng gây khó chịu đáng kể hoặc kích ứng mắt, đường hô hấp có thể phục hồi (AEGL-1 / Cảnh báo)';
  }
  return 'Vùng vượt ngưỡng nồng độ quan tâm (LOC)';
}
