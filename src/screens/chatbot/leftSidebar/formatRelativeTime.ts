// Ported verbatim from pmbc_web's chatbot.component.ts `formatRelativeTime`.
export function formatRelativeTime(input: string | number | Date | null | undefined): string {
  if (!input) return '';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffMin < 1) return 'Vừa xong';
  if (diffMin < 60) return `${diffMin}p`;
  if (d.toDateString() === now.toDateString()) {
    return d.toTimeString().substring(0, 5);
  }
  if (diffD === 1) return 'Hôm qua';
  if (diffD < 7) return `${diffD} ngày trước`;
  return d.toLocaleDateString('vi-VN');
}
