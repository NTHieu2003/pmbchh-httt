import { ApiClient } from '../axiosInstance';
import { PMBCHDSDCHATBOT_ENDPOINTS } from './pmbchdsdchatbot.endpoints';

import type { PmbcHdsdChatbot, SearchPmbcHdsdChatbotRequest } from '@/types';

export const PmbcHdsdChatbotApi = {
  // Confirmed live — response `{ lstPmbcHDSDChatbot, totalItems, totalPages }`.
  search: async (
    request: SearchPmbcHdsdChatbotRequest
  ): Promise<{ items: PmbcHdsdChatbot[]; total: number }> => {
    const response = await ApiClient.post(PMBCHDSDCHATBOT_ENDPOINTS.SEARCH, request);
    const data = response as unknown as
      | { lstPmbcHDSDChatbot?: PmbcHdsdChatbot[]; totalItems?: number }
      | null
      | undefined;
    return { items: data?.lstPmbcHDSDChatbot ?? [], total: data?.totalItems ?? 0 };
  },
};
