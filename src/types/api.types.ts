export interface BaseResponseProps<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

export interface BaseResponseError {
  response?: {
    status?: number;
    data?: {
      message?: string;
      status?: number;
    };
  };
  message: string;
}
