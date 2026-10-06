import axios, {
  AxiosError,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
  type AxiosInstance,
} from 'axios';
import queryString from 'query-string';

import { env } from '@/constants';
import { useAuthStore } from '@/stores';

// The `smta.lqdtu.edu.vn/gateway_bchh` host already terminates at the
// gateway, so endpoint paths hardcoded with a leading `/gateway` (written
// against the old `103.124.94.201:8888` host, where `/gateway` is required)
// would double up into `/gateway_bchh/gateway/...` and 404. Strip it only
// when the configured API_URL is that gateway_bchh host.
const GATEWAY_PREFIX = '/gateway';
const shouldStripGatewayPrefix = (baseURL: string): boolean =>
  baseURL.includes('gateway_bchh');

// Shared with callers that build request URLs manually instead of going
// through `ApiClient` (e.g. `sendChatMessageStream`'s raw XMLHttpRequest,
// needed for progressive NDJSON reads) — keeps them affected by the same
// host-dependent `/gateway` rule.
export const resolveApiPath = (path: string, baseURL: string = env.API_URL): string =>
  shouldStripGatewayPrefix(baseURL) && path.startsWith(GATEWAY_PREFIX)
    ? path.slice(GATEWAY_PREFIX.length) || '/'
    : path;

export const axiosInstance = (baseURL?: string): AxiosInstance => {
  const resolvedBaseURL = baseURL || env.API_URL;
  const stripGatewayPrefix = shouldStripGatewayPrefix(resolvedBaseURL);

  const instance = axios.create({
    baseURL: resolvedBaseURL,
    timeout: env.TIME_OUT,
    headers: {
      'Content-Type': 'application/json'
      // 'X-Client-Type': 'mobile_app',
    },
    paramsSerializer: (params) => queryString.stringify(params),
  });

  // Request: attach the bearer token kept in memory by the zustand auth
  // store (populated on login / bootstrap) — same source pattern as A.
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      if (stripGatewayPrefix && config.url?.startsWith(GATEWAY_PREFIX)) {
        config.url = config.url.slice(GATEWAY_PREFIX.length) || '/';
      }

      if (__DEV__) {
        console.log('[API REQUEST]', config.method?.toUpperCase(), config.url);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response: unwrap `response.data`, and on 401 try one silent refresh
  // (endpoint shape matches project B's `/auth/refresh`) before logging
  // the user out — same retry-once guard as A.
  instance.interceptors.response.use(
    (response) => response?.data ?? response,
    async (error: AxiosError) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };

      const isUnauthorized = error.response?.status === 401;
      const refreshToken = useAuthStore.getState().refreshToken;

      if (isUnauthorized && !originalRequest?._retry && refreshToken) {
        originalRequest._retry = true;
        try {
          const { data } = await axios.post(`${env.API_URL}/auth/refresh`, {
            refreshToken,
          });

          useAuthStore.setState({ token: data.token });

          return instance.request({
            ...originalRequest,
            headers: {
              ...originalRequest.headers,
              Authorization: `Bearer ${data.token}`,
            },
          });
        } catch (refreshError) {
          await useAuthStore.getState().logout();
          return Promise.reject(refreshError);
        }
      }

      if (isUnauthorized) {
        await useAuthStore.getState().logout();
      }

      if (__DEV__) {
        console.log(
          '[API ERROR]',
          error.config?.url,
          error.response?.status,
          error.response?.data,
          error.message,
          error.code
        );
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

export const ApiClient = axiosInstance();
