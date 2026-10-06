import { useCallback, useEffect, useRef, useState } from 'react';

import { ChatbotApi, sendChatMessageStream } from '@/api/chatbot';
import { useAuthStore } from '@/stores';

import type { ChatListItem, ChatStreamPacket } from '@/types';

export interface UseChatResult {
  listChat: ChatListItem[];
  message: string;
  setMessage: (value: string) => void;
  isSendingMessage: boolean;
  isStopping: boolean;
  isLoadingConversation: boolean;
  showTypingIndicator: boolean;
  sendMessage: () => void;
  stopGen: () => void;
  startNewConversation: () => void;
  loadConversation: (conversationId: string) => void;
  // Bumped once per successful `upsertConversation` call — the left
  // sidebar's "GẦN ĐÂY" list watches this to refresh itself right after a
  // message round-trip persists/updates the conversation, so a brand-new
  // conversation (or one that just moved to the top by recency) shows up
  // without the user having to manually pull-to-refresh.
  historyVersion: number;
}

const MSG_PAGE_SIZE = 20;
// Title = first user message, truncated — matches web's handleSendMess()
// (`title.length > 40 ? title.slice(0, 40) + '...' : title`).
const TITLE_MAX_LENGTH = 40;

let messageIdCounter = 0;
const nextMessageId = () => `local-${Date.now()}-${messageIdCounter++}`;

// Mirrors pmbc_web's chatbot.component.ts send/stream/stop flow
// (handleSendMess / handleNdjsonPacket / finalizeStream / stopGen), scoped
// down to what the center chat column needs: no citations, reasoning or
// knowledge-panel yet (conversation persistence — upsertConversation — IS
// wired, see `finalizeStream` below).
export const useChat = (): UseChatResult => {
  const [listChat, setListChat] = useState<ChatListItem[]>([]);
  const [message, setMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isLoadingConversation, setIsLoadingConversation] = useState(false);
  const [historyVersion, setHistoryVersion] = useState(0);
  const userId = useAuthStore((state) => state.userId);

  // Matches pmbc_web's single `conversation_id` field exactly — doubles as
  // both the conversation's storage id (Mongo doc id, for
  // upsertConversation/getMessagesPage/stopChatSession) AND the engine's
  // live session id, reassigned from every stream packet that reports one
  // (see `handlePacket`). Web does the same (chatbot.component.ts line
  // ~784-785) with no separate tracking — the engine is expected to echo
  // back the same id it was given when continuing an existing session.
  const conversationIdRef = useRef<string | undefined>(undefined);
  const assistantMessageIdRef = useRef<string | null>(null);
  const streamHandleRef = useRef<{ abort: () => void } | null>(null);
  const titleRef = useRef<string>('');

  const documentSetIdsRef = useRef<number[]>([]);

  // Mirrored copy of `listChat`, updated synchronously alongside every
  // `setListChat` call (see `updateListChat`) — `finalizeStream` needs the
  // just-finished assistant message's full content to persist the
  // conversation, and reading it off `listChat` state directly there would
  // risk a stale closure (state updates from the same synchronous streaming
  // tick haven't necessarily re-rendered yet).
  const listChatRef = useRef<ChatListItem[]>([]);
  const updateListChat = useCallback(
    (updater: ChatListItem[] | ((prev: ChatListItem[]) => ChatListItem[])) => {
      setListChat((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        listChatRef.current = next;
        return next;
      });
    },
    []
  );

  useEffect(() => {
    ChatbotApi.listDocumentSetsForChat()
      .then((sources) => {
        documentSetIdsRef.current = sources.map((item) => item.id);
      })
      .catch(() => {
        documentSetIdsRef.current = [];
      });
  }, []);

  const ensureAssistantMessage = useCallback((): string => {
    if (assistantMessageIdRef.current) return assistantMessageIdRef.current;
    const id = nextMessageId();
    assistantMessageIdRef.current = id;
    updateListChat((prev) => [
      ...prev,
      {
        id,
        message: { role: 'assistant', content: '' },
        streamingActive: true,
      },
    ]);
    return id;
  }, [updateListChat]);

  const appendAssistantContent = useCallback(
    (id: string, delta: string) => {
      updateListChat((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                message: {
                  ...item.message,
                  content: item.message.content + delta,
                },
                streamingActive: true,
              }
            : item
        )
      );
    },
    [updateListChat]
  );

  const markAssistantDone = useCallback(
    (id: string) => {
      updateListChat((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, streamingActive: false } : item
        )
      );
    },
    [updateListChat]
  );

  const pushAssistantError = useCallback(
    (content: string) => {
      updateListChat((prev) => [
        ...prev,
        {
          id: nextMessageId(),
          message: { role: 'assistant', content },
          isError: true,
        },
      ]);
    },
    [updateListChat]
  );

  const handlePacket = useCallback(
    (packet: ChatStreamPacket) => {
      if (!packet.obj && !packet.placement) {
        if (packet.chat_session_id) {
          conversationIdRef.current = packet.chat_session_id;
        }
        return;
      }
      if (!packet.obj) return;

      switch (packet.obj.type) {
        case 'message_delta': {
          const id = ensureAssistantMessage();
          appendAssistantContent(id, (packet.obj.content as string) || '');
          break;
        }
        case 'stop':
        case 'error': {
          if (assistantMessageIdRef.current) {
            markAssistantDone(assistantMessageIdRef.current);
          }
          break;
        }
        default:
          break;
      }
    },
    [ensureAssistantMessage, appendAssistantContent, markAssistantDone]
  );

  // Mirrors pmbc_web's persistConversation(): upsert the conversation to
  // Mongo right after a stream finishes, so it shows up in the left
  // sidebar's history search. Fire-and-forget — a failed save shouldn't
  // interrupt the chat UI, same as web's `.subscribe({ error: warn })`.
  const persistConversation = useCallback(
    (sessionId: string) => {
      if (!userId) return;
      ChatbotApi.upsertConversation({
        id: sessionId,
        userId,
        title: titleRef.current || '(không tiêu đề)',
        // Drop empty, non-error assistant placeholders — e.g. one left
        // behind by a stream that was stopped before any content streamed
        // in. `persistConversation` resends the entire `listChat` every
        // time, so a stray empty one would otherwise ride along forever.
        messages: listChatRef.current
          .filter((item) => item.isError || item.message.content.trim() !== '')
          .map((item) => ({
            id: item.id,
            role: item.message.role,
            content: item.message.content,
          })),
      })
        .then(() => setHistoryVersion((v) => v + 1))
        .catch(() => {});
    },
    [userId]
  );

  const finalizeStream = useCallback(() => {
    if (assistantMessageIdRef.current) {
      markAssistantDone(assistantMessageIdRef.current);
    }
    assistantMessageIdRef.current = null;
    streamHandleRef.current = null;
    setIsSendingMessage(false);
    setIsStopping(false);

    if (conversationIdRef.current) {
      persistConversation(conversationIdRef.current);
    }
  }, [markAssistantDone, persistConversation]);

  const sendMessage = useCallback(() => {
    const query = message.trim();
    if (!query || isSendingMessage) return;

    // Title = first user message, set once — never overwritten afterward
    // (matches web; a conversation loaded from history already has its
    // title populated via `loadConversation` below).
    if (!titleRef.current) {
      titleRef.current =
        query.length > TITLE_MAX_LENGTH
          ? query.slice(0, TITLE_MAX_LENGTH).trim() + '...'
          : query;
    }

    updateListChat((prev) => [
      ...prev,
      { id: nextMessageId(), message: { role: 'user', content: query } },
    ]);
    setMessage('');
    setIsSendingMessage(true);
    assistantMessageIdRef.current = null;

    const body: {
      message: string;
      chat_session_id?: string;
      document_set_ids?: number[];
    } = { message: query };
    if (conversationIdRef.current) {
      body.chat_session_id = conversationIdRef.current;
    }
    if (documentSetIdsRef.current.length > 0) {
      body.document_set_ids = documentSetIdsRef.current;
    }

    streamHandleRef.current = sendChatMessageStream(body, {
      onPacket: handlePacket,
      onError: (msg, kind) => {
        pushAssistantError(
          kind === 'network'
            ? `Không kết nối được tới chatbot. Chi tiết: ${msg}`
            : msg
        );
      },
      onDone: finalizeStream,
    });
  }, [
    message,
    isSendingMessage,
    handlePacket,
    pushAssistantError,
    finalizeStream,
  ]);

  const stopGen = useCallback(() => {
    setIsStopping(true);
    streamHandleRef.current?.abort();
    const sessionId = conversationIdRef.current;
    if (sessionId) {
      ChatbotApi.stopChatSession(sessionId).catch(() => {});
    }
  }, []);

  // "Cuộc trò chuyện mới" (left sidebar) — aborts any in-flight stream and
  // wipes local state; `conversationIdRef` reset means the next message
  // starts a fresh `chat_session_id` upstream instead of continuing this one.
  const startNewConversation = useCallback(() => {
    streamHandleRef.current?.abort();
    streamHandleRef.current = null;
    conversationIdRef.current = undefined;
    assistantMessageIdRef.current = null;
    titleRef.current = '';
    updateListChat([]);
    setMessage('');
    setIsSendingMessage(false);
    setIsStopping(false);
  }, [updateListChat]);

  // Tapping a conversation row in the left sidebar — mirrors pmbc_web's
  // selectConversation() (tail-load the last MSG_PAGE_SIZE messages via
  // getMessagesPage(id, userId, -1, size), offset=-1 = "from the end").
  const loadConversation = useCallback(
    (targetConversationId: string) => {
      if (!userId) return;
      streamHandleRef.current?.abort();
      streamHandleRef.current = null;
      assistantMessageIdRef.current = null;
      setIsSendingMessage(false);
      setIsStopping(false);
      setIsLoadingConversation(true);
      updateListChat([]);

      ChatbotApi.getMessagesPage(targetConversationId, userId, -1, MSG_PAGE_SIZE)
        .then((page) => {
          conversationIdRef.current = targetConversationId;
          // Conversation already has a title from Mongo — keep it so the
          // next sent message doesn't overwrite it with a new one.
          titleRef.current = page.title || '';
          updateListChat(
            (page.messages ?? []).filter(Boolean).map((m) => ({
              id: m?.id || nextMessageId(),
              message: { role: m?.role ?? 'assistant', content: m?.content ?? '' },
            }))
          );
        })
        .catch(() => {
          pushAssistantError('Không tải được lịch sử hội thoại này.');
        })
        .finally(() => setIsLoadingConversation(false));
    },
    [userId, pushAssistantError, updateListChat]
  );

  const currentAssistantItem = assistantMessageIdRef.current
    ? listChat.find((item) => item.id === assistantMessageIdRef.current)
    : undefined;
  const showTypingIndicator =
    isSendingMessage && !currentAssistantItem?.message.content;

  return {
    listChat,
    message,
    setMessage,
    isSendingMessage,
    isStopping,
    isLoadingConversation,
    showTypingIndicator,
    sendMessage,
    stopGen,
    startNewConversation,
    loadConversation,
    historyVersion,
  };
};
