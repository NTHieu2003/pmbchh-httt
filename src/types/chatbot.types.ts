// Field/type names kept close to pmbc_web's chatbot.component.ts so the
// NDJSON stream contract can be diffed directly against the web source.

export type ChatRole = 'user' | 'assistant';

export interface ChatMessagePayload {
  role: ChatRole;
  content: string;
}

export interface ChatListItem {
  id: string;
  message: ChatMessagePayload;
  streamingActive?: boolean;
  isError?: boolean;
}

export interface ChatStreamRequestBody {
  message: string;
  chat_session_id?: string;
  document_set_ids?: number[];
}

// Matches pmbc_web's `DocumentSetSummary` (chatbot-docset/index.ts) — the
// "knowledge source" list from GET /chatbot/document-sets/for-chat. Web
// auto-selects every id on first load (`selectedSourceIds`) and sends the
// full set as `document_set_ids` on every send-message call; mobile mirrors
// just the auto-select-all part (no per-item toggle UI yet).
export interface DocumentSetSummary {
  id: number;
  name: string;
  description?: string;
  is_up_to_date: boolean;
  is_public: boolean;
  zone?: 'COMMON' | 'UNIT' | 'PERSONAL' | string;
  owner_dept_code?: string;
}

// Matches pmbc_web's conversation row shape (chatbot.component.html
// `conv-row`, backed by `ApiChatBoxService.searchConversations`) — id,
// title, and the pin/star flags used to sort/badge each row. Left sidebar
// only reads/lists these for now; toggling pin/star isn't wired yet.
export interface ConversationSummary {
  id: string;
  title?: string;
  isPinned?: boolean;
  isStarred?: boolean;
  updatedAt?: string;
  // Show/hide flag for the history screen's "Ẩn" action — false means the
  // conversation was hidden via POST /chatbot/conversations/status.
  status?: boolean;
  [key: string]: unknown;
}

export type ConversationSearchFilter = 'recent' | 'starred';

// Matches pmbc_web's raw Mongo message shape (chatbot.component.ts
// `mapMongoMessagesToListChat`) — only the fields mobile actually reads.
export interface ConversationMessage {
  id: string;
  role: ChatRole;
  content: string;
}

export interface ConversationMessagesPage {
  messages: ConversationMessage[];
  offset: number;
  limit: number;
  total: number;
  title?: string;
}

// Upstream NDJSON packet — loosely typed on purpose: the upstream service
// (Danswer/Onyx-style chat proxy) emits many packet shapes and only a
// handful (`message_delta`, `stop`, `error`, plus the top-level metadata
// fields) are actually consumed on mobile for now.
export interface ChatStreamPacket {
  obj?: {
    type: string;
    content?: string;
    [key: string]: unknown;
  };
  placement?: unknown;
  chat_session_id?: string;
  reserved_assistant_message_id?: number | string;
  message_id?: number | string;
  error?: string;
  error_code?: string;
  [key: string]: unknown;
}
