import { ApiClient } from '../axiosInstance';
import { SODOPHONGHOP_ENDPOINTS } from './sodophonghop.endpoints';

import type { GetSoDoPhongHopResponse } from '@/types';

export const SoDoPhongHopApi = {
  // Matches pmbc_mobile's SoDoPhongHopService.getListObjs — POST with a
  // null body, returns every room layout (filtered client-side by
  // `khp_diadiem` to find the one for the current meeting).
  getList: async (): Promise<GetSoDoPhongHopResponse> => {
    const response = await ApiClient.post(SODOPHONGHOP_ENDPOINTS.DATA, {});
    return (response as unknown as GetSoDoPhongHopResponse) ?? {};
  },
};
