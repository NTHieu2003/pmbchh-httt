import { ApiClient } from '../axiosInstance';
import { KHTOCHUCHOP_ENDPOINTS } from './khtochuchop.endpoints';

import type {
  GetByIdKhtochuchopResponse,
  SearchKhtochuchopRequest,
  SearchKhtochuchopResponse,
} from '@/types';

export const KhtochuchopApi = {
  // Matches pmbc_mobile's KHtochuchopService.searchLists — POST
  // /gateway/khtochuchop/search. Backs the "Kế hoạch tổ chức họp" list.
  search: async (request: SearchKhtochuchopRequest): Promise<SearchKhtochuchopResponse> => {
    const response = await ApiClient.post(KHTOCHUCHOP_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchKhtochuchopResponse) ?? {};
  },

  // Matches KHtochuchopService.getById — POST .../getById with
  // { khp_gid: itemId }, not a path param.
  getById: async (khpGid: number): Promise<GetByIdKhtochuchopResponse> => {
    const response = await ApiClient.post(KHTOCHUCHOP_ENDPOINTS.GET_BY_ID, { khp_gid: khpGid });
    return (response as unknown as GetByIdKhtochuchopResponse) ?? {};
  },

  // Matches KHtochuchopService.insertFile — uploads a recorded STT
  // utterance's audio (folder `Audio_KHTCH_<khp_gid>`, same convention the
  // meeting's shared/personal documents use) and returns the server-side
  // filename to save as `fileAudio` on the owning MessageVoidChat row.
  insertFile: async (params: {
    gid: number;
    folderName: string;
    fileName: string;
    file: string;
  }): Promise<string | null> => {
    const response = await ApiClient.post(KHTOCHUCHOP_ENDPOINTS.INSERT_FILE, params);
    const data = response as unknown as { blob?: string } | null | undefined;
    return data?.blob ?? null;
  },
};
