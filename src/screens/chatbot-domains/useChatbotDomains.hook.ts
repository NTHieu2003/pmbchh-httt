import { useCallback, useEffect, useState } from 'react';
import RNFS from 'react-native-fs';

import { appAlert } from '@/components/AppDialog';
import type { PdfViewerFile } from '@/components/PdfViewerModal';

import { PmbcQuanLyLinhVucChatbotApi } from '@/api/pmbcquanlylinhvucchatbot';

import type { PmbcQuanLyLinhVucChatbotItem } from '@/types';

export interface UseChatbotDomainsResult {
  items: PmbcQuanLyLinhVucChatbotItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
  onPullToRefresh: () => void;
  selectedItem: PmbcQuanLyLinhVucChatbotItem | null;
  openDetail: (item: PmbcQuanLyLinhVucChatbotItem) => void;
  closeDetail: () => void;
  isExporting: boolean;
  // 1 = Excel (.xls), 2 = PDF — matches the BE's typeExport contract
  // (pmbc_quanlylinhvucchatbotRsService.exportExcel).
  onExport: (type: 1 | 2) => void;
  // Set after a PDF export is written — the screen opens it in the
  // in-app viewer right away (Excel exports still just show an appAlert).
  pdfPreview: PdfViewerFile | null;
  closePdfPreview: () => void;
}

const EXPORT_FILE_BASE_NAME = 'LIST_LINHVUCCHATBOT_EXPORT';

// H.III.131 — "Xem lĩnh vực cho Chatbot với các ngành đặc thù trong BCHH" —
// read-only, mirrors pmbc_web's PmbcQuanlylinhvucchatbotComponent but drops
// create/edit/delete. The reference list is small (a handful of entries per
// the web screenshot), so a single generously-paged fetch replaces web's
// page-by-page pagination UI.
export const useChatbotDomains = (): UseChatbotDomainsResult => {
  const [items, setItems] = useState<PmbcQuanLyLinhVucChatbotItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PmbcQuanLyLinhVucChatbotItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<PdfViewerFile | null>(null);
  const closePdfPreview = useCallback(() => setPdfPreview(null), []);

  // `isPullToRefresh` keeps the list on screen (native pull-to-refresh
  // spinner) instead of swapping to the full-page loading state, which
  // would otherwise flash on every pull-down.
  const loadData = useCallback((isPullToRefresh = false) => {
    if (isPullToRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setIsError(false);
    PmbcQuanLyLinhVucChatbotApi.search({ pageIndex: 0, pageSize: 200 })
      .then((res) => setItems(res.lstObj ?? []))
      .catch(() => {
        setItems([]);
        setIsError(true);
      })
      .finally(() => {
        if (isPullToRefresh) setIsRefreshing(false);
        else setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onPullToRefresh = useCallback(() => loadData(true), [loadData]);

  const openDetail = useCallback((item: PmbcQuanLyLinhVucChatbotItem) => setSelectedItem(item), []);
  const closeDetail = useCallback(() => setSelectedItem(null), []);

  // A fixed file name collides with a stale file from a previous export —
  // Android's scoped storage ties write permission to whichever
  // app-session first created the file in Downloads, so re-writing the
  // same path later throws EACCES even though the file still shows as
  // group-writable (found & fixed on the CBRN scenario export, same root
  // cause applies here) — timestamp suffix keeps every export its own file.
  const onExport = useCallback(
    (type: 1 | 2) => {
      if (isExporting) return;
      setIsExporting(true);

      const fileName = `${EXPORT_FILE_BASE_NAME}_${Date.now()}${type === 1 ? '.xls' : '.pdf'}`;
      PmbcQuanLyLinhVucChatbotApi.exportExcel({ pageIndex: 0, pageSize: 9999, typeExport: type })
        .then(async (res) => {
          if (!res.blob) throw new Error('empty blob');
          const dir = RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath;
          const path = `${dir}/${fileName}`;
          await RNFS.writeFile(path, res.blob, 'base64');
          if (type === 2) {
            setPdfPreview({ path, fileName });
            return;
          }
          appAlert(
            'Xuất dữ liệu thành công',
            `Đã lưu file "${fileName}" vào thư mục Downloads.`
          );
        })
        .catch(() => {
          appAlert('Lỗi', 'Không thể xuất dữ liệu. Vui lòng thử lại.');
        })
        .finally(() => setIsExporting(false));
    },
    [isExporting]
  );

  return {
    items,
    isLoading,
    isRefreshing,
    isError,
    refetch: loadData,
    onPullToRefresh,
    selectedItem,
    openDetail,
    closeDetail,
    isExporting,
    onExport,
    pdfPreview,
    closePdfPreview,
  };
};
