// Matches pmbc_web's PmbcKichbanungphocbrnDetail / Search request — kịch
// bản ứng phó sự cố, thảm họa liên quan đến CBRN. Mobile only reads this
// list (H.II.130 — "Xem"), no create/edit/delete, but DOES wire up export
// (web has a real exportExcel/exportsearchExcel API for this feature).
export interface PmbcKichBanUngPhoCbrnItem {
  gid: number;
  ten_kich_ban_cbrn?: string;
  mo_ta_kich_ban?: string;
  // 1 = Đang hoạt động, 2 = Không hoạt động.
  trang_thai?: number;
  file_dinh_kem?: string;
  time_created?: string;
  user_created?: number;
  user_createdST?: string;
}

export interface SearchPmbcKichBanUngPhoCbrnRequest {
  ten_kich_ban_cbrn?: string;
  mo_ta_kich_ban?: string;
  trang_thai?: number;
  pageIndex?: number;
  pageSize?: number;
  // 1 = xls, 2 = pdf — only relevant for the export endpoints.
  typeExport?: number;
}

export interface SearchPmbcKichBanUngPhoCbrnResponse {
  lstPmbckichbanungphoCBRN?: PmbcKichBanUngPhoCbrnItem[];
  totalItems?: number;
  totalPages?: number;
}

// exportExcel/exportsearchExcel both return a base64-encoded file blob,
// same shape as pmbc_web's other export endpoints.
export interface ExportPmbcKichBanUngPhoCbrnResponse {
  blob?: string;
}
