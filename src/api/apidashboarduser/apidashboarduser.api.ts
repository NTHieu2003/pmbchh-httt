import { ApiClient } from '../axiosInstance';
import { APIDASHBOARDUSER_ENDPOINTS } from './apidashboarduser.endpoints';

import type {
  ApiDashboardResult,
  ApiDashboardUserResponse,
  LoaiDuLieuResponse,
  NguoiDungTichCucResponse,
  SearchApiDashboardUserRequest,
} from '@/types';

const pad2 = (n: number) => String(n).padStart(2, '0');

// The backend rounds fromDate/toDate to a whole Vietnam-time day and the
// specs ask for the Vietnam offset explicitly — sending the picked calendar
// day this way keeps it the same day whatever the device's time zone is
// (`Date.toISOString()` would shift it to UTC first).
export const toVnDayIso = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T00:00:00+07:00`;

// Server-side failures (and a missing Authorization header) still come back
// as HTTP 200 with `result.code === '000'` and no data — surface them as a
// rejection so callers show an error + retry instead of an empty dashboard.
const post = async <T extends { result?: ApiDashboardResult }>(
  url: string,
  request: SearchApiDashboardUserRequest
): Promise<T> => {
  const response = (await ApiClient.post(url, request)) as unknown as T | null;
  if (response?.result?.code !== '00') {
    throw new Error(`apidashboarduser result.code=${response?.result?.code ?? 'missing'}`);
  }
  return response;
};

export const ApiDashboardUserApi = {
  // KPI + ranked lists + lstTopChucNang (CN124). Every call writes one
  // history-log record on the backend — call on screen open / filter change
  // only, never poll.
  getData: (request: SearchApiDashboardUserRequest): Promise<ApiDashboardUserResponse> =>
    post(APIDASHBOARDUSER_ENDPOINTS.GET_DATA, request),

  // Documents created in the period, per loại văn bản (CN125 – API 1).
  getLoaiDuLieu: (request: SearchApiDashboardUserRequest): Promise<LoaiDuLieuResponse> =>
    post(APIDASHBOARDUSER_ENDPOINTS.GET_LOAI_DU_LIEU, request),

  // Users ranked by tongDongGop in the period (CN125 – API 2).
  getNguoiDungTichCuc: (
    request: SearchApiDashboardUserRequest
  ): Promise<NguoiDungTichCucResponse> =>
    post(APIDASHBOARDUSER_ENDPOINTS.GET_NGUOI_DUNG_TICH_CUC, request),
};
