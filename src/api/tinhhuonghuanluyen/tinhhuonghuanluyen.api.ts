import { ApiClient } from '../axiosInstance';
import { TINHHUONGHUANLUYEN_ENDPOINTS } from './tinhhuonghuanluyen.endpoints';

import type {
  SearchTinhHuongHuanLuyenRequest,
  SearchTinhHuongHuanLuyenResponse,
} from '@/types';

// Matches pmbc_web's TinhHuongHuanLuyenService — backs the "Đính kèm kịch
// bản ứng phó" attach dialog (see CbrnScenarioAttachModal.tsx).
export const TinhHuongHuanLuyenApi = {
  search: async (
    request: SearchTinhHuongHuanLuyenRequest
  ): Promise<SearchTinhHuongHuanLuyenResponse> => {
    const response = await ApiClient.post(TINHHUONGHUANLUYEN_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchTinhHuongHuanLuyenResponse) ?? {};
  },

  // Matches `attachKbup(kbupid, lstGid)` — replaces the full set of
  // training situations linked to one kịch bản ứng phó CBRN record.
  attachKbup: async (kbupid: number, lstGid: number[]): Promise<boolean> => {
    const response = await ApiClient.post(TINHHUONGHUANLUYEN_ENDPOINTS.ATTACH_KBUP, {
      kbupid,
      lstGid,
    });
    const data = response as unknown as { result?: { code?: string } } | null | undefined;
    return data?.result?.code === '00';
  },
};
