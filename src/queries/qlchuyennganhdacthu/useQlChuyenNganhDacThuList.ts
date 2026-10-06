import { useQuery } from '@tanstack/react-query';

import { QlChuyenNganhDacThuApi } from '@/api/qlchuyennganhdacthu';

export const QL_CHUYEN_NGANH_DAC_THU_QUERY_KEY = ['qlchuyennganhdacthu', 'list'] as const;

export const useQlChuyenNganhDacThuList = () =>
  useQuery({
    queryKey: QL_CHUYEN_NGANH_DAC_THU_QUERY_KEY,
    queryFn: QlChuyenNganhDacThuApi.getList,
  });
