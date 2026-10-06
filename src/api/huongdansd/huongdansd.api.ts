import { ApiClient } from '../axiosInstance';
import { HUONGDANSD_ENDPOINTS } from './huongdansd.endpoints';

import type { HuongDanSd, SearchHuongDanSdRequest } from '@/types';

export const HuongDanSdApi = {
  // Matches pmbc_web's Huong_dan_sdService.searchLists — POST
  // /gateway/huong_dan_sd/search, response `{ lstHuong_dan_sd, totalItems, totalPages }`.
  search: async (
    request: SearchHuongDanSdRequest
  ): Promise<{ items: HuongDanSd[]; total: number }> => {
    const response = await ApiClient.post(HUONGDANSD_ENDPOINTS.SEARCH, request);
    const data = response as unknown as
      | { lstHuong_dan_sd?: HuongDanSd[]; totalItems?: number }
      | null
      | undefined;
    return { items: data?.lstHuong_dan_sd ?? [], total: data?.totalItems ?? 0 };
  },

  // Matches pmbc_web's ComponentAbstract.getHdsd() — every admin screen
  // calls this with its own route to get the single page-level guide
  // record (hdsd_file/hdsd_file_video), bound directly to the
  // "Hướng dẫn PDF"/"Hướng dẫn Video" buttons with no transformation —
  // `(click)="openDialogHuongdan('pdf', hdsd?.hdsd_file)"`.
  getByFeatureRouterLink: async (routerLink: string): Promise<HuongDanSd | null> => {
    const response = await ApiClient.post(HUONGDANSD_ENDPOINTS.GET_BY_FEATURE_ROUTER_LINK, {
      routerLink,
    });
    const data = response as unknown as { huong_dan_sd?: HuongDanSd } | null | undefined;
    return data?.huong_dan_sd ?? null;
  },
};
