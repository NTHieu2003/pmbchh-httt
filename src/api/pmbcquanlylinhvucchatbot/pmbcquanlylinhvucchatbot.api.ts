import { ApiClient } from '../axiosInstance';
import { PMBCQUANLYLINHVUCCHATBOT_ENDPOINTS } from './pmbcquanlylinhvucchatbot.endpoints';

import type {
  ExportPmbcQuanLyLinhVucChatbotResponse,
  SearchPmbcQuanLyLinhVucChatbotRequest,
  SearchPmbcQuanLyLinhVucChatbotResponse,
} from '@/types';

export const PmbcQuanLyLinhVucChatbotApi = {
  // Matches pmbc_web's PmbcQuanlylinhvucchatbotService.searchLists —
  // POST /gateway/pmbcquanlylinhvucchatbot/search.
  search: async (
    request: SearchPmbcQuanLyLinhVucChatbotRequest
  ): Promise<SearchPmbcQuanLyLinhVucChatbotResponse> => {
    const response = await ApiClient.post(PMBCQUANLYLINHVUCCHATBOT_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchPmbcQuanLyLinhVucChatbotResponse) ?? {};
  },

  // Backend has this ready (pmbc_quanlylinhvucchatbotRsService.exportExcel)
  // but web never wires a button to it — this screen has no search/filter
  // UI either, so only the unfiltered export is needed.
  exportExcel: async (
    request: SearchPmbcQuanLyLinhVucChatbotRequest
  ): Promise<ExportPmbcQuanLyLinhVucChatbotResponse> => {
    const response = await ApiClient.post(
      PMBCQUANLYLINHVUCCHATBOT_ENDPOINTS.EXPORT_EXCEL,
      request
    );
    return (response as unknown as ExportPmbcQuanLyLinhVucChatbotResponse) ?? {};
  },
};
