// Matches the real backend's `pmbchdsdchatbot` feature — Chatbot FAQ Q&A,
// confirmed live via POST /gateway/pmbchdsdchatbot/search (response:
// `{ lstPmbcHDSDChatbot: [{ gid, cau_hoi, cau_tra_loi }], totalItems, totalPages }`).
// No file fields at all — every answer is plain text, matches product intent
// (no per-question video/PDF attachments).
export interface PmbcHdsdChatbot {
  gid: number;
  cau_hoi: string;
  cau_tra_loi: string;
}

export interface SearchPmbcHdsdChatbotRequest {
  // Search-by-question param — matches the field name on `PmbcHdsdChatbot`
  // itself (`cau_hoi`), not a generic `tu_khoa` keyword field.
  cau_hoi?: string;
  pageIndex?: number;
  pageSize?: number;
}
