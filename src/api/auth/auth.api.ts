import md5 from 'react-native-md5';

import { base64Encode } from '@/utils';

import { ApiClient } from '../axiosInstance';
import { AUTH_ENDPOINTS } from './auth.endpoints';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

const GATEWAY_BASIC_AUTH =
  'Basic QWRtaW5IdW1hblJlc291cmNlTWFuYWdlcjpBZG1pblNlY3JldEh1bWFuUmVzb3VyY2VNYW5hZ2Vy';

export const AuthApi = {
  login: async ({ username, password }: LoginPayload): Promise<LoginResponse> => {
    const payload = new URLSearchParams({
      username,
      password: md5.hex_md5(password),
      // parity with the known-working client in case that's wrong.
      year_handling: '2024',
      grant_type: 'password',
    }).toString();

    return ApiClient.post(AUTH_ENDPOINTS.LOGIN, payload, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: GATEWAY_BASIC_AUTH,
      },
    });
  },

  // Matches pmbc_web's AuthService.logOut(): body is `{ req: base64(token) }`,
  // not an Authorization header.
  logout: async (token: string): Promise<void> => {
    await ApiClient.post(AUTH_ENDPOINTS.LOGOUT, { req: base64Encode(token) });
  },
};
