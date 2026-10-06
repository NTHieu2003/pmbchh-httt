import { ApiClient } from '../axiosInstance';
import { THANHPHANTHAMGIA_ENDPOINTS } from './thanhphanthamgia.endpoints';

import type {
  SearchThanhPhanThamGiaRequest,
  SearchThanhPhanThamGiaResponse,
} from '@/types';

export const ThanhPhanThamGiaApi = {
  // Matches pmbc_mobile's ThanhPhanThamGiaService.searchThanhPhanThamGia —
  // POST /gateway/thanhphanthamgia/search.
  search: async (
    request: SearchThanhPhanThamGiaRequest
  ): Promise<SearchThanhPhanThamGiaResponse> => {
    const response = await ApiClient.post(THANHPHANTHAMGIA_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchThanhPhanThamGiaResponse) ?? {};
  },
};
