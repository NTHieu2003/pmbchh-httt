import { ApiClient } from '../axiosInstance';
import { MESSAGEVOIDCHAT_ENDPOINTS } from './messageVoidChat.endpoints';

import type {
  GetAllMessageByKhpGidResponse,
  MessageVoidChatItem,
  SearchMessageVoidChatRequest,
  SearchMessageVoidChatResponse,
} from '@/types';

// Matches pmbc_web/pmbc_mobile's MessageVoidChatService — persists one STT
// utterance per call (see useMeetingRoom.hook.ts's post-recording flow).
export const MessageVoidChatApi = {
  search: async (
    request: SearchMessageVoidChatRequest
  ): Promise<SearchMessageVoidChatResponse> => {
    const response = await ApiClient.post(MESSAGEVOIDCHAT_ENDPOINTS.SEARCH, request);
    return (response as unknown as SearchMessageVoidChatResponse) ?? {};
  },

  // Matches pmbc_web's getAllMessageByKhpGid — loads the full persisted
  // transcript for a room on screen entry (no paging, unlike `search`).
  getAllByKhpGid: async (khpGid: number): Promise<GetAllMessageByKhpGidResponse> => {
    const response = await ApiClient.post(MESSAGEVOIDCHAT_ENDPOINTS.GET_ALL_BY_KHP_GID, {
      khp_gid: khpGid,
    });
    return (response as unknown as GetAllMessageByKhpGidResponse) ?? {};
  },

  // The insert response's record comes back under `obj` (confirmed from
  // pmbc_web's own `this.objMessNew = res.obj` right after
  // `messageVoidChatService.createObj(...)`) — NOT `objDetail` like the
  // `getById`-style read endpoints elsewhere in this codebase use.
  insert: async (item: Omit<MessageVoidChatItem, 'gid'>): Promise<MessageVoidChatItem | null> => {
    const response = await ApiClient.post(MESSAGEVOIDCHAT_ENDPOINTS.INSERT, item);
    const data = response as unknown as { obj?: MessageVoidChatItem } | null | undefined;
    return data?.obj ?? null;
  },

  update: async (item: MessageVoidChatItem): Promise<void> => {
    await ApiClient.post(MESSAGEVOIDCHAT_ENDPOINTS.UPDATE, item);
  },

  // Matches pmbc_web's updateContentTomtat — writes just the AI-summarized
  // text for one utterance (see AiService.summarizeText on web).
  updateContentTomtat: async (gid: number, contentTomtat: string): Promise<void> => {
    await ApiClient.post(MESSAGEVOIDCHAT_ENDPOINTS.UPDATE_CONTENT_TOMTAT, {
      gid,
      content_tomtat: contentTomtat,
    });
  },

  // Matches pmbc_web's "Xóa tiến trình" (doDeleteTientrinhByGid) — removes
  // one persisted utterance, chủ trì/trợ lý only (gated in the UI layer).
  deleteObj: async (gid: number): Promise<void> => {
    await ApiClient.post(MESSAGEVOIDCHAT_ENDPOINTS.DELETE, { gid });
  },
};
