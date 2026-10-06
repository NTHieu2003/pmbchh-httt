import { ApiClient } from '../axiosInstance';
import { VANBANPHAPQUY_ENDPOINTS } from './vanbanphapquy.endpoints';

import type { SearchVanbanphapquyRequest, SearchVanbanphapquyResponse } from '@/types';

export const VanbanphapquyApi = {
  // Matches pmbc_web's VanbanphapquyService.searchLists — POST
  // /gateway/vanbanphapquy/search. The web stats screen pages with
  // pageSize=10000 (fetch-everything) and aggregates client-side; mobile
  // does the same since there's no dedicated stats endpoint.
  search: async (
    request: SearchVanbanphapquyRequest
  ): Promise<SearchVanbanphapquyResponse> => {
    const response = await ApiClient.post(VANBANPHAPQUY_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchVanbanphapquyResponse) ?? {};
  },
};
