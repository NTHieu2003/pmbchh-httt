// Matches pmbc_web's ApiDashboardUserService — Dashboard người dùng feature.
// Mobile only consumes the KPI + top-N list fields (filter bar, charts and
// Excel/PDF export are web-only, not ported here).
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

export interface SearchApiDashboardUserRequest {
  fromDate?: string | null;
  toDate?: string | null;
  deptCode?: string;
}

export interface ApiDashboardUserResponse {
  totalUsers?: number;
  totalUsersGrowth?: number | null;
  activeUsers?: number;
  activeUsersGrowth?: number | null;
  accessCount?: number;
  accessCountGrowth?: number | null;
  actionCount?: number;
  actionCountGrowth?: number | null;
  updatedAt?: string;
  fromDate?: string;
  toDate?: string;
  lstTheoDonVi?: ApiDashboardUserItem[];
  lstTheoNguoiDung?: ApiDashboardUserItem[];
  // Backs the "Đơn vị" filter autocomplete.
  lstDonViFilter?: ApiDashboardUserItem[];
}
