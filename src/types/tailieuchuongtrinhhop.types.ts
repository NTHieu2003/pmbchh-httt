// Matches pmbc_web/pmbc_mobile's TaiLieuChuongTrinhHop — a single row table
// that serves three different content kinds inside a meeting, told apart by
// `loai`: "CTH" = chương trình họp (agenda item), "TLH" = tài liệu họp
// (document), "NDPB" = nội dung phát biểu (speech content).
export interface TaiLieuChuongTrinhHopItem {
  gid: number;
  khp_gid?: number;
  stt?: number;
  tentailieu?: string;
  noidung?: string;
  filedinhkem?: string;
  thoigiantu?: string;
  thoigianden?: string;
  ngaytao?: string;
  nguoitao?: number;
  nguoitaoST?: string;
  loai?: 'CTH' | 'TLH' | 'NDPB' | string;
  // 0 = tài liệu cá nhân, 1 = tài liệu chung (TLH); with NDPB, 1 = công bố.
  trangthai?: number;

  // NDPB-only (nội dung phát biểu) — "người phát biểu" is a different
  // person than "người tạo" (nguoitao), and speeches carry an allotted
  // duration. Mirrors pmbc_web's noidungphatbieu.component.html bindings
  // (`element.userIdNguoiTG` / `.nguoithamgiakhacST` / `.thanhphanthu3` /
  // `.thoigian`) — not declared on web's own TaiLieuChuongTrinhHopDetail
  // class either, just returned loosely by the same BE row.
  userIdNguoiTG?: number;
  userIdNguoiTGST?: string;
  nguoithamgiakhacST?: string;
  thanhphanthu3?: string;
  // Phút.
  thoigian?: number;
}

export interface SearchTaiLieuChuongTrinhHopRequest {
  khp_gid?: number;
  loai?: string;
  pageIndex: number;
  pageSize: number;
}

export interface SearchTaiLieuChuongTrinhHopResponse {
  lstTaiLieuChuongTrinhHop?: TaiLieuChuongTrinhHopItem[];
  totalItems?: number;
}

// Matches pmbc_web's TaiLieuChuongTrinhHopRequest (insert/update body) —
// same field set the "Thêm mới" nội dung phát biểu cá nhân form submits
// (CreateNoiDungPhatBieuBoxComponent.add()).
export interface TaiLieuChuongTrinhHopRequest {
  gid?: number;
  khp_gid?: number;
  tentailieu?: string;
  noidung?: string;
  filedinhkem?: string;
  thoigiantu?: string;
  thoigianden?: string;
  ngaytao?: string;
  nguoitao?: number;
  loai?: string;
  trangthai?: number;
  // NDPB-only — the speaker (thanhphanthamgia.gid) and allotted minutes.
  nguoithamgia?: number;
  thoigian?: number;
  oldFile?: string;
}

export interface InsertTaiLieuChuongTrinhHopResponse {
  objDetail?: TaiLieuChuongTrinhHopItem;
}
