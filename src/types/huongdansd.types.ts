// Matches pmbc_web's Huong_dan_sd model (`service/huong_dan_sd`) — Q&A-style
// usage-guide entries. `hdsd_hd_nhanh` = question (web calls it "hướng dẫn
// nhanh"), `hdsd_hd_chitiet` = plain-text answer ("hướng dẫn chi tiết").
// `hdsd_file`/`hdsd_file_video` are optional PDF/video filenames — on mobile
// these back the single page-level "general guide" card only (no per-question
// file attachments; every FAQ answer is plain text, per explicit product call).
export interface HuongDanSd {
  hdsd_gid: number;
  hdsd_chuc_nang?: number;
  hdsd_chuc_nangST?: string;
  hdsd_nut?: number;
  hdsd_nutST?: string;
  hdsd_trang_thai?: number;
  hdsd_hd_nhanh?: string;
  hdsd_hd_chitiet?: string;
  hdsd_file?: string;
  hdsd_file_video?: string;
  hdsd_ngay_tao?: string;
}

// Matches pmbc_web's `SearchHuong_dan_sdRequest` field-for-field, including
// its constructor's zeroed/empty defaults — the backend's search endpoint
// returned 0 results for a sparse request (only tu_khoa/pageIndex/pageSize
// set, everything else omitted), but web always sends every field
// explicitly (zeros/empty strings, never omitted). Build this the same way
// (see `buildDefaultSearchRequest` in useChatbotGuide.hook.ts) rather than
// a partial object.
export interface SearchHuongDanSdRequest {
  hdsd_gid?: number;
  hdsd_chuc_nang?: number;
  hdsd_chuc_nangST?: string;
  hdsd_nut?: number;
  hdsd_nutST?: string;
  hdsd_trang_thai?: number;
  hdsd_trang_thaiST?: string;
  hdsd_hd_nhanh?: string;
  hdsd_hd_chitiet?: string;
  hdsd_file?: string;
  hdsd_nguoi_tao_id?: number;
  hdsd_nguoi_tao_idST?: string;
  hdsd_nguoi_tao_st?: string;
  hdsd_ngay_tao?: string;
  hdsd_file_video?: string;
  routerLink?: string;
  pageIndex?: number;
  pageSize?: number;
  tu_khoa?: string;
  orderDir?: string;
  sortBy?: string;
}
