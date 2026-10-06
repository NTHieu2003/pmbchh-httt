import { useCallback, useEffect, useMemo, useState } from 'react';

import { ApiDashboardUserApi } from '@/api/apidashboarduser';

import type { AppSelectOption } from '@/components/AppSelect';
import type { ApiDashboardUserItem } from '@/types';

export interface DashboardKpi {
  totalUsers: number;
  totalUsersGrowth: number | null;
  activeUsers: number;
  activeUsersGrowth: number | null;
  accessCount: number;
  accessCountGrowth: number | null;
  actionCount: number;
  actionCountGrowth: number | null;
}

const EMPTY_KPI: DashboardKpi = {
  totalUsers: 0,
  totalUsersGrowth: null,
  activeUsers: 0,
  activeUsersGrowth: null,
  accessCount: 0,
  accessCountGrowth: null,
  actionCount: 0,
  actionCountGrowth: null,
};

// Default period — matches pmbc_web's DashboardUserComponent.createForm(),
// except web defaults to "last 30 days"; mobile was asked for "from Jan 1st
// of the current year" instead.
const defaultFromDate = () => new Date(new Date().getFullYear(), 0, 1);
const defaultToDate = () => new Date();

export interface UseDashboardUserStatsResult {
  isLoading: boolean;
  kpi: DashboardKpi;
  lstTheoDonVi: ApiDashboardUserItem[];
  lstTheoNguoiDung: ApiDashboardUserItem[];
  displayTopDonVi: ApiDashboardUserItem[];
  displayTopNguoiDung: ApiDashboardUserItem[];

  // Filter bar
  fromDate: Date;
  setFromDate: (date: Date) => void;
  toDate: Date;
  setToDate: (date: Date) => void;
  donViQuery: string;
  setDonViQuery: (text: string) => void;
  donViOptions: AppSelectOption[];
  onSelectDonVi: (option: AppSelectOption) => void;
  onClearDonVi: () => void;
  doSearch: () => void;
  doRefresh: () => void;
}

// Mirrors pmbc_web's DashboardUserComponent — filter bar (Từ ngày/Đến ngày/
// Đơn vị + Tìm kiếm/Làm mới), KPI cards and the two Top-5 tables. The period
// line, both charts and the Excel/PDF export card are web-only (dropped
// per explicit scope cut).
export const useDashboardUserStats = (): UseDashboardUserStatsResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [kpi, setKpi] = useState<DashboardKpi>(EMPTY_KPI);
  const [lstTheoDonVi, setLstTheoDonVi] = useState<ApiDashboardUserItem[]>([]);
  const [lstTheoNguoiDung, setLstTheoNguoiDung] = useState<ApiDashboardUserItem[]>([]);
  const [lstDonViFilter, setLstDonViFilter] = useState<ApiDashboardUserItem[]>([]);

  const [fromDate, setFromDate] = useState<Date>(defaultFromDate);
  const [toDate, setToDate] = useState<Date>(defaultToDate);
  const [deptCode, setDeptCode] = useState('');
  const [donViQuery, setDonViQueryState] = useState('');

  const loadData = useCallback((from: Date, to: Date, dept: string) => {
    setIsLoading(true);
    ApiDashboardUserApi.getData({
      fromDate: from.toISOString(),
      toDate: to.toISOString(),
      deptCode: dept,
    })
      .then((res) => {
        setKpi({
          totalUsers: res.totalUsers || 0,
          totalUsersGrowth: res.totalUsersGrowth ?? null,
          activeUsers: res.activeUsers || 0,
          activeUsersGrowth: res.activeUsersGrowth ?? null,
          accessCount: res.accessCount || 0,
          accessCountGrowth: res.accessCountGrowth ?? null,
          actionCount: res.actionCount || 0,
          actionCountGrowth: res.actionCountGrowth ?? null,
        });
        // `.filter(Boolean)` guards against a malformed response slipping a
        // `null` entry into these arrays — each item's fields get read
        // directly (`item.sttExport`, `item.deptName`, ...) downstream, and
        // a null item there would throw and crash the screen.
        setLstTheoDonVi((res.lstTheoDonVi ?? []).filter(Boolean));
        setLstTheoNguoiDung((res.lstTheoNguoiDung ?? []).filter(Boolean));
        setLstDonViFilter((res.lstDonViFilter ?? []).filter(Boolean));
      })
      .catch(() => {
        setKpi(EMPTY_KPI);
        setLstTheoDonVi([]);
        setLstTheoNguoiDung([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadData(fromDate, toDate, deptCode);
    // Only on mount — doSearch()/doRefresh() drive subsequent loads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Matches web's `filteredDonVi` getter — options filtered locally as the
  // user types (AppSelect's `filterLocally`), sourced from the same
  // getData response (`lstDonViFilter`), same as the real autocomplete.
  // A leading "Tất cả đơn vị" entry (dashboard-only, not part of the
  // generic AppSelect) lets the user explicitly pick "no filter".
  const donViOptions = useMemo<AppSelectOption[]>(() => {
    const allOption: AppSelectOption = {
      key: '__ALL__',
      label: 'Tất cả đơn vị',
      raw: { deptCode: '', deptName: 'Tất cả đơn vị' } as ApiDashboardUserItem,
    };
    return [
      allOption,
      ...lstDonViFilter.map((item) => ({
        key: item.deptCode || item.deptName || '',
        label: item.deptName || '',
        raw: item,
      })),
    ];
  }, [lstDonViFilter]);

  const setDonViQuery = useCallback((text: string) => {
    setDonViQueryState(text);
    // Typing (not yet selected) clears the applied filter, same as web's
    // onDonViInput() — only an actual selection re-applies deptCode.
    setDeptCode('');
  }, []);

  const onSelectDonVi = useCallback((option: AppSelectOption) => {
    const item = option.raw as ApiDashboardUserItem;
    setDonViQueryState(item.deptName || '');
    setDeptCode(item.deptCode || '');
  }, []);

  const onClearDonVi = useCallback(() => {
    setDonViQueryState('');
    setDeptCode('');
  }, []);

  const doSearch = useCallback(() => {
    loadData(fromDate, toDate, deptCode);
  }, [loadData, fromDate, toDate, deptCode]);

  const doRefresh = useCallback(() => {
    const from = defaultFromDate();
    const to = defaultToDate();
    setFromDate(from);
    setToDate(to);
    setDeptCode('');
    setDonViQueryState('');
    loadData(from, to, '');
  }, [loadData]);

  return {
    isLoading,
    kpi,
    lstTheoDonVi,
    lstTheoNguoiDung,
    displayTopDonVi: lstTheoDonVi.slice(0, 5),
    displayTopNguoiDung: lstTheoNguoiDung.slice(0, 5),
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    donViQuery,
    setDonViQuery,
    donViOptions,
    onSelectDonVi,
    onClearDonVi,
    doSearch,
    doRefresh,
  };
};
