// Matches pmbc_web's TinhHuongHuanLuyenDetail/SearchTinhHuongHuanLuyenRequest
// (service/tinhhuonghuanluyen) — a "tình huống huấn luyện" (training
// situation) that can be attached to one "kịch bản ứng phó CBRN" (kbupid)
// via the attach-thhl dialog (see CbrnScenarioAttachModal.tsx).
export interface TinhHuongHuanLuyenItem {
  gid: number;
  ten_tinhhuong?: string;
  mo_ta?: string;
  filedinhkem?: string;
  kbupid?: number;
  kbup_ten?: string;
  kbup_filedinhkem?: string;
  ngay_tao?: string;
  nguoi_tao?: number;
  nguoi_taoST?: string;
}

export interface SearchTinhHuongHuanLuyenRequest {
  tu_khoa?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface SearchTinhHuongHuanLuyenResponse {
  lstTinhHuongHuanLuyen?: TinhHuongHuanLuyenItem[];
  totalItems?: number;
}
