// Matches pmbc_web's ApiChatBoxService — `/chatbot/**` is public on the
// gateway (no Authorization header required), same as the web client.
export const CHATBOT_ENDPOINTS = {
  SEND_CHAT_MESSAGE: '/gateway/chatbot/send-chat-message',
  CONVERSATIONS: '/gateway/chatbot/conversations',
  STOP: (sessionId: string) =>
    `/gateway/chatbot/stop/${encodeURIComponent(sessionId)}`,
  DOCUMENT_SETS_FOR_CHAT: '/gateway/chatbot/document-sets/for-chat',
  CONVERSATIONS_SEARCH: '/gateway/chatbot/conversations/search',
  CONVERSATION_MESSAGES: (id: string) =>
    `/gateway/chatbot/conversations/${encodeURIComponent(id)}/messages`,
  CONVERSATION: (id: string) =>
    `/gateway/chatbot/conversations/${encodeURIComponent(id)}`,
  CONVERSATION_PIN: (id: string) =>
    `/gateway/chatbot/conversations/${encodeURIComponent(id)}/pin`,
  CONVERSATION_STAR: (id: string) =>
    `/gateway/chatbot/conversations/${encodeURIComponent(id)}/star`,
  CONVERSATION_STATUS: '/gateway/chatbot/conversations/status',
} as const;
