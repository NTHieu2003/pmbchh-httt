import { ApiClient } from '../axiosInstance';
import { QLCHUYENNGANHDACTHU_ENDPOINTS } from './qlchuyennganhdacthu.endpoints';

import type { QlChuyenNganhDacThu } from '@/types';

interface QlChuyenNganhDacThuListWrapped {
  lstQlchuyennganhdacthu?: QlChuyenNganhDacThu[];
  items?: QlChuyenNganhDacThu[];
}

const normalizeListResponse = (response: unknown): QlChuyenNganhDacThu[] => {
  if (Array.isArray(response)) return response;

  const wrapped = response as QlChuyenNganhDacThuListWrapped | null | undefined;
  if (wrapped?.lstQlchuyennganhdacthu) return wrapped.lstQlchuyennganhdacthu;
  if (wrapped?.items) return wrapped.items;

  return [];
};

export const QlChuyenNganhDacThuApi = {
  getList: async (): Promise<QlChuyenNganhDacThu[]> => {
    const response = await ApiClient.post(QLCHUYENNGANHDACTHU_ENDPOINTS.DATA, {});
    return normalizeListResponse(response);
  },
};
