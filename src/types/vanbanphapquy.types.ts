// Matches pmbc_web's SearchVanbanphapquyRequest/VanbanphapquyDetail — only
// the fields the "Tiến độ dữ liệu" stats screen reads (trang_thai 1 = còn
// hiệu lực, 2 = hết hiệu lực; loại văn bản comes as free-text ST field).
export interface VanbanphapquyItem {
  gid: number;
  so_hieu?: string;
  ten_vb?: string;
  gid_loaivb?: number;
  gid_loaivbST?: string;
  ngay_banhanh?: string;
  ngay_tao?: string;
  ngay_cap_nhat?: string;
  trang_thai?: number;
  trang_thaiST?: string;
  donvi_tao?: string;
  donvi_taoST?: string;
}

export interface SearchVanbanphapquyRequest {
  pageIndex?: number;
  pageSize?: number;
}

export interface SearchVanbanphapquyResponse {
  lstVanbanphapquy?: VanbanphapquyItem[];
  totalItems?: number;
}
