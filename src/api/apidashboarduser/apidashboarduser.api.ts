import { ApiClient } from '../axiosInstance';
import { APIDASHBOARDUSER_ENDPOINTS } from './apidashboarduser.endpoints';

import type { ApiDashboardUserResponse, SearchApiDashboardUserRequest } from '@/types';

export const ApiDashboardUserApi = {
  // Matches pmbc_web's ApiDashboardUserService.getDataForUserDashboard —
  // POST /gateway/apidashboarduser/getData.
  getData: async (
    request: SearchApiDashboardUserRequest
  ): Promise<ApiDashboardUserResponse> => {
    const response = await ApiClient.post(APIDASHBOARDUSER_ENDPOINTS.GET_DATA, request);
    return (response as unknown as ApiDashboardUserResponse) ?? {};
  },
};
