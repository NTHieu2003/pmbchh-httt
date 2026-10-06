// Matches pmbc_web's MessageVoidChat — one STT utterance recorded during a
// "Phòng họp không giấy" session. `content` is the (re-transcribed, cleaned)
// full text shown in "Ý kiến đầy đủ"; `content_tomtat` is the per-utterance
// AI summary shown in "Tóm tắt ý kiến" (see MessageVoidChatService.
// updateContentTomtat / AiService.summarizeText on web).
export interface MessageVoidChatItem {
  gid: number;
  khp_gid?: number;
  userId?: number;
  fullname?: string;
  vaitro?: string;
  content?: string;
  content_tomtat?: string;
  fileAudio?: string;
  gidCTH?: number;
  titleCTH?: string;
  time?: string;
  realTime?: string;
  status?: number;
}

export interface SearchMessageVoidChatRequest {
  khp_gid?: number;
  status?: number;
  type?: number;
  tuKhoa?: string;
  pageIndex: number;
  pageSize: number;
}

export interface SearchMessageVoidChatResponse {
  lstMessageVoidChat?: MessageVoidChatItem[];
  totalItems?: number;
}

export interface GetAllMessageByKhpGidResponse {
  lstMessageVoidChat?: MessageVoidChatItem[];
}
