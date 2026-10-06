import { useCallback, useEffect, useMemo, useState } from 'react';

import { DepartmentApi } from '@/api/department';
import { VanbanphapquyApi } from '@/api/vanbanphapquy';

import { buildDepartmentStats, buildSummary } from './statsCompute';

import type { DepartmentVanBanStats, StatsSummary } from './statsCompute';

export type SortKey = 'rank' | 'departmentName' | 'total' | 'percent';
export type SortDirection = 'asc' | 'desc';
export type ActiveLevelFilter = 'ALL' | 'very_active' | 'active' | 'normal' | 'low';

const PAGE_SIZE_OPTIONS = [10, 20, 50];

export interface UseDashboardDataProgressResult {
  isLoading: boolean;
  isError: boolean;
  summary: StatsSummary;
  top5: DepartmentVanBanStats[];
  loadStats: () => void;

  // Table — search / filter / sort / pagination
  searchTerm: string;
  setSearchTerm: (text: string) => void;
  activeLevelFilter: ActiveLevelFilter;
  setActiveLevelFilter: (level: ActiveLevelFilter) => void;
  showOnlyActive: boolean;
  toggleShowOnlyActive: () => void;
  sortKey: SortKey;
  sortDirection: SortDirection;
  toggleSort: (key: SortKey) => void;
  filteredStats: DepartmentVanBanStats[];
  paginatedStats: DepartmentVanBanStats[];
  currentPage: number;
  totalPages: number;
  pageSize: number;
  pageSizeOptions: number[];
  setPageSize: (size: number) => void;
  goPrevPage: () => void;
  goNextPage: () => void;

  // Unit detail modal
  selectedUnit: DepartmentVanBanStats | null;
  openUnitDetail: (unit: DepartmentVanBanStats) => void;
  closeUnitDetail: () => void;
}

// Mirrors pmbc_web's ThongKeVanbanphapquyComponent — no dedicated stats
// API, fetches the full department list + full văn bản list (pageSize
// 10000) and aggregates client-side. Mobile drops the back-link header,
// Excel export, podium/progress-bar leaderboard and the 3-tab chart
// section per explicit scope cut; keeps the KPI cards, a flat Top-5 grid
// and the detailed data table (search/filter/sort/pagination + modal).
export const useDashboardDataProgress = (): UseDashboardDataProgressResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [statsByDepartment, setStatsByDepartment] = useState<DepartmentVanBanStats[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeLevelFilter, setActiveLevelFilter] = useState<ActiveLevelFilter>('ALL');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('total');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(10);

  const [selectedUnit, setSelectedUnit] = useState<DepartmentVanBanStats | null>(null);

  const loadStats = useCallback(() => {
    setIsLoading(true);
    setIsError(false);

    Promise.all([
      DepartmentApi.getListDepartment(),
      VanbanphapquyApi.search({ pageIndex: 0, pageSize: 10000 }),
    ])
      .then(([departments, vbRes]) => {
        setStatsByDepartment(buildDepartmentStats(departments, vbRes?.lstVanbanphapquy ?? []));
      })
      .catch(() => {
        setStatsByDepartment([]);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const summary = useMemo(() => buildSummary(statsByDepartment), [statsByDepartment]);

  const top5 = useMemo(
    () => statsByDepartment.filter((item) => item.total > 0).slice(0, 5),
    [statsByDepartment]
  );

  const toggleShowOnlyActive = useCallback(() => {
    setShowOnlyActive((prev) => !prev);
    setCurrentPage(1);
  }, []);

  const toggleSort = useCallback((key: SortKey) => {
    setSortKey((prevKey) => {
      setSortDirection((prevDir) => (prevKey === key ? (prevDir === 'asc' ? 'desc' : 'asc') : 'desc'));
      return key;
    });
    setCurrentPage(1);
  }, []);

  const filteredStats = useMemo(() => {
    let list = statsByDepartment;

    const term = searchTerm.trim().toLowerCase();
    if (term) {
      list = list.filter(
        (item) =>
          item.departmentName.toLowerCase().includes(term) ||
          item.departmentCode.toLowerCase().includes(term)
      );
    }

    if (showOnlyActive) {
      list = list.filter((item) => item.total > 0);
    }

    if (activeLevelFilter !== 'ALL') {
      list = list.filter((item) => item.activeLevel === activeLevelFilter);
    }

    const sorted = [...list].sort((a, b) => {
      const valA = a[sortKey];
      const valB = b[sortKey];
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB, 'vi') : valB.localeCompare(valA, 'vi');
      }
      return sortDirection === 'asc'
        ? (valA as number) - (valB as number)
        : (valB as number) - (valA as number);
    });

    return sorted;
  }, [statsByDepartment, searchTerm, showOnlyActive, activeLevelFilter, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filteredStats.length / pageSize));

  const paginatedStats = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStats.slice(start, start + pageSize);
  }, [filteredStats, currentPage, pageSize]);

  const setSearchTermAndReset = useCallback((text: string) => {
    setSearchTerm(text);
    setCurrentPage(1);
  }, []);

  const setActiveLevelFilterAndReset = useCallback((level: ActiveLevelFilter) => {
    setActiveLevelFilter(level);
    setCurrentPage(1);
  }, []);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(size);
    setCurrentPage(1);
  }, []);

  const goPrevPage = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const goNextPage = useCallback(
    () => setCurrentPage((p) => Math.min(totalPages, p + 1)),
    [totalPages]
  );

  const openUnitDetail = useCallback((unit: DepartmentVanBanStats) => setSelectedUnit(unit), []);
  const closeUnitDetail = useCallback(() => setSelectedUnit(null), []);

  return {
    isLoading,
    isError,
    summary,
    top5,
    loadStats,

    searchTerm,
    setSearchTerm: setSearchTermAndReset,
    activeLevelFilter,
    setActiveLevelFilter: setActiveLevelFilterAndReset,
    showOnlyActive,
    toggleShowOnlyActive,
    sortKey,
    sortDirection,
    toggleSort,
    filteredStats,
    paginatedStats,
    currentPage,
    totalPages,
    pageSize,
    pageSizeOptions: PAGE_SIZE_OPTIONS,
    setPageSize,
    goPrevPage,
    goNextPage,

    selectedUnit,
    openUnitDetail,
    closeUnitDetail,
  };
};
