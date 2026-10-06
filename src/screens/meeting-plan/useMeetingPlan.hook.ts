import { useCallback, useEffect, useState } from 'react';

import { KhtochuchopApi } from '@/api/khtochuchop';

import type { KhtochuchopItem } from '@/types';

export interface UseMeetingPlanResult {
  items: KhtochuchopItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
  onPullToRefresh: () => void;
}

const PAGE_SIZE = 50;

// "Kế hoạch tổ chức họp" — danh sách kế hoạch, mỗi mục mở vào
// "Phòng họp không giấy" tương ứng. Mirrors pmbc_mobile's KehoachHop.tsx,
// minus its in-app pagination control (mobile list just loads a generous
// page and scrolls, matching this app's other list screens).
export const useMeetingPlan = (): UseMeetingPlanResult => {
  const [items, setItems] = useState<KhtochuchopItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadData = useCallback((isPullToRefresh = false) => {
    if (isPullToRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setIsError(false);

    KhtochuchopApi.search({ pageIndex: 0, pageSize: PAGE_SIZE })
      .then((res) => setItems((res.lstKHtochuchop ?? []).filter(Boolean)))
      .catch(() => {
        setItems([]);
        setIsError(true);
      })
      .finally(() => {
        if (isPullToRefresh) setIsRefreshing(false);
        else setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onPullToRefresh = useCallback(() => loadData(true), [loadData]);

  return { items, isLoading, isRefreshing, isError, refetch: loadData, onPullToRefresh };
};
