import { ApiClient } from '../axiosInstance';
import { TAILIEUCHUONGTRINHHOP_ENDPOINTS } from './tailieuchuongtrinhhop.endpoints';

import type {
  InsertTaiLieuChuongTrinhHopResponse,
  SearchTaiLieuChuongTrinhHopRequest,
  SearchTaiLieuChuongTrinhHopResponse,
  TaiLieuChuongTrinhHopRequest,
} from '@/types';

export const TaiLieuChuongTrinhHopApi = {
  // Matches pmbc_mobile's TaiLieuChuongTrinhHopService
  // .searchTaiLieuChuongTrinhHop — returns CTH (agenda) + TLH (document)
  // rows mixed together, told apart client-side by `loai`.
  search: async (
    request: SearchTaiLieuChuongTrinhHopRequest
  ): Promise<SearchTaiLieuChuongTrinhHopResponse> => {
    const response = await ApiClient.post(TAILIEUCHUONGTRINHHOP_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchTaiLieuChuongTrinhHopResponse) ?? {};
  },

  // Matches .searchNoiDungPhatBieu — same table, `loai: 'NDPB'` rows.
  searchNoiDungPhatBieu: async (
    request: SearchTaiLieuChuongTrinhHopRequest
  ): Promise<SearchTaiLieuChuongTrinhHopResponse> => {
    const response = await ApiClient.post(
      TAILIEUCHUONGTRINHHOP_ENDPOINTS.SEARCH_NOI_DUNG_PHAT_BIEU,
      request
    );
    return (response as unknown as SearchTaiLieuChuongTrinhHopResponse) ?? {};
  },

  // Matches TaiLieuChuongTrinhHopService.insertTaiLieuChuongTrinhHop —
  // used by both "Thêm mới tài liệu cá nhân" and "Thêm mới phát biểu cá
  // nhân" (only `loai`/`trangthai` differ).
  insert: async (
    request: TaiLieuChuongTrinhHopRequest
  ): Promise<InsertTaiLieuChuongTrinhHopResponse> => {
    const response = await ApiClient.post(TAILIEUCHUONGTRINHHOP_ENDPOINTS.INSERT, request);
    return (response as unknown as InsertTaiLieuChuongTrinhHopResponse) ?? {};
  },

  // Matches .updateTaiLieuChuongTrinhHop — web's "Chia sẻ"/"Thu hồi" both
  // just flip `trangthai` on the full record and resend it here.
  update: async (request: TaiLieuChuongTrinhHopRequest): Promise<void> => {
    await ApiClient.post(TAILIEUCHUONGTRINHHOP_ENDPOINTS.UPDATE, request);
  },

  // Matches .deleteTaiLieuChuongTrinhHop — POST with { gid }, not a path
  // param.
  remove: async (gid: number): Promise<void> => {
    await ApiClient.post(TAILIEUCHUONGTRINHHOP_ENDPOINTS.DELETE, { gid });
  },
};
