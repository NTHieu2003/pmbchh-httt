import type { DepartmentItem, VanbanphapquyItem } from '@/types';

export type ActiveLevel = 'very_active' | 'active' | 'normal' | 'low';

export interface DepartmentVanBanStats {
  departmentCode: string;
  departmentName: string;
  total: number;
  luatCount: number;
  nghiDinhCount: number;
  thongTuCount: number;
  quyetDinhCount: number;
  otherCount: number;
  conHieuLucCount: number;
  percent: number;
  target: number;
  completionRate: number;
  activeLevel: ActiveLevel;
  lastUpdated: string;
  rank: number;
  documents: VanbanphapquyItem[];
}

export interface StatsSummary {
  totalUnits: number;
  activeUnits: number;
  totalVanBan: number;
  avgVanBanPerUnit: string;
  coverageRate: number;
  topUnit: DepartmentVanBanStats | null;
  veryActiveCount: number;
  highestCount: number;
}

const TARGET_PER_UNIT = 15; // Chỉ tiêu mẫu — matches web's hardcoded `target`.

// Ports pmbc_web's ThongKeVanbanphapquyComponent.buildDepartmentStats() 1:1
// — groups documents by `donvi_tao`, classifies by loại văn bản (free-text
// `gid_loaivbST` substring match, same as web) and trạng thái hiệu lực.
export const buildDepartmentStats = (
  departments: DepartmentItem[] | null | undefined,
  documents: VanbanphapquyItem[] | null | undefined
): DepartmentVanBanStats[] => {
  // Defensive against a malformed/partial API response: a missing array,
  // or `null` entries inside an otherwise-valid array, would otherwise
  // throw when accessing `.donvi_tao`/`.departmentCode` below and crash
  // the screen.
  const safeDocuments = (documents ?? []).filter(
    (doc): doc is VanbanphapquyItem => doc != null
  );
  const safeDepartments = (departments ?? []).filter(
    (dept): dept is DepartmentItem => dept != null
  );

  const totalDocsAll = safeDocuments.length || 1;

  const docsByDept = new Map<string, VanbanphapquyItem[]>();
  for (const doc of safeDocuments) {
    const code = (doc.donvi_tao || '').toString().trim();
    if (!docsByDept.has(code)) docsByDept.set(code, []);
    docsByDept.get(code)!.push(doc);
  }

  const items: DepartmentVanBanStats[] = safeDepartments.map((dept) => {
    const deptDocs = docsByDept.get(dept.departmentCode ?? '') || [];
    const total = deptDocs.length;

    let luatCount = 0;
    let nghiDinhCount = 0;
    let thongTuCount = 0;
    let quyetDinhCount = 0;
    let otherCount = 0;
    let conHieuLucCount = 0;
    let lastUpdated = '';

    for (const d of deptDocs) {
      const typeStr = (d.gid_loaivbST || '').toLowerCase();
      if (typeStr.includes('luật')) luatCount++;
      else if (typeStr.includes('nghị định')) nghiDinhCount++;
      else if (typeStr.includes('thông tư')) thongTuCount++;
      else if (typeStr.includes('quyết định')) quyetDinhCount++;
      else otherCount++;

      const statusStr = (d.trang_thaiST || '').toLowerCase();
      if (!statusStr.includes('hết') && d.trang_thai !== 2) conHieuLucCount++;

      const date = d.ngay_cap_nhat || d.ngay_tao || d.ngay_banhanh || '';
      if (date && date > lastUpdated) lastUpdated = date;
    }

    const percent = Math.round((total / totalDocsAll) * 1000) / 10;
    const completionRate = Math.min(100, Math.round((total / TARGET_PER_UNIT) * 100));

    let activeLevel: ActiveLevel = 'low';
    if (total >= 15) activeLevel = 'very_active';
    else if (total >= 8) activeLevel = 'active';
    else if (total >= 1) activeLevel = 'normal';

    return {
      departmentCode: dept.departmentCode ?? '',
      departmentName: dept.departmentName ?? '',
      total,
      luatCount,
      nghiDinhCount,
      thongTuCount,
      quyetDinhCount,
      otherCount,
      conHieuLucCount,
      percent,
      target: TARGET_PER_UNIT,
      completionRate,
      activeLevel,
      lastUpdated: lastUpdated || 'Chưa cập nhật',
      rank: 0,
      documents: deptDocs,
    };
  });

  items.sort((a, b) => b.total - a.total);
  items.forEach((item, index) => {
    item.rank = index + 1;
  });

  return items;
};

export const buildSummary = (stats: DepartmentVanBanStats[] | null | undefined): StatsSummary => {
  const safeStats = stats ?? [];
  const totalUnits = safeStats.length;
  const activeUnits = safeStats.filter((item) => item.total > 0).length;
  const totalVanBan = safeStats.reduce((sum, item) => sum + item.total, 0);
  const avgVanBanPerUnit = totalUnits > 0 ? (totalVanBan / totalUnits).toFixed(1) : '0';
  const coverageRate = totalUnits > 0 ? Math.round((activeUnits / totalUnits) * 100) : 0;
  const topUnit = safeStats.length > 0 ? safeStats[0] : null;
  const veryActiveCount = safeStats.filter((i) => i.activeLevel === 'very_active').length;

  return {
    totalUnits,
    activeUnits,
    totalVanBan,
    avgVanBanPerUnit,
    coverageRate,
    topUnit,
    veryActiveCount,
    highestCount: topUnit ? topUnit.total : 0,
  };
};

export const formatNumber = (val: number): string => new Intl.NumberFormat('vi-VN').format(val || 0);

// `lastUpdated`/document dates come through as raw ISO strings (sometimes
// full timestamps) — too long for a table column. Shows just dd/MM/yyyy;
// falls back to the raw value for anything that isn't ISO-shaped.
export const formatDateDisplay = (raw: string): string => {
  if (!raw) return '—';
  const datePart = raw.split('T')[0];
  const parts = datePart.split('-');
  if (parts.length === 3 && parts[0].length === 4) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return raw;
};

export const ACTIVE_LEVEL_LABEL: Record<ActiveLevel, string> = {
  very_active: '★ Rất tích cực',
  active: 'Tích cực',
  normal: 'Đạt yêu cầu',
  low: 'Chưa có VB',
};
