import { useEffect, useState } from 'react';

import { TaiLieuChuongTrinhHopApi } from '@/api/tailieuchuongtrinhhop';
import { ThanhPhanThamGiaApi } from '@/api/thanhphanthamgia';

import type { TaiLieuChuongTrinhHopItem, ThanhPhanThamGiaItem } from '@/types';

export interface UseMeetingPlanInfoResult {
  isLoading: boolean;
  agendaItems: TaiLieuChuongTrinhHopItem[];
  documents: TaiLieuChuongTrinhHopItem[];
  participants: ThanhPhanThamGiaItem[];
}

// "Xem thông tin" — mirrors pmbc_web's "Danh sách chương trình họp" +
// "Danh sách tài liệu" + "Thành phần tham gia" (same data the standalone
// "Danh sách đại biểu" screen shows) tabs, read standalone here (outside a
// live meeting room, no websocket) by `khp_gid` alone.
export const useMeetingPlanInfo = (khpGid: number | null): UseMeetingPlanInfoResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [agendaItems, setAgendaItems] = useState<TaiLieuChuongTrinhHopItem[]>([]);
  const [documents, setDocuments] = useState<TaiLieuChuongTrinhHopItem[]>([]);
  const [participants, setParticipants] = useState<ThanhPhanThamGiaItem[]>([]);

  useEffect(() => {
    if (khpGid == null) {
      setAgendaItems([]);
      setDocuments([]);
      setParticipants([]);
      return;
    }

    let isActive = true;
    setIsLoading(true);

    Promise.allSettled([
      TaiLieuChuongTrinhHopApi.search({ khp_gid: khpGid, pageIndex: 0, pageSize: 999999 }),
      ThanhPhanThamGiaApi.search({
        khp_gid: khpGid,
        donvitochuc2: '1',
        pageIndex: 0,
        pageSize: 999999,
      }),
    ]).then(([docRes, tptgRes]) => {
      if (!isActive) return;

      const allDocuments =
        docRes.status === 'fulfilled'
          ? (docRes.value.lstTaiLieuChuongTrinhHop ?? []).filter(Boolean)
          : [];
      setAgendaItems(allDocuments.filter((item) => item.loai === 'CTH'));
      setDocuments(allDocuments.filter((item) => item.loai === 'TLH'));

      setParticipants(
        tptgRes.status === 'fulfilled'
          ? (tptgRes.value.lstThanhPhanThamGia ?? []).filter(Boolean)
          : []
      );
      setIsLoading(false);
    });

    return () => {
      isActive = false;
    };
  }, [khpGid]);

  return { isLoading, agendaItems, documents, participants };
};
