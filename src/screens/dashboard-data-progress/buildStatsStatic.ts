// TEMPORARY static data — the backend APIs for "biểu đồ loại dữ liệu đã
// được xây dựng" and "người dùng tích cực xây dựng dữ liệu" don't exist
// yet. Once they do, replace these constants with real calls inside
// `useDashboardDataProgress` (the components only consume the types below).

export interface DataTypeStat {
  code: string;
  label: string;
  count: number;
}

export interface ActiveContributor {
  userId: number;
  fullName: string;
  departmentName: string;
  documentCount: number;
  // ISO date (yyyy-mm-dd) of the user's most recent contribution.
  lastContributionAt: string;
}

export const STATIC_DATA_TYPE_STATS: DataTypeStat[] = [
  { code: 'THONG_TU', label: 'Thông tư', count: 128 },
  { code: 'QUYET_DINH', label: 'Quyết định', count: 96 },
  { code: 'HUONG_DAN', label: 'Hướng dẫn', count: 74 },
  { code: 'NGHI_DINH', label: 'Nghị định', count: 52 },
  { code: 'CHI_THI', label: 'Chỉ thị', count: 37 },
  { code: 'KE_HOACH', label: 'Kế hoạch', count: 29 },
  { code: 'LUAT', label: 'Luật', count: 14 },
  { code: 'KHAC', label: 'Khác', count: 11 },
];

export const STATIC_ACTIVE_CONTRIBUTORS: ActiveContributor[] = [
  { userId: 1, fullName: 'Nguyễn Văn Hùng', departmentName: 'Văn phòng', documentCount: 86, lastContributionAt: '2026-10-05' },
  { userId: 2, fullName: 'Trần Thị Mai', departmentName: 'Phòng Tham mưu', documentCount: 71, lastContributionAt: '2026-10-06' },
  { userId: 3, fullName: 'Lê Minh Tuấn', departmentName: 'Bộ môn 1', documentCount: 58, lastContributionAt: '2026-10-02' },
  { userId: 4, fullName: 'Phạm Quốc Bảo', departmentName: 'Phòng Kỹ thuật', documentCount: 44, lastContributionAt: '2026-09-29' },
  { userId: 5, fullName: 'Hoàng Thu Trang', departmentName: 'Phòng Chính trị', documentCount: 39, lastContributionAt: '2026-10-04' },
  { userId: 6, fullName: 'Vũ Đức Anh', departmentName: 'Phòng Hậu cần', documentCount: 27, lastContributionAt: '2026-09-25' },
  { userId: 7, fullName: 'Đặng Thị Hạnh', departmentName: 'Bộ môn 2', documentCount: 22, lastContributionAt: '2026-09-30' },
  { userId: 8, fullName: 'Bùi Văn Long', departmentName: 'Phòng Tham mưu', documentCount: 18, lastContributionAt: '2026-09-21' },
];
