import { ApiClient } from '../axiosInstance';
import { PMBCKICHBANUNGPHOCBRN_ENDPOINTS } from './pmbckichbanungphocbrn.endpoints';

import type {
  ExportPmbcKichBanUngPhoCbrnResponse,
  SearchPmbcKichBanUngPhoCbrnRequest,
  SearchPmbcKichBanUngPhoCbrnResponse,
} from '@/types';

export const PmbcKichBanUngPhoCbrnApi = {
  // Matches pmbc_web's PmbcKichbanungphocbrnService.searchLists —
  // POST /gateway/pmbckichbanungphocbrn/search.
  search: async (
    request: SearchPmbcKichBanUngPhoCbrnRequest
  ): Promise<SearchPmbcKichBanUngPhoCbrnResponse> => {
    const response = await ApiClient.post(PMBCKICHBANUNGPHOCBRN_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchPmbcKichBanUngPhoCbrnResponse) ?? {};
  },

  // Unfiltered export — used when no search/status filter is active.
  exportExcel: async (
    request: SearchPmbcKichBanUngPhoCbrnRequest
  ): Promise<ExportPmbcKichBanUngPhoCbrnResponse> => {
    const response = await ApiClient.post(PMBCKICHBANUNGPHOCBRN_ENDPOINTS.EXPORT_EXCEL, request);
    return (response as unknown as ExportPmbcKichBanUngPhoCbrnResponse) ?? {};
  },

  // Matches web's `exportsearchExcel` — same filter fields as `search`,
  // used once a search/status filter is active.
  exportSearchExcel: async (
    request: SearchPmbcKichBanUngPhoCbrnRequest
  ): Promise<ExportPmbcKichBanUngPhoCbrnResponse> => {
    const response = await ApiClient.post(
      PMBCKICHBANUNGPHOCBRN_ENDPOINTS.EXPORT_EXCEL_SEARCH,
      request
    );
    return (response as unknown as ExportPmbcKichBanUngPhoCbrnResponse) ?? {};
  },
};
