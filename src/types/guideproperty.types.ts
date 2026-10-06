// Matches pmbc_web's GuidePropertyDetail — "Tham số hệ thống" (system
// parameters). The Chatbot guide screen's video/PDF buttons resolve their
// fileName by looking up two hardcoded parameter codes here
// (HD_CHATBOT_PDF / HD_CHATBOT_VIDEO), NOT via huong_dan_sd — see
// pmbc_web's HDSDChatbotComponent.loadHuongDanTuThamSo().
export interface GuidePropertyDetail {
  id: number;
  name_gui: string;
  file_dinhkem?: string;
  // Used for config-style params (e.g. URL_SOCKET_WEB) — pmbc_web's
  // login flow reads this field, not `file_dinhkem`, for those.
  description?: string;
}
