import { env } from '@/constants';
import { ApiClient, resolveApiPath } from '../axiosInstance';
import { CHATBOT_ENDPOINTS } from './chatbot.endpoints';

import type {
  ChatStreamPacket,
  ChatStreamRequestBody,
  ConversationMessage,
  ConversationMessagesPage,
  ConversationSearchFilter,
  ConversationSummary,
  DocumentSetSummary,
} from '@/types';

export interface ChatStreamHandlers {
  onPacket: (packet: ChatStreamPacket) => void;
  // `'network'` = transport-level failure (fetch/HTTP-status failed to reach
  // the upstream at all); `'packet'` = the upstream itself sent an
  // `{ error }` NDJSON line mid-stream. Kept distinct because the two cases
  // need different user-facing wording (matches pmbc_web's split between its
  // `catch` block and `pushAssistantError` from `handleNdjsonPacket`).
  onError: (message: string, kind: 'network' | 'packet') => void;
  onDone: () => void;
}

export interface ChatStreamHandle {
  abort: () => void;
}

// React Native's `fetch` doesn't expose a readable stream body, so this
// mirrors pmbc_web's NDJSON-over-fetch parsing (chatbot.component.ts
// `handleSendMess`) using XMLHttpRequest instead: RN's networking layer
// delivers chunked responses progressively via `readyState === LOADING`,
// with `responseText` growing on each delivery — diffed here the same way
// the web client diffs `reader.read()` chunks.
export const sendChatMessageStream = (
  body: ChatStreamRequestBody,
  handlers: ChatStreamHandlers
): ChatStreamHandle => {
  const xhr = new XMLHttpRequest();
  const url = `${env.API_URL}${resolveApiPath(CHATBOT_ENDPOINTS.SEND_CHAT_MESSAGE)}`;

  let processedLength = 0;
  let lineBuffer = '';
  let finished = false;
  let abortedByCaller = false;

  const processNewText = (fullText: string) => {
    const newText = fullText.slice(processedLength);
    processedLength = fullText.length;
    lineBuffer += newText;

    let newlineIndex: number;
    while ((newlineIndex = lineBuffer.indexOf('\n')) >= 0) {
      const line = lineBuffer.slice(0, newlineIndex).trim();
      lineBuffer = lineBuffer.slice(newlineIndex + 1);
      if (!line) continue;

      let packet: ChatStreamPacket;
      try {
        packet = JSON.parse(line);
      } catch {
        continue;
      }

      if (packet.error && !packet.obj && !packet.placement) {
        handlers.onError(
          packet.error + (packet.error_code ? ` (${packet.error_code})` : ''),
          'packet'
        );
        continue;
      }
      handlers.onPacket(packet);
    }
  };

  const finishOnce = () => {
    if (finished) return;
    finished = true;
    handlers.onDone();
  };

  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.LOADING || xhr.readyState === XMLHttpRequest.DONE) {
      processNewText(xhr.responseText || '');
    }
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (!abortedByCaller && (xhr.status < 200 || xhr.status >= 300)) {
        handlers.onError(`HTTP ${xhr.status}`, 'network');
      }
      finishOnce();
    }
  };

  xhr.onerror = () => {
    if (!abortedByCaller) {
      handlers.onError('Failed to fetch', 'network');
    }
    finishOnce();
  };

  xhr.send(JSON.stringify(body));

  return {
    abort: () => {
      abortedByCaller = true;
      xhr.abort();
      finishOnce();
    },
  };
};

export const ChatbotApi = {
  stopChatSession: (sessionId: string) =>
    ApiClient.post(CHATBOT_ENDPOINTS.STOP(sessionId), {}),

  // Matches pmbc_web's ApiChatBoxService.upsertConversation — persists the
  // conversation to Mongo so it shows up in the left sidebar's history
  // search. Web calls this from `finalizeStream()` right after a stream
  // completes (see chatbot.component.ts `persistConversation`), fire-and
  // -forget (errors only logged, never surfaced to the user).
  upsertConversation: (payload: {
    id: string;
    userId: number | string;
    title: string;
    messages: ConversationMessage[];
  }) => ApiClient.post(CHATBOT_ENDPOINTS.CONVERSATIONS, payload),

  listDocumentSetsForChat: async (): Promise<DocumentSetSummary[]> => {
    const response = await ApiClient.get(
      CHATBOT_ENDPOINTS.DOCUMENT_SETS_FOR_CHAT
    );
    const list = response as unknown as DocumentSetSummary[] | null | undefined;
    return Array.isArray(list) ? list.filter((item) => item.is_public) : [];
  },

  // Mirrors pmbc_web's ApiChatBoxService.searchConversations — paginated
  // + searchable per-section (recent/starred) list for the left sidebar.
  searchConversations: async (
    userId: number | string,
    opts: {
      key?: string;
      filter: ConversationSearchFilter;
      page?: number;
      size?: number;
    }
  ): Promise<{ items: ConversationSummary[]; total: number }> => {
    const response = await ApiClient.get(
      CHATBOT_ENDPOINTS.CONVERSATIONS_SEARCH,
      {
        params: {
          userId,
          key: opts.key || undefined,
          filter: opts.filter,
          page: opts.page ?? 0,
          size: opts.size ?? 10,
        },
      }
    );
    const data = response as unknown as
      | { items?: ConversationSummary[]; total?: number }
      | null
      | undefined;
    return { items: data?.items ?? [], total: data?.total ?? 0 };
  },

  // Matches pmbc_web's ApiChatBoxService.getMessagesPage — offset=-1 means
  // "tail load" (the last `limit` messages), used when opening a
  // conversation from the left sidebar.
  getMessagesPage: async (
    id: string,
    userId: number | string,
    offset: number,
    limit: number
  ): Promise<ConversationMessagesPage> => {
    const response = await ApiClient.get(
      CHATBOT_ENDPOINTS.CONVERSATION_MESSAGES(id),
      { params: { userId, offset, limit } }
    );
    const data = response as unknown as Partial<ConversationMessagesPage> | null | undefined;
    return {
      messages: data?.messages ?? [],
      offset: data?.offset ?? 0,
      limit: data?.limit ?? limit,
      total: data?.total ?? 0,
      title: data?.title,
    };
  },

  pinConversation: (id: string, userId: number | string, isPinned: boolean) =>
    ApiClient.patch(CHATBOT_ENDPOINTS.CONVERSATION_PIN(id), { isPinned }, {
      params: { userId },
    }),

  starConversation: (id: string, userId: number | string, isStarred: boolean) =>
    ApiClient.patch(CHATBOT_ENDPOINTS.CONVERSATION_STAR(id), { isStarred }, {
      params: { userId },
    }),

  deleteConversation: (id: string, userId: number | string) =>
    ApiClient.delete(CHATBOT_ENDPOINTS.CONVERSATION(id), {
      params: { userId },
    }),

  // Show/hide a conversation in the history screen — body is `{ id, status }`
  // (status=false hides it, status=true restores it), no userId param.
  updateConversationStatus: (id: string, status: boolean) =>
    ApiClient.post(CHATBOT_ENDPOINTS.CONVERSATION_STATUS, { id, status }),
};
