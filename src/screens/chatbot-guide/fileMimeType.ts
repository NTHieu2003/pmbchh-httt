const EXT_MIME: Record<string, string> = {
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
  mkv: 'video/x-matroska',
  avi: 'video/x-msvideo',
};

export const getMimeType = (fileName: string, fallback: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return EXT_MIME[ext] ?? fallback;
};
