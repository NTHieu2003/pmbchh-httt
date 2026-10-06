// Matches pmbc_web/pmbc_mobile's KHtochuchop (Kế hoạch tổ chức họp) — a
// scheduled meeting/session that a "Phòng họp không giấy" room is built
// around. Field names kept identical to the BE DTO so the NDJSON-less REST
// payloads can be diffed directly against the old mobile source.
export interface KhtochuchopItem {
  khp_gid: number;
  khp_tieude?: string;
  khp_loaicuochop?: number;
  khp_loaicuochopST?: string;
  khp_donvitochuc1?: string;
  khp_donvitochuc1ST?: string;
  khp_thoigiantu?: string;
  khp_thoigianden?: string;
  khp_diadiem?: number;
  khp_diadiemST?: string;
  khp_chutri?: number;
  khp_chutriST?: string;
  khp_troly?: number;
  khp_trolyST?: string;
  khp_ngaytao?: string;
  khp_nguoitao?: number;
  khp_nguoitaoST?: string;
  khp_maphong?: string;
  khp_isxepcho?: number;
  khp_tuan?: number;
}

export interface SearchKhtochuchopRequest {
  khp_tieude?: string;
  pageIndex: number;
  pageSize: number;
}

export interface SearchKhtochuchopResponse {
  lstKHtochuchop?: KhtochuchopItem[];
  totalItems?: number;
}

export interface GetByIdKhtochuchopResponse {
  objDetail?: KhtochuchopItem;
}
