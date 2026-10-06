// Matches pmbc_web/pmbc_mobile's ThanhPhanThamGia — one row per attendee
// invited to a KHtochuchop meeting. `vaitro`: 1 = Chủ trì, 2 = Trợ lý,
// 3 = Người tham gia, 4 = Khách mời.
export interface ThanhPhanThamGiaItem {
  gid: number;
  khp_gid?: number;
  stt?: number;
  donvitochuc1?: string;
  donvitochuc1ST?: string;
  thanhphanthu3?: string;
  thanhvien?: number;
  thanhvienST?: string;
  anhthanhvien?: string;
  tenkhac?: string;
  capbac?: number;
  capbacST?: string;
  chucvu?: string;
  vaitro?: number;
  vaitroST?: string;
  vitri?: number;
  maghe?: string;
}

export interface SearchThanhPhanThamGiaRequest {
  khp_gid?: number;
  donvitochuc2?: string;
  pageIndex: number;
  pageSize: number;
}

export interface SearchThanhPhanThamGiaResponse {
  lstThanhPhanThamGia?: ThanhPhanThamGiaItem[];
  totalItems?: number;
}
