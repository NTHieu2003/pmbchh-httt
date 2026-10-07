import { useCallback, useEffect, useState } from 'react';

import { ApiDashboardUserApi, toVnDayIso } from '@/api/apidashboarduser';

import type { LoaiDuLieuItem, NguoiDungTichCucItem } from '@/types';

const CONTRIBUTOR_LIMIT = 10; // Same as web's dashboard.

export interface UseDataContributionResult {
  isLoading: boolean;
  isError: boolean;
  // Period the two lists cover — this screen has no date filter, so it is
  // fixed to "1 Jan of the current year → today" (the Dashboard người dùng
  // default on mobile).
  fromDate: Date;
  toDate: Date;
  // Documents created in the period (`tongDuLieu`).
  totalDocuments: number;
  dataTypes: LoaiDuLieuItem[];
  contributors: NguoiDungTichCucItem[];
  reload: () => void;
}

// "Loại dữ liệu đã được xây dựng" + "Người dùng tích cực xây dựng dữ liệu"
// — backend spec CN125 (/apidashboarduser/getLoaiDuLieu and
// /getNguoiDungTichCuc). Loaded independently of the rest of the screen so
// a failure here only affects these two sections.
export const useDataContribution = (): UseDataContributionResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [period, setPeriod] = useState(() => {
    const now = new Date();
    return { fromDate: new Date(now.getFullYear(), 0, 1), toDate: now };
  });
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [dataTypes, setDataTypes] = useState<LoaiDuLieuItem[]>([]);
  const [contributors, setContributors] = useState<NguoiDungTichCucItem[]>([]);

  const reload = useCallback(() => {
    const now = new Date();
    const next = { fromDate: new Date(now.getFullYear(), 0, 1), toDate: now };
    const filter = { fromDate: toVnDayIso(next.fromDate), toDate: toVnDayIso(next.toDate) };

    setPeriod(next);
    setIsLoading(true);
    setIsError(false);

    Promise.all([
      ApiDashboardUserApi.getLoaiDuLieu(filter),
      ApiDashboardUserApi.getNguoiDungTichCuc({ ...filter, limit: CONTRIBUTOR_LIMIT }),
    ])
      .then(([loaiRes, nguoiDungRes]) => {
        setTotalDocuments(loaiRes.tongDuLieu ?? 0);
        // `.filter(Boolean)` guards against a `null` entry in a malformed
        // response — the rows read item fields directly.
        setDataTypes((loaiRes.lstLoaiDuLieu ?? []).filter(Boolean));
        setContributors((nguoiDungRes.lstNguoiDungTichCuc ?? []).filter(Boolean));
      })
      .catch(() => {
        setTotalDocuments(0);
        setDataTypes([]);
        setContributors([]);
        setIsError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { isLoading, isError, ...period, totalDocuments, dataTypes, contributors, reload };
};
