import { useMemo, useState } from 'react';

import { useDebounce } from '@/hooks/useDebounce';
import { useQlChuyenNganhDacThuList } from '@/queries/qlchuyennganhdacthu';

import type { QlChuyenNganhDacThu } from '@/types';

export interface UseRightSidebarResult {
  domainList: QlChuyenNganhDacThu[];
  filteredDomainList: QlChuyenNganhDacThu[];
  totalCount: number;
  selectedCount: number;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isSearchOpen: boolean;
  toggleSearch: () => void;
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isDomainSelected: (gid: number) => boolean;
  toggleDomain: (gid: number) => void;
  selectAllDomains: () => void;
  deselectAllDomains: () => void;
}

export const useRightSidebar = (): UseRightSidebarResult => {
  const { data, isLoading, isError, refetch } = useQlChuyenNganhDacThuList();
  const domainList = useMemo(() => data ?? [], [data]);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedDomainIds, setSelectedDomainIds] = useState<Set<number>>(
    () => new Set()
  );

  const toggleSearch = () => {
    setIsSearchOpen((prev) => {
      // Web clears the keyword when the search box closes — same here.
      if (prev) setSearchKeyword('');
      return !prev;
    });
  };

  const debouncedSearchKeyword = useDebounce(searchKeyword, 300);

  const filteredDomainList = useMemo(() => {
    const keyword = debouncedSearchKeyword.trim().toLowerCase();
    if (!keyword) return domainList;

    return domainList.filter((item) =>
      [item.ten, item.viet_tat, item.mo_ta].some((field) =>
        field?.toLowerCase().includes(keyword)
      )
    );
  }, [domainList, debouncedSearchKeyword]);

  const isDomainSelected = (gid: number) => selectedDomainIds.has(gid);

  const toggleDomain = (gid: number) => {
    setSelectedDomainIds((prev) => {
      const next = new Set(prev);
      if (next.has(gid)) {
        next.delete(gid);
      } else {
        next.add(gid);
      }
      return next;
    });
  };

  // Selects every domain, not just the currently-filtered ones — matches
  // web's selectAllDomains(), which iterates the full domainList.
  const selectAllDomains = () => {
    setSelectedDomainIds(new Set(domainList.map((item) => item.gid)));
  };

  const deselectAllDomains = () => setSelectedDomainIds(new Set());

  return {
    domainList,
    filteredDomainList,
    totalCount: domainList.length,
    selectedCount: selectedDomainIds.size,
    isLoading,
    isError,
    refetch,
    isCollapsed,
    toggleCollapse,
    isSearchOpen,
    toggleSearch,
    searchKeyword,
    setSearchKeyword,
    isDomainSelected,
    toggleDomain,
    selectAllDomains,
    deselectAllDomains,
  };
};
