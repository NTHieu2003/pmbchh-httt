// TEMPORARY static data — the backend API for "biểu đồ loại chức năng hay
// được sử dụng" doesn't exist yet. Once it does, replace this constant with
// a real call inside `useDashboardUserStats` (ideally filtered by the same
// Từ ngày / Đến ngày / Đơn vị as the rest of the dashboard).

export interface FeatureUsageStat {
  code: string;
  label: string;
  // Number of uses (lượt sử dụng) in the selected period.
  count: number;
}

export const STATIC_FEATURE_USAGE: FeatureUsageStat[] = [
  { code: 'CHATBOT', label: 'Chatbot hỏi đáp', count: 412 },
  { code: 'HOP_KHONG_GIAY', label: 'Họp không giấy', count: 268 },
  { code: 'DASHBOARD_NGUOI_DUNG', label: 'Dashboard người dùng', count: 175 },
  { code: 'TIEN_DO_DU_LIEU', label: 'Tiến độ dữ liệu', count: 143 },
  { code: 'MO_PHONG_PHAT_TAN', label: 'Mô phỏng phát tán', count: 96 },
  { code: 'KICH_BAN_CBRN', label: 'Kịch bản ứng phó CBRN', count: 81 },
  { code: 'LICH_SU_CHATBOT', label: 'Lịch sử tương tác Chatbot', count: 47 },
  { code: 'LINH_VUC_CHATBOT', label: 'Lĩnh vực Chatbot', count: 29 },
  { code: 'HUONG_DAN_CHATBOT', label: 'Hướng dẫn Chatbot', count: 18 },
];
