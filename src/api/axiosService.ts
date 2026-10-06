import { AxiosRequestConfig } from 'axios';

import { BaseResponseProps } from '@/types';

import { ApiClient } from './axiosInstance';

export const AxiosService = {
  get: async <TResponse = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseResponseProps<TResponse>> => {
    return ApiClient.get(url, config);
  },

  post: async <TResponse = any, TRequest = any>(
    url: string,
    body?: TRequest,
    config?: AxiosRequestConfig<TRequest>
  ): Promise<BaseResponseProps<TResponse>> => {
    return ApiClient.post(url, body, config);
  },

  put: async <TResponse = any, TRequest = any>(
    url: string,
    body?: TRequest,
    config?: AxiosRequestConfig<TRequest>
  ): Promise<BaseResponseProps<TResponse>> => {
    return ApiClient.put(url, body, config);
  },

  patch: async <TResponse = any, TRequest = any>(
    url: string,
    body?: TRequest,
    config?: AxiosRequestConfig<TRequest>
  ): Promise<BaseResponseProps<TResponse>> => {
    return ApiClient.patch(url, body, config);
  },

  delete: async <TResponse = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<BaseResponseProps<TResponse>> => {
    return ApiClient.delete(url, config);
  },
};
