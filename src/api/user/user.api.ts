import { ApiClient } from '../axiosInstance';
import { USER_ENDPOINTS } from './user.endpoints';

import type { UserDetail } from '@/types';

interface UserDetailResponse {
  detail?: UserDetail;
}

export const UserApi = {
  // Mirrors pmbc_web's FeaturesResolve (`postData('/user/detail', null)`,
  // reads `res.detail.userId`). Spring rejects a literal `null` JSON body
  // (same issue as qlchuyennganhdacthu) — send `{}` instead.
  getDetail: async (): Promise<UserDetail | null> => {
    const response = await ApiClient.post(USER_ENDPOINTS.DETAIL, {});
    const data = response as unknown as UserDetailResponse | null | undefined;
    return data?.detail ?? null;
  },
};
