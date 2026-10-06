# Họp không giấy (Paperless Meeting Room)

Port từ `pmbc_mobile` (cũ) sang `pmbc_mobile_v2`, viết lại clean theo đúng
convention của v2 (api/{feature} + screens/{feature} + hook pattern), KHÔNG
copy nguyên file. WebSocket URL và REST endpoints giữ nguyên 1:1 với BE cũ.

## Nguồn tham khảo (pmbc_mobile cũ)
- `src/screens/KehoachHop.tsx` — danh sách kế hoạch tổ chức họp
- `src/screens/Phonghop.tsx` (2445 dòng) — màn "Phòng họp không giấy"
- `src/services/WebSocketService.ts` + `src/contexts/WebSocketProvider.tsx`
- `src/services/appService/{khtochuchop,thanhphanthamgia,tailieuchuongtrinhhop,soDoPhongHop,messageVoidChat}`

## Phase 1 (làm trong lượt này) — nền tảng + UI đọc dữ liệu
- [x] `src/types/khtochuchop.types.ts`, `thanhphanthamgia.types.ts`,
      `tailieuchuongtrinhhop.types.ts`, `sodophonghop.types.ts`
- [x] `src/api/khtochuchop/`, `thanhphanthamgia/`, `tailieuchuongtrinhhop/`,
      `sodophonghop/` — endpoints + api.ts (giữ nguyên path `/gateway/...`)
- [x] `src/services/websocket/` — WebSocketService (singleton) +
      WebSocketProvider (context), giữ nguyên URL
      `wss://smta.lqdtu.edu.vn/gateway/websocket` (bản domain mới, cùng path
      `/gateway/websocket` như code cũ dùng `ws://103.124.94.201:4300/...`),
      cùng protocol: connectReq (base64 token) + ping 10s + subscribe callback
- [x] `screens/meeting-plan` — danh sách kế hoạch tổ chức họp (list + tap vào
      item → mở MeetingRoomScreen)
- [x] `screens/meeting-room` — màn chính: header, thông tin chung, chương trình
      họp (danh sách mục, chọn mục hiện tại — đồng bộ qua socket
      `changeChapter`), tài liệu, danh sách thành phần tham gia (tham gia /
      chưa tham gia), presence qua socket (`lstUserJoinIn`)
- [x] Đăng ký route `MEETING_PLAN_SCREEN`, `MEETING_ROOM_SCREEN` vào
      `MainStackNavigator` + menu item trong `MainDrawerContent`

## Phase 2 (chưa làm — cần xác nhận thêm trước khi làm)
- Ghi âm + phát biểu real-time qua STT (`react-native-audio-record`,
  `expo-av` tương đương) — code cũ trỏ tới WebSocket LAN nội bộ
  (`ws://10.86.1.107:4001`), không chắc còn hoạt động / reachable.
- Rich text editor cho nội dung phát biểu (`react-native-pell-rich-editor`).
- PDF viewer đồng bộ trang qua socket (`react-native-pdf` + `changePage`).
- Sơ đồ chỗ ngồi tương tác (kéo-thả) — `soDoPhongHop` mới chỉ đọc list, chưa
  có canvas editor.
