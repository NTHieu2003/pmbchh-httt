// Matches pmbc_web's DashboardUserComponent.growthText/growthClass exactly.
export const formatNumber = (n: number | undefined): string => (n || 0).toLocaleString('vi-VN');

export const growthText = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return 'Kỳ trước chưa có dữ liệu';
  if (value > 0) return `↑ ${value}% so với kỳ trước`;
  if (value < 0) return `↓ ${Math.abs(value)}% so với kỳ trước`;
  return 'Không đổi so với kỳ trước';
};

export const growthColor = (value: number | null | undefined, mutedColor: string): string => {
  if (value === null || value === undefined || value === 0) return mutedColor;
  return value > 0 ? '#16a34a' : '#dc2626';
};

// Compact form shown beside the KPI number, e.g. "2 (↑100%)" — same sign
// convention as `growthText` without the full "so với kỳ trước" sentence.
export const growthShortText = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '—';
  if (value > 0) return `↑${value}%`;
  if (value < 0) return `↓${Math.abs(value)}%`;
  return '0%';
};
