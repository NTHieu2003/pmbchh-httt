import { useCallback, useEffect, useState } from 'react';
import RNFS from 'react-native-fs';

import type { PdfViewerFile } from '@/components/PdfViewerModal';

import { PmbcKichBanUngPhoCbrnApi } from '@/api/pmbckichbanungphocbrn';
import { appAlert } from '@/components/AppDialog';
import { useDebounce } from '@/hooks/useDebounce';

import type { PmbcKichBanUngPhoCbrnItem } from '@/types';

// null = "-- Tất cả --" (matches web's `trang_thai` filter select).
export type CbrnScenarioStatusFilter = null | 1 | 2;

export interface UseCbrnScenarioResult {
  items: PmbcKichBanUngPhoCbrnItem[];
  isLoading: boolean;
  isRefreshing: boolean;
  isError: boolean;
  refetch: () => void;
  onPullToRefresh: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  statusFilter: CbrnScenarioStatusFilter;
  setStatusFilter: (value: CbrnScenarioStatusFilter) => void;
  selectedItem: PmbcKichBanUngPhoCbrnItem | null;
  openDetail: (item: PmbcKichBanUngPhoCbrnItem) => void;
  closeDetail: () => void;
  isExporting: boolean;
  // 1 = Excel (.xls), 2 = PDF — matches web's "Xuất dữ liệu" dropdown
  // ("In Excel" / "In PDF", printDL(type)).
  onExport: (type: 1 | 2) => void;
  // Set after a PDF export is written — the screen opens it in the
  // in-app viewer right away (Excel exports still just show an alert dialog).
  pdfPreview: PdfViewerFile | null;
  closePdfPreview: () => void;
}

const EXPORT_FILE_BASE_NAME = 'LIST_KICHBANUNGPHOCBRN_EXPORT';

// H.II.130 — "Xem kịch bản ứng phó sự cố, thảm họa liên quan đến CBRN qua
// giao diện Mobile" — read-only list + modal (mirrors the "Lĩnh vực
// Chatbot" screen's UI pattern), but this feature DOES have a real export
// API on web (`PmbcKichbanungphocbrnService.exportExcel`), so export is
// wired up for real instead of being a placeholder.
export const useCbrnScenario = (): UseCbrnScenarioResult => {
  const [items, setItems] = useState<PmbcKichBanUngPhoCbrnItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PmbcKichBanUngPhoCbrnItem | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfPreview, setPdfPreview] = useState<PdfViewerFile | null>(null);
  const closePdfPreview = useCallback(() => setPdfPreview(null), []);

  // "Tra cứu kịch bản" — matches web's quick-search box (bound to
  // `ten_kich_ban_cbrn`) plus its `trang_thai` filter select.
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [statusFilter, setStatusFilter] = useState<CbrnScenarioStatusFilter>(null);
  const hasActiveFilter = !!debouncedSearchQuery.trim() || statusFilter != null;

  const loadData = useCallback(
    (isPullToRefresh = false) => {
      if (isPullToRefresh) setIsRefreshing(true);
      else setIsLoading(true);
      setIsError(false);
      PmbcKichBanUngPhoCbrnApi.search({
        pageIndex: 0,
        pageSize: 200,
        ten_kich_ban_cbrn: debouncedSearchQuery.trim() || undefined,
        trang_thai: statusFilter ?? undefined,
      })
        .then((res) => setItems(res.lstPmbckichbanungphoCBRN ?? []))
        .catch(() => {
          setItems([]);
          setIsError(true);
        })
        .finally(() => {
          if (isPullToRefresh) setIsRefreshing(false);
          else setIsLoading(false);
        });
    },
    [debouncedSearchQuery, statusFilter]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onPullToRefresh = useCallback(() => loadData(true), [loadData]);

  const openDetail = useCallback((item: PmbcKichBanUngPhoCbrnItem) => setSelectedItem(item), []);
  const closeDetail = useCallback(() => setSelectedItem(null), []);

  // Matches web's printDL(type) — plain `exportExcel` when no filter is
  // active, `exportsearchExcel` (same filter fields as the list search)
  // once one is; `type` (1=Excel, 2=PDF) only changes the file extension
  // and is passed through as `typeExport` so the backend renders the
  // right format. Web opens PDFs in an in-app preview dialog instead of
  // downloading — mobile saves both to Downloads, consistent with every
  // other export/download action in this app.
  const onExport = useCallback(
    (type: 1 | 2) => {
      if (isExporting) return;
      setIsExporting(true);

      // A fixed file name collides with a stale file from a previous export
      // (Android's scoped storage ties write permission to whichever
      // process/app-session first created the file in Downloads — once
      // that session is gone, re-writing the same path throws EACCES even
      // though `ls` still shows it as group-writable) — timestamp suffix
      // keeps every export its own file.
      const fileName = `${EXPORT_FILE_BASE_NAME}_${Date.now()}${type === 1 ? '.xls' : '.pdf'}`;
      const request = {
        pageIndex: 0,
        pageSize: 9999,
        typeExport: type,
        ten_kich_ban_cbrn: debouncedSearchQuery.trim() || undefined,
        trang_thai: statusFilter ?? undefined,
      };
      const exportCall = hasActiveFilter
        ? PmbcKichBanUngPhoCbrnApi.exportSearchExcel(request)
        : PmbcKichBanUngPhoCbrnApi.exportExcel(request);

      exportCall
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
    [isExporting, debouncedSearchQuery, statusFilter, hasActiveFilter]
  );

  return {
    items,
    isLoading,
    isRefreshing,
    isError,
    refetch: loadData,
    onPullToRefresh,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    selectedItem,
    openDetail,
    closeDetail,
    isExporting,
    onExport,
    pdfPreview,
    closePdfPreview,
  };
};
