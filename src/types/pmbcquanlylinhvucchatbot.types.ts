// Matches pmbc_web's PmbcQuanlylinhvucchatbotDetail / Search request —
// "lĩnh vực" (field) entries belonging to a "ngành đặc thù" (specialized
// sector) for the Chatbot. Mobile only reads this list (H.III.131 — "Xem"),
// no create/edit/delete.
export interface PmbcQuanLyLinhVucChatbotItem {
  gid: number;
  nganhDacThu?: number;
  nganhDacThuST?: string;
  maLinhVuc?: string;
  tenLinhVuc?: string;
  moTa?: string;
  // 1 = Hoạt động, 0 = Không hoạt động.
  trangThai?: number;
  time_create?: string;
  user_create?: number;
  user_createdST?: string;
}

export interface SearchPmbcQuanLyLinhVucChatbotRequest {
  pageIndex?: number;
  pageSize?: number;
  // 1 = xls, 2 = pdf — only relevant for the export endpoint.
  typeExport?: number;
}

export interface SearchPmbcQuanLyLinhVucChatbotResponse {
  lstObj?: PmbcQuanLyLinhVucChatbotItem[];
  totalItems?: number;
  totalPages?: number;
}

// exportExcel returns a base64-encoded file blob, same shape as pmbc_web's
// other export endpoints (e.g. Pmbc_KichbanungphoCBRNRsService.exportExcel).
export interface ExportPmbcQuanLyLinhVucChatbotResponse {
  blob?: string;
}
