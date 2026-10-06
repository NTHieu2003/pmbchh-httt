import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { GuidePropertyApi } from '@/api/guideproperty';
import { PmbcHdsdChatbotApi } from '@/api/pmbchdsdchatbot';
import { useDebounce } from '@/hooks/useDebounce';

import type { PmbcHdsdChatbot } from '@/types';

export interface GuideViewerState {
  type: 'video' | 'pdf';
  fileName: string;
  title: string;
}

const PAGE_SIZE = 50;
// Matches pmbc_web's HDSDChatbotComponent.loadHuongDanTuThamSo() exactly —
// the video/PDF fileName comes from "Tham số hệ thống" (guideproperty),
// looked up by these two hardcoded codes, NOT from huong_dan_sd.
const CODE_HD_PDF = 'HD_CHATBOT_PDF';
const CODE_HD_VIDEO = 'HD_CHATBOT_VIDEO';

export interface UseChatbotGuideResult {
  searchKeyword: string;
  setSearchKeyword: (value: string) => void;
  isLoading: boolean;
  items: PmbcHdsdChatbot[];
  isEmpty: boolean;
  expandedIds: Record<number, boolean>;
  toggleExpanded: (id: number) => void;
  viewer: GuideViewerState | null;
  closeViewer: () => void;
  // The page-level "Tài liệu hướng dẫn Chatbot" card renders unconditionally
  // (no upfront fetch) — this only looks up the guide record + opens the
  // viewer when the user actually taps "Xem video"/"Xem PDF".
  isResolvingGuide: boolean;
  openGeneralGuide: (type: 'video' | 'pdf') => void;
}

// Chatbot FAQ list — confirmed live via POST /gateway/pmbchdsdchatbot/search
// (response `{ lstPmbcHDSDChatbot: [{ gid, cau_hoi, cau_tra_loi }], totalItems }`,
// search-by-question param is `cau_hoi`). Read-only, no add/edit/delete —
// mobile only searches and views.
export const useChatbotGuide = (): UseChatbotGuideResult => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const debouncedKeyword = useDebounce(searchKeyword, 300);

  const [items, setItems] = useState<PmbcHdsdChatbot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    PmbcHdsdChatbotApi.search({
      cau_hoi: debouncedKeyword.trim(),
      pageIndex: 0,
      pageSize: PAGE_SIZE,
    })
      .then((res) => setItems(res.items))
      .catch(() => setItems([]))
      .finally(() => setIsLoading(false));
  }, [debouncedKeyword]);

  const [expandedIds, setExpandedIds] = useState<Record<number, boolean>>({});
  const toggleExpanded = useCallback((id: number) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const [viewer, setViewer] = useState<GuideViewerState | null>(null);
  const closeViewer = useCallback(() => setViewer(null), []);

  const [isResolvingGuide, setIsResolvingGuide] = useState(false);
  const openGeneralGuide = useCallback((type: 'video' | 'pdf') => {
    setIsResolvingGuide(true);
    const code = type === 'pdf' ? CODE_HD_PDF : CODE_HD_VIDEO;
    GuidePropertyApi.getOneByCode(code)
      .then((detail) => {
        const fileName = detail?.file_dinhkem;
        if (!fileName) {
          // Matches web's exact warning copy from openDialogHuongdan().
          Alert.alert(
            'Thông báo',
            type === 'pdf'
              ? 'Chưa cấu hình file PDF trong Tham số hệ thống'
              : 'Chưa cấu hình file Video trong Tham số hệ thống'
          );
          return;
        }
        setViewer({
          type,
          fileName,
          title: type === 'video' ? 'Hướng dẫn Video' : 'Hướng dẫn PDF',
        });
      })
      .catch(() => Alert.alert('Lỗi', 'Không tải được tài liệu hướng dẫn.'))
      .finally(() => setIsResolvingGuide(false));
  }, []);

  return {
    searchKeyword,
    setSearchKeyword,
    isLoading,
    items,
    isEmpty: !isLoading && items.length === 0,
    expandedIds,
    toggleExpanded,
    viewer,
    closeViewer,
    isResolvingGuide,
    openGeneralGuide,
  };
};
