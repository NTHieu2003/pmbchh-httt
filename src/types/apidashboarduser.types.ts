// Dashboard người dùng + thống kê xây dựng dữ liệu — contracts per the
// backend specs CN124 ("API Top 10 chức năng được sử dụng nhiều nhất") and
// CN125 ("API thống kê xây dựng dữ liệu"), all under /gateway/apidashboarduser.

// Present on every response; `code === '00'` is success, '000' a server-side
// processing error (still HTTP 200).
export interface ApiDashboardResult {
  code?: string;
  ok?: boolean;
  message?: string;
}

export interface ApiDashboardUserItem {
  sttExport?: number;
  deptCode?: string;
  deptName?: string;
  userName?: string;
  fullName?: string;
  ngay?: string;
  ngayST?: string;
  soNguoiDung?: number;
  luotTruyCap?: number;
  soThaoTac?: number;
  tyLe?: number;
  lanCuoi?: string;
  lanCuoiST?: string;
}

// lstTopChucNang[] of /getData (CN124).
export interface TopChucNangItem {
  sttExport?: number;
  tenChucNang?: string;
  // Web path of the feature, e.g. /danhmucchung/quanly-nhiemvu — the
  // feature's identity key.
  duongDan?: string;
  soThaoTac?: number;
  soNguoiDung?: number;
  // % of all feature-attributed actions in the period (not just the top 10).
  tyLe?: number;
}

// Shared filter of all three APIs — every field optional, `{}` = last 30
// days, whole system. `limit` only applies to /getNguoiDungTichCuc.
export interface SearchApiDashboardUserRequest {
  fromDate?: string | null;
  toDate?: string | null;
  deptCode?: string;
  limit?: number;
}

interface ApiDashboardBaseResponse {
  result?: ApiDashboardResult;
  // Period the backend applied + aggregation time, ISO 8601 in UTC.
  fromDate?: string;
  toDate?: string;
  updatedAt?: string;
  deptCode?: string;
}

export interface ApiDashboardUserResponse extends ApiDashboardBaseResponse {
  totalUsers?: number;
  totalUsersGrowth?: number | null;
  activeUsers?: number;
  activeUsersGrowth?: number | null;
  newUsers?: number;
  newUsersGrowth?: number | null;
  accessCount?: number;
  accessCountGrowth?: number | null;
  actionCount?: number;
  actionCountGrowth?: number | null;
  lstTheoDonVi?: ApiDashboardUserItem[];
  lstTheoNguoiDung?: ApiDashboardUserItem[];
  lstTheoNgay?: ApiDashboardUserItem[];
  // Backs the "Đơn vị" filter autocomplete.
  lstDonViFilter?: ApiDashboardUserItem[];
  // Top 10 by soThaoTac, descending; empty when the period has no data.
  lstTopChucNang?: TopChucNangItem[];
}

// lstLoaiDuLieu[] of /getLoaiDuLieu (CN125 – API 1).
export interface LoaiDuLieuItem {
  sttExport?: number;
  // Absent for the "Chưa phân loại" group — that absence (not the label)
  // is how the group is recognised.
  maLoai?: number;
  tenLoai?: string;
  soDuLieu?: number;
  soNguoiDung?: number;
  // % of tongDuLieu.
  tyLe?: number;
  lanCuoi?: string;
  lanCuoiST?: string;
}

export interface LoaiDuLieuResponse extends ApiDashboardBaseResponse {
  // Total documents created in the period.
  tongDuLieu?: number;
  lstLoaiDuLieu?: LoaiDuLieuItem[];
}

// lstNguoiDungTichCuc[] of /getNguoiDungTichCuc (CN125 – API 2).
export interface NguoiDungTichCucItem {
  sttExport?: number;
  userId?: number;
  userName?: string;
  fullName?: string;
  deptCode?: string;
  deptName?: string;
  soTaoMoi?: number;
  soCapNhat?: number;
  // soTaoMoi + soCapNhat — the ranking key.
  tongDongGop?: number;
  soLoaiDuLieu?: number;
  lanCuoi?: string;
  // lanCuoi in Vietnam time, "HH:mm dd/MM/yyyy".
  lanCuoiST?: string;
}

export interface NguoiDungTichCucResponse extends ApiDashboardBaseResponse {
  tongDuLieu?: number;
  lstNguoiDungTichCuc?: NguoiDungTichCucItem[];
}
