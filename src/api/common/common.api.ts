import { ApiClient } from '../axiosInstance';
import { COMMON_ENDPOINTS } from './common.endpoints';

export const CommonApi = {
  // Matches pmbc_web's CommonService.downloadFileByName — POST
  // /gateway/common/downloadFileCommon with { filename }, response
  // `{ blob: <base64 string> }`. Web decodes this into a Blob URL; mobile
  // feeds the base64 straight into a `data:` URI instead (see
  // chatbot-guide/GuideFileViewerModal.tsx).
  downloadFileByName: async (filename: string): Promise<string | null> => {
    const response = await ApiClient.post(COMMON_ENDPOINTS.DOWNLOAD_FILE, {
      filename,
    });
    const data = response as unknown as { blob?: string } | null | undefined;
    return data?.blob ?? null;
  },

  // Matches pmbc_web's CommonService.insertFileAndConverCommon — uploads an
  // attachment (full `data:<mime>;base64,...` URI, same shape
  // `FileReader.readAsDataURL` produces on web) and gets back the server
  // -side filename (`blob`) to save as `filedinhkem` on the owning record.
  insertFileAndConvert: async (name: string, fileDataUrl: string): Promise<string | null> => {
    const response = await ApiClient.post(COMMON_ENDPOINTS.INSERT_FILE_AND_CONVERT, {
      name,
      file: fileDataUrl,
      isConverted: true,
    });
    const data = response as unknown as { blob?: string } | null | undefined;
    return data?.blob ?? null;
  },
};
