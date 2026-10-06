import { DefaultOptions, QueryClient } from '@tanstack/react-query';

const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
    retryOnMount: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions });
