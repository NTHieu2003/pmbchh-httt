import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import RNFS from 'react-native-fs';

import { AiApi } from '@/api/ai';
import { CommonApi } from '@/api/common';
import { KhtochuchopApi } from '@/api/khtochuchop';
import { MessageVoidChatApi } from '@/api/messageVoidChat';
import { SoDoPhongHopApi } from '@/api/sodophonghop';
import { TaiLieuChuongTrinhHopApi } from '@/api/tailieuchuongtrinhhop';
import { ThanhPhanThamGiaApi } from '@/api/thanhphanthamgia';
import { appAlert } from '@/components/AppDialog';
import {
  AudioPlaybackService,
  AudioRecordingService,
  requestMicrophonePermission,
} from '@/services/audio';
import { useAuthStore } from '@/stores';
import { SttSocketService, useMeetingSocket } from '@/services/websocket';

import type {
  KhtochuchopItem,
  MessageVoidChatItem,
  SoDoPhongHopItem,
  TaiLieuChuongTrinhHopItem,
  ThanhPhanThamGiaItem,
} from '@/types';

// Live, not-yet-persisted transcript for whoever currently holds the
// floor — mirrors pmbc_mobile's `messStream`: `content` is what's rendered,
// `lastText` tracks only the committed `<final>:` chunks so a later partial
// re-send doesn't duplicate already-confirmed text.
export interface LiveTranscript {
  speakerId: number;
  speakerName: string;
  content: string;
  lastText: string;
}

export interface UseMeetingRoomResult {
  isLoading: boolean;
  khtochuchop: KhtochuchopItem | null;
  sodoPhongHop: (SoDoPhongHopItem & { meetingLocation: string }) | null;
  chuTri: ThanhPhanThamGiaItem | null;

  // 1 = Chủ trì, 2 = Trợ lý, 3 = Người tham gia, 4 = Khách mời — only chủ
  // trì/trợ lý can drive the agenda/page navigation for the whole room.
  currentUserVaiTro: number | null;

  agendaItems: TaiLieuChuongTrinhHopItem[];
  currentAgendaIndex: number | null;
  currentAgendaItem: TaiLieuChuongTrinhHopItem | null;
  selectAgendaItem: (index: number) => void;
  goToPreviousAgendaItem: () => void;
  goToNextAgendaItem: () => void;

  currentPdfPage: number;
  setCurrentPdfPage: (page: number) => void;
  goToPreviousPdfPage: () => void;
  goToNextPdfPage: () => void;

  personalDocuments: TaiLieuChuongTrinhHopItem[];
  sharedDocuments: TaiLieuChuongTrinhHopItem[];
  personalSpeechContents: TaiLieuChuongTrinhHopItem[];
  publishedSpeechContents: TaiLieuChuongTrinhHopItem[];
  createPersonalSpeech: (input: {
    nguoithamgia: number;
    thoigian: number;
    noidung: string;
    filedinhkem?: string;
  }) => Promise<void>;
  toggleSpeechStatus: (item: TaiLieuChuongTrinhHopItem) => Promise<void>;
  deleteSpeech: (item: TaiLieuChuongTrinhHopItem) => Promise<void>;

  participants: ThanhPhanThamGiaItem[];
  joinedParticipants: ThanhPhanThamGiaItem[];
  notJoinedParticipants: ThanhPhanThamGiaItem[];

  // Keyed by `thanhvien` (userId) — mirrors pmbc_web's micStatus: turning a
  // mic ON resets every other key to false first, so at most one person is
  // highlighted as "speaking" at a time; turning one OFF only clears that
  // key.
  micStatus: Record<number, boolean>;
  toggleMic: (targetUserId: number) => void;
  toggleReminder: (targetUserId: number) => void;

  // "Mic chung" / "Mic riêng" — mirrors pmbc_web's ds-user switch (only
  // trợ lý sees/changes it, `*ngIf="isTroLy"`); it only changes which
  // socket message prefix `toggleMic` sends (`micChungOn_`/`micOn_`), not
  // how a received toggle is applied.
  typeMic: 'chung' | 'rieng';
  changeTypeMic: (type: 'chung' | 'rieng') => void;

  // "Tiến trình cuộc họp (STT)" panel — `liveTranscript` is this room's
  // current in-progress utterance (any speaker), `persistedMessages` is the
  // saved history backing both "Ý kiến đầy đủ" (`content`) and "Tóm tắt ý
  // kiến" (`content_tomtat`) sub-tabs. `isProcessingSpeech` covers the gap
  // between mic-off and the batch retranscribe+summarize landing.
  liveTranscript: LiveTranscript | null;
  persistedMessages: MessageVoidChatItem[];
  isProcessingSpeech: boolean;

  // "Nghe"/"Dừng" — mirrors pmbc_web's single `audioMessSelected`: at most
  // one persisted utterance plays at a time, `playingMessageGid` tracks
  // which. "Xóa tiến trình" is chủ trì/trợ lý only, gated in the UI layer
  // (`canDriveRoom`), same as web's `isTroLy` check.
  playingMessageGid: number | null;
  playMessageAudio: (item: MessageVoidChatItem) => void;
  deleteMessage: (item: MessageVoidChatItem) => void;

  leaveMeeting: () => void;
}

// 1 = Chủ trì, 2 = Trợ lý, 3 = Người tham gia, 4 = Khách mời — matches
// pmbc_mobile's handleUserJoinIn grouping (chủ trì first, rồi trợ lý, rồi
// người tham gia/khách mời gộp chung), used to sort "Đã tham gia" instead
// of leaving it in raw participant-search order.
const ROLE_SORT_PRIORITY: Record<number, number> = { 1: 0, 2: 1, 3: 2, 4: 2 };

// Group channel this device joins on the socket — identical shape to
// pmbc_mobile's `groupID${khp_gid}_${userId}` so the upstream (unchanged)
// treats mobile sessions exactly like the old app's.
const groupChannel = (khpGid: number, userId: number | null) => `groupID${khpGid}_${userId ?? ''}`;

// Mirrors pmbc_mobile's Phonghop.tsx `loadThongtinHop` + the socket
// `lstUserJoinIn`/`changeChapter` handlers — scoped to what Phase 1 reads
// (info, agenda, documents, participants, live presence + chapter sync).
// Voice/STT, phát biểu composing and the seating-chart editor are not
// ported yet (see plan.md Phase 2).
export const useMeetingRoom = (khpGid: number): UseMeetingRoomResult => {
  const userId = useAuthStore((state) => state.userId);
  const { sendMessage, subscribeSocket } = useMeetingSocket();

  const [isLoading, setIsLoading] = useState(true);
  const [khtochuchop, setKhtochuchop] = useState<KhtochuchopItem | null>(null);
  const [sodoPhongHop, setSodoPhongHop] = useState<
    (SoDoPhongHopItem & { meetingLocation: string }) | null
  >(null);
  const [participants, setParticipants] = useState<ThanhPhanThamGiaItem[]>([]);
  const [allDocuments, setAllDocuments] = useState<TaiLieuChuongTrinhHopItem[]>([]);
  const [allSpeechContents, setAllSpeechContents] = useState<TaiLieuChuongTrinhHopItem[]>([]);
  const [currentAgendaIndex, setCurrentAgendaIndex] = useState<number | null>(null);
  const [currentPdfPage, setCurrentPdfPageState] = useState(1);
  const [joinedUserIds, setJoinedUserIds] = useState<Set<number>>(new Set());
  const [micStatus, setMicStatus] = useState<Record<number, boolean>>({});
  // Default matches pmbc_web's `typeMic = "rieng"`.
  const [typeMic, setTypeMic] = useState<'chung' | 'rieng'>('rieng');
  const [liveTranscript, setLiveTranscript] = useState<LiveTranscript | null>(null);
  const [persistedMessages, setPersistedMessages] = useState<MessageVoidChatItem[]>([]);
  const [isProcessingSpeech, setIsProcessingSpeech] = useState(false);
  const [playingMessageGid, setPlayingMessageGid] = useState<number | null>(null);

  const sttSocketRef = useRef<SttSocketService | null>(null);
  // Snapshot of this device's own last-streamed utterance, kept separate
  // from `liveTranscript` display state — `applyMicStatus` clears that
  // state unconditionally on every mic toggle (so the NEXT speaker starts
  // blank), which would otherwise race with `stopOwnRecording` reading it.
  const ownLiveTextRef = useRef<{ content: string; lastText: string } | null>(null);

  const participantsRef = useRef<ThanhPhanThamGiaItem[]>([]);
  useEffect(() => {
    participantsRef.current = participants;
  }, [participants]);

  const micStatusRef = useRef<Record<number, boolean>>({});
  useEffect(() => {
    micStatusRef.current = micStatus;
  }, [micStatus]);

  const groupChannelName = groupChannel(khpGid, userId);

  const loadData = useCallback(() => {
    setIsLoading(true);

    const tptgRequest = { khp_gid: khpGid, donvitochuc2: '1', pageIndex: 0, pageSize: 999999 };
    const agendaRequest = { khp_gid: khpGid, pageIndex: 0, pageSize: 999999 };
    const speechRequest = { khp_gid: khpGid, loai: 'NDPB', pageIndex: 0, pageSize: 999999 };

    // `allSettled` (not `all`) — one slow/broken endpoint (e.g. sơ đồ phòng
    // chưa cấu hình cho địa điểm này) shouldn't blank the whole screen when
    // the other four requests succeeded fine.
    return Promise.allSettled([
      KhtochuchopApi.getById(khpGid),
      SoDoPhongHopApi.getList(),
      ThanhPhanThamGiaApi.search(tptgRequest),
      TaiLieuChuongTrinhHopApi.search(agendaRequest),
      TaiLieuChuongTrinhHopApi.searchNoiDungPhatBieu(speechRequest),
    ])
      .then(([khtRes, sodoRes, tptgRes, docRes, speechRes]) => {
        const meeting = khtRes.status === 'fulfilled' ? (khtRes.value.objDetail ?? null) : null;
        setKhtochuchop(meeting);

        setParticipants(
          tptgRes.status === 'fulfilled'
            ? (tptgRes.value.lstThanhPhanThamGia ?? []).filter(Boolean)
            : []
        );
        setAllDocuments(
          docRes.status === 'fulfilled'
            ? (docRes.value.lstTaiLieuChuongTrinhHop ?? []).filter(Boolean)
            : []
        );
        setAllSpeechContents(
          speechRes.status === 'fulfilled'
            ? (speechRes.value.lstTaiLieuChuongTrinhHop ?? []).filter(Boolean)
            : []
        );

        const rooms = sodoRes.status === 'fulfilled' ? (sodoRes.value.lstSoDoPhongHop ?? []) : [];
        const room = rooms.find((item) => item.gid === meeting?.khp_diadiem);
        if (room) {
          const location = [room.soPhong, room.diaChi].filter(Boolean).join(' ');
          setSodoPhongHop({ ...room, meetingLocation: location });
        } else {
          setSodoPhongHop(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, [khpGid]);

  const agendaItems = useMemo(
    () => allDocuments.filter((item) => item.loai === 'CTH'),
    [allDocuments]
  );
  const personalDocuments = useMemo(
    () => allDocuments.filter((item) => item.loai === 'TLH' && item.nguoitao === userId),
    [allDocuments, userId]
  );
  const sharedDocuments = useMemo(
    () => allDocuments.filter((item) => item.loai === 'TLH' && item.trangthai !== 0),
    [allDocuments]
  );

  // Mirrors pmbc_web's lstNoiDungPhatBieuCaNhan (own, any status) /
  // lstNoiDungBaiPhatBieu (trangthai === 1, công bố — visible to everyone)
  // two-column split, same shape as the Tài liệu cá nhân/chung split above.
  const personalSpeechContents = useMemo(
    () => allSpeechContents.filter((item) => item.loai === 'NDPB' && item.nguoitao === userId),
    [allSpeechContents, userId]
  );
  const publishedSpeechContents = useMemo(
    () => allSpeechContents.filter((item) => item.loai === 'NDPB' && item.trangthai === 1),
    [allSpeechContents]
  );

  const chuTri = useMemo(
    () => participants.find((item) => item.vaitro === 1) ?? null,
    [participants]
  );

  const currentUserVaiTro = useMemo(
    () => participants.find((item) => item.thanhvien === userId)?.vaitro ?? null,
    [participants, userId]
  );
  const canDriveRoom = currentUserVaiTro === 1 || currentUserVaiTro === 2;

  const joinedParticipants = useMemo(() => {
    const joined = participants.filter(
      (item) => item.thanhvien != null && joinedUserIds.has(item.thanhvien)
    );
    return [...joined].sort(
      (a, b) =>
        (ROLE_SORT_PRIORITY[a.vaitro ?? 3] ?? 2) - (ROLE_SORT_PRIORITY[b.vaitro ?? 3] ?? 2)
    );
  }, [participants, joinedUserIds]);
  const notJoinedParticipants = useMemo(
    () => participants.filter((item) => !item.thanhvien || !joinedUserIds.has(item.thanhvien)),
    [participants, joinedUserIds]
  );

  // Select an agenda item locally, and — if chủ trì/trợ lý — broadcast it so
  // every other device in the room follows along (matches pmbc_mobile's
  // `changeCTH` → `sendSocketService("chuTriMess_changeChapter_" + index)`).
  const selectAgendaItem = useCallback(
    (index: number) => {
      if (index < 0 || index >= agendaItems.length) return;
      setCurrentAgendaIndex(index);
      const vaiTro = participantsRef.current.find((item) => item.thanhvien === userId)?.vaitro;
      if (vaiTro === 1 || vaiTro === 2) {
        sendMessage(`chuTriMess_changeChapter_${index}`);
      }
    },
    [agendaItems.length, sendMessage, userId]
  );

  const goToPreviousAgendaItem = useCallback(() => {
    if (currentAgendaIndex != null) selectAgendaItem(currentAgendaIndex - 1);
  }, [currentAgendaIndex, selectAgendaItem]);

  const goToNextAgendaItem = useCallback(() => {
    if (currentAgendaIndex != null) selectAgendaItem(currentAgendaIndex + 1);
  }, [currentAgendaIndex, selectAgendaItem]);

  useEffect(() => {
    setCurrentAgendaIndex(agendaItems.length > 0 ? 0 : null);
  }, [agendaItems]);

  const currentAgendaItem =
    currentAgendaIndex != null ? (agendaItems[currentAgendaIndex] ?? null) : null;

  // Reset to page 1 every time the slide itself changes (new file loaded).
  useEffect(() => {
    setCurrentPdfPageState(1);
  }, [currentAgendaItem?.filedinhkem]);

  // Same broadcast pattern as the agenda — only chủ trì/trợ lý's page turns
  // sync to the rest of the room (matches `clickChangePagePDF` →
  // `chuTriMess_changePage_` + page).
  const setCurrentPdfPage = useCallback(
    (page: number) => {
      if (page < 1) return;
      setCurrentPdfPageState(page);
      if (canDriveRoom) {
        sendMessage(`chuTriMess_changePage_${page}`);
      }
    },
    [canDriveRoom, sendMessage]
  );

  const goToPreviousPdfPage = useCallback(() => {
    setCurrentPdfPage(currentPdfPage - 1);
  }, [currentPdfPage, setCurrentPdfPage]);

  const goToNextPdfPage = useCallback(() => {
    setCurrentPdfPage(currentPdfPage + 1);
  }, [currentPdfPage, setCurrentPdfPage]);

  const leaveMeeting = useCallback(() => {
    sendMessage('userQuitMeeting');
  }, [sendMessage]);

  // Matches pmbc_web's toggleMic — only broadcasts the flip (as
  // `micChungOn_`/`micOn_` depending on `typeMic`); the actual `micStatus`
  // update happens when this device receives its own frame back from the
  // group (see `applyMicStatus`/the subscriber below), same as web.
  const toggleMic = useCallback(
    (targetUserId: number) => {
      const prefix = typeMic === 'chung' ? 'micChungOn' : 'micOn';
      sendMessage(
        `${prefix}_${targetUserId}_${!micStatusRef.current[targetUserId]}_${userId ?? ''}`
      );
    },
    [sendMessage, typeMic, userId]
  );

  // Matches pmbc_web's toggleReminder — the status segment isn't read by
  // the receiver (see handling below), it's kept only for protocol parity.
  const toggleReminder = useCallback(
    (targetUserId: number) => {
      sendMessage(
        `reminder_${targetUserId}_${!!micStatusRef.current[targetUserId]}_${userId ?? ''}`
      );
    },
    [sendMessage, userId]
  );

  // Matches pmbc_web's ds-user `changeTypeMic` — only broadcasts; `typeMic`
  // itself only updates on receiving the echo back (see subscriber below).
  const changeTypeMic = useCallback(
    (type: 'chung' | 'rieng') => {
      sendMessage(`changeTypeMic_${type}`);
    },
    [sendMessage]
  );

  // Shared by the `micOn`/`micChungOn` receive branches below — matches
  // pmbc_web's handling exactly: turning a mic ON resets every other known
  // key to false (so only one speaker is ever highlighted), turning one
  // OFF only clears that key; and the target user (if not the one who
  // triggered it) gets a toast, same as web's "Chủ trì đã bật/tắt mic của
  // bạn!".
  const applyMicStatus = useCallback(
    (targetUserId: number, status: boolean, fromUserId: number) => {
      // Matches pmbc_mobile clearing `messStream` on every mic toggle —
      // whoever's turn it is next starts from a blank live transcript.
      setLiveTranscript(null);

      setMicStatus((prev) => {
        if (status) {
          const next: Record<number, boolean> = {};
          Object.keys(prev).forEach((key) => {
            next[Number(key)] = false;
          });
          next[targetUserId] = true;
          return next;
        }
        return { ...prev, [targetUserId]: false };
      });

      if (userId != null && targetUserId === userId && fromUserId !== userId) {
        appAlert(
          'Thông báo',
          status ? 'Chủ trì đã bật mic của bạn!' : 'Chủ trì đã tắt mic của bạn!'
        );
      }
    },
    [userId]
  );

  // Loads the persisted "Ý kiến đầy đủ"/"Tóm tắt ý kiến" history — called on
  // screen entry and whenever another device's `reloadMessage` broadcast
  // arrives (sent right after that device finishes its own post-processing).
  const loadPersistedMessages = useCallback(() => {
    return MessageVoidChatApi.getAllByKhpGid(khpGid).then((res) => {
      setPersistedMessages(res.lstMessageVoidChat ?? []);
    });
  }, [khpGid]);

  // Matches pmbc_web's "Nghe"/"Dừng" (onStartAudioMessage) — downloads the
  // utterance's audio once per press and plays it; pressing the same row
  // again (or another row) stops whatever is currently playing first.
  const playMessageAudio = useCallback(
    (item: MessageVoidChatItem) => {
      if (playingMessageGid === item.gid) {
        AudioPlaybackService.stop();
        setPlayingMessageGid(null);
        return;
      }
      if (!item.fileAudio) return;

      setPlayingMessageGid(item.gid);
      CommonApi.downloadFileByName(`Audio_KHTCH_${khpGid}/${item.fileAudio}`)
        .then((base64Wav) => {
          if (!base64Wav) {
            setPlayingMessageGid(null);
            return null;
          }
          return AudioPlaybackService.play(base64Wav);
        })
        .catch(() => {})
        .finally(() => {
          setPlayingMessageGid((current) => (current === item.gid ? null : current));
        });
    },
    [khpGid, playingMessageGid]
  );

  // Matches pmbc_web's "Xóa tiến trình" (doDeleteTientrinhByGid).
  const deleteMessage = useCallback(
    (item: MessageVoidChatItem) => {
      MessageVoidChatApi.deleteObj(item.gid)
        .then(() => loadPersistedMessages())
        .then(() => sendMessage('reloadMessage'));
    },
    [loadPersistedMessages, sendMessage]
  );

  // Matches pmbc_mobile's `handleTalking` — appends a live partial/final STT
  // chunk broadcast over the main meeting socket (see SttSocketService's
  // `onMessage` → `talking_mess_...` relay in `startOwnRecording`) to
  // whoever is already being tracked as the current speaker, or starts a
  // fresh entry if this is a new utterance.
  const applyTalkingChunk = useCallback(
    (content: string, fromUserId: number) => {
      if (!content || !content.trim()) return;

      setLiveTranscript((prev) => {
        const speakerName =
          prev?.speakerId === fromUserId
            ? prev.speakerName
            : (participantsRef.current.find((item) => item.thanhvien === fromUserId)
                ?.thanhvienST ?? '');

        let nextContent: string;
        let nextLastText: string;

        if (prev && prev.speakerId === fromUserId) {
          nextContent = `${prev.content} ${content}`;
          nextLastText = prev.lastText;
          if (content.startsWith('<final>:') && content.replace('<final>:', '').trim() !== '.') {
            nextLastText = `${prev.lastText}${content.replace('<final>:', ' ')}`;
            nextContent = nextLastText;
          }
        } else {
          nextContent = content;
          nextLastText = '';
        }

        // Mirrored outside display state so `stopOwnRecording` can read the
        // final text even after `applyMicStatus` has already nulled
        // `liveTranscript` out for the next speaker.
        if (fromUserId === userId) {
          ownLiveTextRef.current = { content: nextContent, lastText: nextLastText };
        }

        return { speakerId: fromUserId, speakerName, content: nextContent, lastText: nextLastText };
      });
    },
    [userId]
  );

  // Matches pmbc_mobile's `handleStartRecording` — opens the dedicated STT
  // websocket, starts the native mic capture, and relays every chunk's
  // transcript back over the MAIN meeting socket as `talking_mess_...` so
  // every participant's screen (including this one) updates live via
  // `applyTalkingChunk` above.
  const startOwnRecording = useCallback(async () => {
    if (userId == null) return;

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) return;

    const sttSocket = new SttSocketService();
    const connected = await sttSocket.connect((raw) => {
      // The STT backend replies with a JSON envelope, not plain text —
      // `{"type":"partial"|"final","text":"...", ...}`. Filter out empty/
      // null-byte "no speech detected" frames, and prefix `<final>:` on a
      // committed segment (same convention `applyTalkingChunk` above and
      // pmbc_web's own rebroadcast already expect).
      let parsed: { type?: string; text?: string } | null = null;
      try {
        parsed = JSON.parse(raw);
      } catch {
        parsed = null;
      }
      // The STT engine emits a literal `<0x00>` placeholder token (not an
      // actual null byte) for segments where no speech was detected — strip
      // it the same as a real \u0000 before deciding whether there's
      // anything worth showing.
      const text = parsed?.text
        ?.replace(/<0x00>/g, '')
        .replace(/\u0000/g, '')
        .trim();
      if (!text) return;

      const payload = parsed?.type === 'final' ? `<final>:${text}` : text;
      sendMessage(`talking_mess_${payload}_${userId}`);
    });

    if (!connected) return;
    sttSocketRef.current = sttSocket;

    AudioRecordingService.start((base64Chunk) => {
      sttSocketRef.current?.sendPcmChunk(base64Chunk);
    });
  }, [sendMessage, userId]);

  // Matches pmbc_mobile's `handleStopRecording` → `xuLyHauXuLy`, but
  // persists the text already streamed live instead of re-transcribing the
  // full buffered audio — a second `/ai/transcribe` pass over the whole
  // recording produced a DIFFERENT (and often shorter/word-dropping) result
  // than what the room already watched stream in live, so what gets saved
  // no longer matched what was said. `ownLiveTextRef` holds exactly that
  // final streamed text; a per-utterance AI summary still runs for "Tóm
  // tắt ý kiến" (matches pmbc_web's AiService.summarizeText +
  // updateContentTomtat).
  const stopOwnRecording = useCallback(async () => {
    sttSocketRef.current?.close();
    sttSocketRef.current = null;
    const audioFileUri = await AudioRecordingService.stop();

    if (userId == null) return;

    const finalUtterance = ownLiveTextRef.current;
    ownLiveTextRef.current = null;
    const content = (finalUtterance?.lastText || finalUtterance?.content || '').trim();
    if (!content) return;

    const speaker = participantsRef.current.find((item) => item.thanhvien === userId);
    if (!speaker) return;

    setIsProcessingSpeech(true);
    try {
      // Upload the recorded audio so "Nghe" playback works, same folder
      // convention web's own upload uses (`KHtochuchopService.insertFile`,
      // folder `Audio_KHTCH_<khp_gid>`). Best-effort — a failed upload
      // shouldn't block saving the transcript text itself.
      let fileAudio: string | undefined;
      if (audioFileUri) {
        try {
          const localPath = audioFileUri.replace(/^file:\/\//, '');
          const base64Wav = await RNFS.readFile(localPath, 'base64');
          fileAudio =
            (await KhtochuchopApi.insertFile({
              gid: khpGid,
              folderName: `Audio_KHTCH_${khpGid}`,
              fileName: `file${Date.now()}${userId}.wav`,
              file: `data:audio/wav;base64,${base64Wav}`,
            })) ?? undefined;
        } catch {
          // Transcript still gets saved below without playback audio.
        }
      }

      const inserted = await MessageVoidChatApi.insert({
        khp_gid: khpGid,
        userId: speaker.thanhvien ?? userId,
        fullname: speaker.thanhvienST,
        vaitro: speaker.vaitroST,
        content,
        fileAudio,
        time: new Date().toISOString(),
        realTime: new Date().toISOString(),
        status: 1,
      });

      if (inserted?.gid != null) {
        const summary = await AiApi.summarizeText(content).catch(() => '');
        if (summary.trim()) {
          await MessageVoidChatApi.updateContentTomtat(inserted.gid, summary).catch(() => {});
        }
      }

      await loadPersistedMessages();
      sendMessage('reloadMessage');
    } catch {
      // Network/AI failure — the live transcript the room already saw
      // stays visible; nothing persisted, user can speak again.
    } finally {
      setIsProcessingSpeech(false);
    }
  }, [khpGid, loadPersistedMessages, sendMessage, userId]);

  // Matches pmbc_mobile's effect on `micStatus` — this device records only
  // while ITS OWN userId is the one currently flagged as speaking (fully
  // decentralized: every participant's device captures/streams its own
  // mic, see plan.md's STT research notes).
  const ownMicOn = userId != null ? !!micStatus[userId] : false;
  const prevOwnMicOnRef = useRef(false);
  useEffect(() => {
    if (ownMicOn && !prevOwnMicOnRef.current) {
      startOwnRecording();
    } else if (!ownMicOn && prevOwnMicOnRef.current) {
      stopOwnRecording();
    }
    prevOwnMicOnRef.current = ownMicOn;
  }, [ownMicOn, startOwnRecording, stopOwnRecording]);

  // Re-fetches just the NDPB rows — used after create/share/thu hồi/xóa and
  // when another device's action arrives over the socket, instead of
  // reloading the whole screen.
  const reloadSpeechContents = useCallback(() => {
    return TaiLieuChuongTrinhHopApi.searchNoiDungPhatBieu({
      khp_gid: khpGid,
      loai: 'NDPB',
      pageIndex: 0,
      pageSize: 999999,
    }).then((res) => {
      setAllSpeechContents((res.lstTaiLieuChuongTrinhHop ?? []).filter(Boolean));
    });
  }, [khpGid]);

  // Matches CreateNoiDungPhatBieuBoxComponent.add() — optionally uploads
  // the attachment first (insertFileAndConverCommon), then inserts the
  // NDPB row itself (trangthai: 0 = cá nhân/chưa công bố).
  const createPersonalSpeech = useCallback(
    async (input: {
      nguoithamgia: number;
      thoigian: number;
      noidung: string;
      filedinhkem?: string;
    }) => {
      await TaiLieuChuongTrinhHopApi.insert({
        khp_gid: khpGid,
        nguoithamgia: input.nguoithamgia,
        thoigian: input.thoigian,
        noidung: input.noidung,
        filedinhkem: input.filedinhkem,
        ngaytao: new Date().toISOString(),
        nguoitao: userId ?? undefined,
        loai: 'NDPB',
        trangthai: 0,
      });
      await reloadSpeechContents();
    },
    [khpGid, userId, reloadSpeechContents]
  );

  // Matches doSendPhatBieu — flips trangthai (0 ↔ 1) on the full record and
  // resends it, then broadcasts so other devices in the room reload too.
  const toggleSpeechStatus = useCallback(
    async (item: TaiLieuChuongTrinhHopItem) => {
      const nextStatus = item.trangthai === 0 ? 1 : 0;
      await TaiLieuChuongTrinhHopApi.update({ ...item, trangthai: nextStatus });
      await reloadSpeechContents();
      sendMessage(`chiaSeNoiDung_${item.gid}`);
    },
    [reloadSpeechContents, sendMessage]
  );

  const deleteSpeech = useCallback(
    async (item: TaiLieuChuongTrinhHopItem) => {
      await TaiLieuChuongTrinhHopApi.remove(item.gid);
      await reloadSpeechContents();
      sendMessage(`chiaSeNoiDung_${item.gid}`);
    },
    [reloadSpeechContents, sendMessage]
  );

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      loadData().then(() => {
        if (!isActive) return;
        sendMessage(groupChannelName);
      });
      loadPersistedMessages();

      const unsubscribe = subscribeSocket((data) => {
        if (typeof data !== 'string') return;

        if (data.includes('lstUserJoinIn')) {
          const idsRaw = data.split('_')[1];
          try {
            const ids: number[] = JSON.parse(idsRaw);
            setJoinedUserIds(new Set(ids));
          } catch {
            // ignore malformed presence frame
          }
          return;
        }

        if (data.includes('changeChapter')) {
          const index = Number(data.split('_').pop());
          if (!Number.isNaN(index)) setCurrentAgendaIndex(index);
          return;
        }

        if (data.includes('changePage')) {
          const page = Number(data.split('_').pop());
          if (!Number.isNaN(page)) setCurrentPdfPageState(page);
          return;
        }

        if (data.includes('chiaSeNoiDung')) {
          reloadSpeechContents();
          return;
        }

        if (data.startsWith('talking_mess_')) {
          const withoutPrefix = data.slice('talking_mess_'.length);
          const lastUnderscore = withoutPrefix.lastIndexOf('_');
          if (lastUnderscore === -1) return;
          const content = withoutPrefix.slice(0, lastUnderscore);
          const fromUserId = Number(withoutPrefix.slice(lastUnderscore + 1));
          if (!Number.isNaN(fromUserId)) applyTalkingChunk(content, fromUserId);
          return;
        }

        if (data === 'reloadMessage') {
          loadPersistedMessages();
          return;
        }

        if (data.includes('changeTypeMic')) {
          const type = data.split('_')[1];
          setTypeMic(type === 'chung' ? 'chung' : 'rieng');
          return;
        }

        if (data.includes('micChungOn') || data.includes('micOn')) {
          const parts = data.split('_');
          const targetUserId = Number(parts[1]);
          const status = parts[2] === 'true';
          const fromUserId = Number(parts[3]);
          if (!Number.isNaN(targetUserId)) {
            applyMicStatus(targetUserId, status, fromUserId);
          }
          return;
        }

        if (data.includes('reminder')) {
          const parts = data.split('_');
          const targetUserId = Number(parts[1]);
          const fromUserId = Number(parts[3]);
          if (userId != null && targetUserId === userId && fromUserId !== userId) {
            appAlert(
              'Thông báo',
              micStatusRef.current[targetUserId]
                ? 'Chủ trì đã nhắc nhở quá thời gian phát biểu!'
                : 'Chủ trì đã nhắc nhở chuẩn bị phát biểu!',
              undefined,
              { tone: 'warning' }
            );
          } else if (userId != null && fromUserId === userId) {
            appAlert('Thông báo', 'Đã gửi thông báo nhắc nhở!');
          }
        }
      });

      return () => {
        isActive = false;
        unsubscribe();
        sttSocketRef.current?.close();
        sttSocketRef.current = null;
        leaveMeeting();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [khpGid])
  );

  return {
    isLoading,
    khtochuchop,
    sodoPhongHop,
    chuTri,
    currentUserVaiTro,
    agendaItems,
    currentAgendaIndex,
    currentAgendaItem,
    selectAgendaItem,
    goToPreviousAgendaItem,
    goToNextAgendaItem,
    currentPdfPage,
    setCurrentPdfPage,
    goToPreviousPdfPage,
    goToNextPdfPage,
    personalDocuments,
    sharedDocuments,
    personalSpeechContents,
    publishedSpeechContents,
    createPersonalSpeech,
    toggleSpeechStatus,
    deleteSpeech,
    participants,
    joinedParticipants,
    notJoinedParticipants,
    micStatus,
    toggleMic,
    toggleReminder,
    typeMic,
    changeTypeMic,
    liveTranscript,
    persistedMessages,
    isProcessingSpeech,
    playingMessageGid,
    playMessageAudio,
    deleteMessage,
    leaveMeeting,
  };
};
