# pmbc_mobile_v2 — Session Handoff Notes

Living context doc for continuing work on this project across Claude Code sessions.
Update this file at the end of a session if the user asks for another handoff dump.

## 1. What this project is

**pmbc_mobile_v2** is a **bare React Native CLI** (NOT Expo) tablet-first mobile app,
version 0.87.1. It clones features from **pmbc_web** (a large Angular admin system) backed by
a Java/Spring backend (**tnd_java_angular/fw-service**). This repo does not contain either of
those — they're separate repos/checkouts that need to be available locally (sibling directories
on the machine doing the work, paths vary per setup) whenever a feature needs to be verified
against web/backend source instead of guessed:

- **`pmbc_web`** (Angular admin system) — the source of truth for every feature being ported.
  When in doubt about an API contract or business rule, **read pmbc_web's source first**, don't
  guess. Angular app lives under `tnd_angular_web/admin/projects/web-admin/src/app/` inside that
  repo.
- **`tnd_java_angular/fw-service`** (Java/Spring backend) — the service both pmbc_web and this
  app call, nested inside the same `pmbc_web` repo/checkout. Controllers are `*RsService.java`
  (`src/main/java/com/tnd/gateway/rsService/`), business logic in
  `bussiness/impl/*BussinessImpl.java`, request/response DTOs under `request/<feature>/` and
  `response/<feature>/`. **Read this when a web component's service call isn't enough to
  understand the actual contract/behavior** (e.g. export endpoints, file template resolution —
  see §3).

Two other sibling RN apps (an Expo app used as a clean-architecture pattern reference for axios
setup/tablet detection/responsive sizing, and a legacy RN/Expo app using NativeWind/tailwind —
**this project explicitly does NOT use tailwind**, styling is `StyleSheet` + calculated
responsive values instead) were also used for pattern reference early in the project, but are
not required to continue work here — only `pmbc_web`/`fw-service` access is load-bearing for
ongoing feature parity work.

## 2. Tech stack & conventions

- **Bare React Native CLI 0.87.1**, Node pinned to `22.21.0` via `.nvmrc` (RN 0.87 requires
  Node ≥22; system default is 20.19.4 — always make sure the right Node is active).
- Path alias `@/*` → `src/*` (babel-plugin-module-resolver + tsconfig paths).
- **Axios** (`src/api/axiosInstance.ts`) — `ApiClient` is the shared instance:
  - Auto-attaches `Authorization: Bearer <token>` from `useAuthStore.getState().token`.
  - Response interceptor **unwraps `response.data`** — so every API function's `response`
    variable is already the body, not an axios envelope. Cast through `unknown` when typing.
  - On 401: tries one silent refresh via `/auth/refresh`, else logs out.
  - `if (__DEV__) console.log('[API REQUEST]', method, url)` and `[API ERROR]` on failure —
    **use `adb logcat -s ReactNativeJS` to watch these when debugging network issues.**
  - `resolveApiPath`/`shouldStripGatewayPrefix`: strips a leading `/gateway` from request paths
    **only** when the configured `API_URL` host contains `gateway_bchh` (i.e. already terminates
    at the gateway). Every endpoint constant in this codebase is written with a `/gateway/...`
    prefix (matching the `103.124.94.201:8888` host, where the prefix is required) — don't
    remove it from endpoint constants even if testing against a `gateway_bchh`-style host;
    the stripping is handled centrally.
- **TanStack Query** (`@tanstack/react-query`) — `QueryClientProvider` set up in `App.tsx`.
  First real usage was `useQlChuyenNganhDacThuList`.
- **Zustand** — `useAuthStore` (`src/stores/authStore.ts`).
- `react-native-keychain` for token persistence (bare-CLI equivalent of `expo-secure-store`).
- `react-native-device-info` for tablet detection (`useIsTablet` hook).
- `lucide-react-native` for icons — check `node_modules/lucide-react-native/dist/types/icons/`
  before assuming an icon name exists.
- `react-native-md5` for password MD5 hashing (matches web's `Md5.appendStr().end()`).
- `react-native-markdown-display` for rendering assistant chat messages — pure JS, no native
  linking. Style map lives in `src/screens/home/chat/markdownStyles.ts` (now `src/screens/chatbot/`,
  see §4).
- `useDebounce`/`useDebouncedCallback` (`src/hooks/useDebounce.ts`) — generic debounce hooks.
  **Use these instead of hand-rolled `setTimeout`+`useEffect` debounce logic** everywhere a
  search box exists (chatbot sidebars, CBRN scenario search, etc).
- **`react-native-audio-record`** (16kHz mono PCM16 capture) + **`base64-js`** (base64 encode/decode
  for audio chunks — replaced an earlier hand-rolled decoder that corrupted PCM data) +
  **`react-native-sound`** (playback) — the mic-triggered STT pipeline's native audio stack. See
  §3 for the WebSocket contract and §4 for the feature itself.
- **`react-native-gesture-handler` v3** (`Gesture.Pinch()/Pan()/Tap()`, `GestureDetector`) +
  **`react-native-reanimated` v4** + separate **`react-native-worklets`** package (babel plugin
  `'react-native-worklets/plugin'` must be the **last** plugin in `babel.config.js`). Used for
  free two-finger pinch-to-zoom (`ZoomableImage` component, see §4/§6 for a real bug that hit
  here). **Critical rule**: inside a React Native `<Modal>` (which opens a separate native
  window on Android), `GestureHandlerRootView` must be placed **inside** the Modal's content
  (not just once at the app root), and there must be exactly **one** such root per Modal — don't
  nest it inside legacy-touch-system views (`TouchableOpacity`, `onStartShouldSetResponder`) or
  multi-touch gestures misbehave (see §6, "pinch auto-closes modal").
- **`react-native-webview`** — used to render Leaflet maps (CBRN simulation's 2D map, no RN
  equivalent exists) via an HTML string built in JS and `injectJavaScript`/`onMessage` bridging.
  Also used to run **`html2canvas`** (loaded from a CDN `<script>` tag inside the WebView's HTML)
  to capture the map's rendered content as a PNG — `react-native-view-shot`/`captureRef` **cannot**
  see into a WebView's separate native rendering surface, so any screenshot/export feature touching
  WebView content must do the capture **inside** the WebView and post the result back through the
  bridge. See §4 "CBRN simulation — map image export".
- **`AppSelect`** (`src/components/AppSelect/`) — generic search/select input with a scrollable
  dropdown. **Use this for any future search-and-pick input.**
- **`AppPopover`** (`src/components/AppPopover/`) — context-menu that opens at an arbitrary tap
  point (`anchor: {x, y}` from `event.nativeEvent.pageX/pageY`). **Use this for any future
  kebab/context menu or dropdown-style action menu** — this is the component behind every
  "Xuất dữ liệu" (Xuất Excel / Xuất PDF) dropdown button in this app (CBRN scenario screen,
  chatbot domains screen — see §4).
- **File/folder naming**: kebab-case files, PascalCase components. Feature folders under
  `src/screens/<feature>/` each have `X.tsx`, `X.styles.ts`, `X.hook.ts`, `index.ts` barrel —
  **follow this exact pattern** for any new screen/section.
- **Style pattern**: when a component has a collapsed/expanded or otherwise prop-dependent
  layout, styles are a **function** `createXStyles(flag) => StyleSheet.create({...})`, static
  styles that never change go in a plain `export const xStyles = StyleSheet.create({...})`.
- **File export pattern** (RNFS): every feature that writes a file to Downloads
  (`RNFS.DownloadDirectoryPath || RNFS.DocumentDirectoryPath`) **must** include a unique suffix
  (`Date.now()`) in the file name. A fixed file name will eventually collide with a stale file
  from a previous export/app-session and throw `EACCES` on Android's scoped storage, even though
  `ls` still shows the file as group-writable — see §6 for the full root-cause writeup. This bit
  the CBRN scenario export feature for real; fixed there and replicated proactively into the
  chatbot-domains export when it was built afterward.

## 3. Backend contract notes (from pmbc_web + fw-service source, verified against real server)

- **Base URL**: `src/constants/env.ts` → `API_URL: 'http://103.124.94.201:8888'`. This is the
  **same host pmbc_web's production admin panel actually runs on** (confirmed by inspecting a
  real browser request's `Origin`/`Referer` headers during this session's export debugging — see
  §6). A second candidate host, `https://smta.lqdtu.edu.vn:666`, was tried mid-project and is
  commented out in `env.ts`; **do not re-enable it** without first confirming it has the same
  file-template/export configuration as `103.124.94.201:8888` — it was missing at least one
  Excel export template during this session (see §6), causing a real, reproducible 500 that had
  nothing to do with mobile's request shape.
- **Every business endpoint needs the `/gateway` prefix** (`/gateway/...`) — a missing prefix
  gives a `405` from nginx. Easy mistake, bit us once already (see §6).
- **POST endpoints reject a literal JSON `null` body** with a 400 (Spring can't parse the string
  `"null"`). Angular's `HttpClient.post(url, null)` silently omits the body; axios does not.
  **Always send `{}` instead of `null`** for POST calls with no real payload.
- Login: `POST /gateway/auth/login`, form-urlencoded, `Authorization: Basic <fixed base64>`
  matching the `AdminHumanResourceManager` OAuth2 client, body =
  `{ username, password: MD5(password), year_handling: '2024' (hardcoded), grant_type: 'password' }`.
- Logout: `POST /gateway/auth/logout`, JSON body `{ req: base64(accessToken) }` — **not** an
  Authorization header, matches `AuthService.logOut()` in web exactly. React Native/Hermes has
  **no global `btoa`**, so a minimal base64 encoder was added at `src/utils/base64.ts`
  (`base64Encode`). `useAuthStore.logout()` calls it best-effort (swallows errors) and **always**
  clears the local keychain/state afterward regardless of API result.
- User detail: `POST /gateway/user/detail` with `{}` body → response has a `detail` object
  containing `userId` (number), cached in `useAuthStore.userId`, populated on both `login()` and
  `bootstrap()`.
- `qlchuyennganhdacthu` (specialized industries list): `POST /gateway/qlchuyennganhdacthu/data`
  with `{}` body → plain array of `{ gid, ten, viet_tat, mo_ta, ... }`.
- **Chatbot** (`/gateway/chatbot/**`, all public — no Authorization header needed, matches web):
  - `POST /gateway/chatbot/send-chat-message` — **NDJSON streaming response** (newline-delimited
    JSON objects), not SSE. Body: `{ message, chat_session_id?, document_set_ids?: number[] }`.
    Implemented via **raw `XMLHttpRequest`**, diffing `xhr.responseText` on each
    `readyState === LOADING` tick (`src/api/chatbot/chatbot.api.ts` → `sendChatMessageStream`).
  - `POST /gateway/chatbot/stop/{sessionId}` — cancels an in-flight generation.
  - `GET /gateway/chatbot/document-sets/for-chat` — "knowledge sources" list. Web auto-selects
    **all** ids on load and sends them as `document_set_ids`; mobile mirrors just that part.
  - `GET /gateway/chatbot/conversations/search?userId=&key=&filter=recent|starred&page=&size=` —
    paginated conversation list, debounced 300ms.
  - `pinConversation`/`starConversation`/`deleteConversation`/`getMessagesPage` — all wired (see
    §4). `upsertConversation` (persists a conversation after a stream completes) is **not** called
    from mobile, so mobile-originated chats never appear in the left sidebar's own search results.
- **Meeting-room STT (speech-to-text) pipeline** — ported from web's "Tiến trình cuộc họp"
  mic-triggered transcription:
  - **Separate WebSocket** from the main `MeetingSocketService` — dedicated `SttSocketService`.
  - Message envelope is **JSON**, not raw text: `{"type":"partial"|"final","text":...}`. A
    literal placeholder string `<0x00>` is sent for "no speech detected" ticks and must be
    filtered out (`.replace(/<0x00>/g, '')`), it is **not** a real null byte.
  - **Critical, easy-to-miss contract detail**: the backend expects **normalized Float32 PCM
    samples**, not raw Int16 — confirmed from web source
    (`thamgiahop.component.ts:1535-1538`). Sending raw Int16 produces garbage/empty transcripts
    with no error. Conversion: `Int16Array` → `Float32Array` via `int16[i] / 32768.0` in
    `SttSocketService.sendPcmChunk` before sending.
  - Audio capture: `react-native-audio-record`, 16kHz mono PCM16. Base64 encode/decode of audio
    chunks must use `base64-js`'s `toByteArray`/`fromByteArray` — a hand-rolled decoder tried
    earlier corrupted the PCM stream (audible garbage, confirmed via device testing).
  - After the mic is turned off, the **last streamed partial/final text is kept as-is** — it is
    **not** re-sent through a batch `/ai/transcribe` re-transcription call, because that was
    found to drop/change words compared to what was already streamed live (explicit user-reported
    bug, fixed by persisting the live text in `ownLiveTextRef` instead of re-running transcription).
  - `MessageVoidChatApi.insert` response: the newly-inserted message's `gid` is under
    **`data?.obj`**, not `data?.objDetail` — reading the wrong field silently broke the follow-up
    "Tóm tắt ý kiến" summary step (the gid was always `undefined`, so the summary call was
    silently skipped). Found via the user reporting non-web-matching behavior in "Thông tin ứng
    phó hiện trường".
- **CBRN scenario export** (`Pmbc_KichbanungphoCBRNRsService.java`, mirrors
  `PmbcKichbanungphocbrnComponent`'s `printDL(type)` on web) — **this is the reference pattern for
  every export feature in this app**, repeated near-verbatim for other list screens (e.g. chatbot
  domains, see below):
  - `POST /gateway/pmbckichbanungphocbrn/exportExcel` — unfiltered export. Request:
    `{ pageIndex, pageSize, typeExport, ...same fields as /search }`. `typeExport`: `1` = Excel
    (`.xls`), `2` = PDF (server converts the generated `.xls` to PDF via `convertExcelToPdf()`
    **after** building the Excel file — so a PDF export failure that only affects the PDF step
    while Excel succeeds, or vice-versa, is a real possible failure mode worth distinguishing
    when debugging).
  - `POST /gateway/pmbckichbanungphocbrn/exportsearchExcel` — same shape, applies the active
    search/status filter (used once `ten_kich_ban_cbrn` and/or `trang_thai` is set).
  - **How the backend builds the file**: `getTemplateFileName(code)` looks up a
    `Topic_files_template` DB row by a hardcoded code string (e.g.
    `"DANHSACH_PMBCKICHBANUNGPHOCBRN"`); if found, its `vnmac_topic_files_template_url` is the
    template file name. If **not** found (no DB row), it falls back to a hardcoded default file
    name (e.g. `EXPORT_ALL_PMBC_KICHBANUNGPHOCBRN.xls`) that must physically exist under
    `FILE_DIRECTORY_TEMPLATE` (`BaseFunction.java`, a **Windows path**:
    `C:\XET_DUYET_CHUC_DANH\Export\` — confirms the backend server itself runs on Windows). The
    actual rendering is `net.sf.jxls.transformer.XLSTransformer.transformXLS(templatePath, beans,
    outputPath)` (the **jxls** library) with `beans = {"lst": listObjs}`. If the template file
    doesn't exist on disk, this throws and the endpoint returns a generic 500 with no useful
    client-facing detail (`{"message":"An error occurred, Please try again later or contact to
    admin for detail","code":"000","ok":false}`) — **this exact shape is the signature of a
    missing/misconfigured export template on the server, not a malformed request.** See §6 for
    how this was actually diagnosed and resolved this session.
  - Response: `{ blob: <base64-encoded file bytes> }`, written client-side via
    `RNFS.writeFile(path, res.blob, 'base64')`.
- **Chatbot domains export** (`pmbc_quanlylinhvucchatbotRsService.java`, feature:
  "Quản lý lĩnh vực Chatbot" / mobile's "Lĩnh vực Chatbot" screen) — **same exact pattern** as the
  CBRN export above (`exportExcel`/`exportsearchExcel`, `XLSTransformer`, `typeExport` 1/2,
  `getTemplateFileName("DANHSACH_PMBCQUANLYLINHVUCCHATBOT")`, same `blob` response shape). This is
  a **real, fully-implemented** backend feature — **not** a stub — but importantly **pmbc_web's
  own UI never wires a button to it** (`PmbcQuanlylinhvucchatbotService` has no `exportExcel`
  method at all, confirmed by reading the Angular service file directly). So for this one feature,
  there is no web reference behavior to copy for the *button*/UX — only the backend contract is
  real. Mobile's export button (`ChatbotDomainsScreen.tsx`) was built directly against the backend
  contract, following the CBRN scenario screen's dropdown UI pattern instead. **No docx/Word
  export variant exists for this feature** (unlike the CBRN simulation's "Phương án ứng phó",
  which does have a real `exportResponsePlanDocx()` on web) — only Excel and PDF (PDF is itself
  just a converted-from-Excel file, not independently rendered).
- **CBRN simulation — "Xuất phương án ứng phó" (.doc)**: web's `exportResponsePlanDocx()`
  (`mophongphattan.component.ts:3399-3696`) is the classic **"HTML saved with a `.doc` extension"**
  trick — plain HTML with MS Office XML namespaces
  (`xmlns:o='urn:schemas-microsoft-com:office:office'` etc.) that Word opens via its legacy HTML
  import filter. It is **not** true OOXML `.docx` and needs no server call or Word-generation
  library — the HTML is built entirely client-side from the already-available simulation result.
  Ported 1:1 into `simulation/responsePlanDoc.ts`.

## 4. Feature status — what's built and verified on-device

Verified on a physical Samsung Galaxy Tab S7 Lite, adb device id `R52R70A5V2D`, unless noted
otherwise.

### Login screen (`src/screens/auth/`)
Real login wired, MD5 password hashing, show/hide password toggle, `KeyboardAwareScrollView`
(from `react-native-keyboard-aware-scroll-view`, NOT `react-native-keyboard-controller`'s version
— see §6), blurred background image sized via `onLayout` (Yoga layout bug, see §6).

### Chatbot screen (`src/screens/chatbot/`) — 3-column ChatGPT-style layout
**Path note**: this screen was renamed/moved from `src/screens/home/` to `src/screens/chatbot/`
at some point during the project (`ChatbotScreen.tsx`, `chatbot/chat/`, `chatbot/leftSidebar/`,
`chatbot/rightSidebar/`, `chatbot/components/`) — if you see any reference to `src/screens/home/`
elsewhere (including in git history or old notes), treat it as this same screen under the old path.

Layout: `SafeAreaView > row(flexDirection:'row') > [LeftSidebar | middle column | RightSidebar]`.
Left/right sidebars are **self-contained** (own width/background/border).

**Middle column** — two states, swapped based on `listChat.length > 0`:
- **Empty state**: centered logo + greeting + composer, inside `KeyboardAwareScrollView` with a
  `minHeight`-measured inner wrapper (`centerWrapper`) — see §6.
- **Chat state**: `KeyboardAvoidingView` **from `react-native-keyboard-controller`** (NOT react
  native's own, NOT wrapped in any ScrollView) wrapping
  `[ChatMessageList (flex:1), stop-button-row, composerDocked]` — see §6 "composer pinned to
  bottom", **do not regress this back into a ScrollView-with-composer-as-last-child pattern.**
- `useChat()` hook owns: `listChat`, `message`, `sendMessage`, `stopGen`, `startNewConversation`,
  `loadConversation(conversationId)` (tail-loads last 20 messages via `getMessagesPage`, `MSG_PAGE_SIZE
  = 20`, matches web), internal `conversationIdRef`/`documentSetIdsRef`.
- `ChatMessageList`/`ChatMessageBubble` — plain `FlatList`, auto-scrolls on new content. Assistant
  messages render through `react-native-markdown-display`. **Explicitly NOT replicated**: web's
  citation-pill system (favicon+snippet popovers) — citation links render as plain markdown links.
- **Suggested questions panel** (`components/SuggestedQuestionsPanel.tsx`): composer lightbulb
  icon toggles a card with a **fixed, hardcoded** list of 5 questions (copied verbatim from web's
  `suggestedQuestions: string[]` — update here too if that array ever changes on web).

### Right sidebar — "NGÀNH ĐẶC THÙ" (`chatbot/rightSidebar/`)
Specialized-industries picker. Collapse/expand (52px/280px), search toggle (`SidebarSearchBox`),
"Đã chọn: X/Y" counter + bulk actions. Wired to `qlchuyennganhdacthu` via React Query, client-side
filter through `useDebounce(searchKeyword, 300)`. Selection is **not sent anywhere** on
send-message (no such field found in web's contract).

### Left sidebar — conversations (`chatbot/leftSidebar/`)
Collapse/expand (52px/260px). Expanded: header + "Cuộc trò chuyện mới" + two collapsible sections
("ĐÁNH DẤU SAO", default collapsed; "GẦN ĐÂY", default expanded), each backed by
`searchConversations`, debounced 300ms. Each row shows a relative date
(`formatRelativeTime.ts`, ported from web) in **both** sections (web only shows it for `recent` —
diverges from web on purpose, per explicit user request). Each row has a `MoreVertical` kebab
opening an `AppPopover` (Ghim/Bỏ ghim, Đánh dấu sao/Bỏ, Xoá — destructive, confirms first), wired
to real pin/star/delete endpoints. Tapping a row loads it via `loadConversation`.

**Logout button**: bottom of both sidebar states, `Alert.alert` confirm before calling
`useAuthStore.logout()` (real `/gateway/auth/logout`). Explicitly called "tạm thời" (temporary)
placement by the user — no dedicated confirm-dialog design — revisit if a reference design shows up.

### CBRN dispersion simulation (`src/screens/cbrn-simulation/`)
Clones pmbc_web's `mophongphattan` feature. Tablet UI deliberately diverges from web's
4-panels-on-one-screen layout: a **collapsible left form sidebar** (4 numbered form cards:
chemical → atmosphere → source location → scenario) + a result view on the right with 2 tabs
("VÙNG ĐE DỌA" / "BẢN ĐỒ 2D").

- `simulation/physics.ts` — **verbatim port** of web's dispersion physics (Brighton puddle
  evaporation, Bernoulli/LEAKR/HNE/DIERS tank release, Wilson pipeline blowdown via
  Newton-Raphson, Gaussian plume via Briggs sigma, DEGADIS-style heavy-gas dispersion). Do not
  "simplify" this file — diff against web source if something looks wrong.
- `simulation/runSimulation.ts` — orchestrates the above per scenario, mirrors web's
  `runPipeline()` + `finishSimulation()`.
- `simulation/chemData.ts` (`CHEM_DB`, 421 chemicals) + `simulation/aeglColors.ts` (`AEGL_COLORS`)
  — ported chemical database and AEGL-1/2/3 threat-level color scheme. `SimulationResult.levels:
  ThreatLevel[]` supports multi-level AEGL zones (not just a single threat radius).
- Chemical search: `src/api/chemical/` (`ChemicalApi.search`), debounced.
- **Map** (`resultView/buildMapHtml.ts` + `Map2DView.tsx`): Leaflet 1.9.4 + Esri/OSM tiles inside
  `react-native-webview`. RN drives the WebView's interactive state via `injectJavaScript` calls
  into a `window.cbrnMap.*` bridge object; the WebView posts results back via
  `window.ReactNativeWebView.postMessage`/`onMessage`.
  - **Always renders Hoàng Sa/Trường Sa Vietnamese island sovereignty labels**
    (`VN_ISLAND_POINTS`/`addVietnamIslandLabel()`, ported verbatim from web's
    `addVietnamIslandLabels()`) on every map load, unconditionally — **never drop this**, it's a
    sovereignty-representation requirement, not decoration (was mistakenly dropped once as
    "decorative", had to be restored after explicit correction).
  - **Domain selection** (draw-a-rectangle-to-define-the-simulation-domain): uses
    `L.DomEvent.on` (not raw `addEventListener`) on the map container for
    mousedown/mousemove/mouseup/touchstart/touchmove/touchend, and
    `map.mouseEventToContainerPoint()` (Leaflet's own coordinate conversion, not manual
    `getBoundingClientRect()` math) — both needed to avoid conflicting with Leaflet's internal
    touch/click-suppression state (see §6 for the bug this caused).
  - **Station markers** (response-plan overlay pins): need `iconSize: [120, 22]` (not `[0,0]`)
    plus `.response-pin-marker { overflow: visible !important; }` — see §6.
  - **Map image export** (`exportImage` bridge function + `Map2DView.tsx`'s `onExportImage`):
    capture happens **inside** the WebView via `html2canvas` (CDN script tag,
    `html2canvas@1.4.1`), `useCORS: true` + `crossOrigin: true` on every `L.tileLayer` (avoids
    canvas tainting), result posted back as a PNG data URL and written via `RNFS.writeFile` to
    Downloads. **Do not** try to capture this with `react-native-view-shot`/`captureRef` — it
    cannot see into a WebView's separate native rendering surface and will always produce an
    image with the map tiles/polygons missing (this was a real bug, fixed this session — see §6).
  - **"Xuất PA ứng phó" (.doc export)**: `simulation/responsePlanDoc.ts` —
    `generateResponsePlanBody(result)` (ported verbatim from web's `generateResponsePlanHtml()`),
    `buildResponsePlanDocHtml(result)` (wraps it in the Word-flavored HTML document),
    `buildResponsePlanFileName(result)`. Two entry points, both wired in `Map2DView.tsx`: the
    toolbar's "Xuất PA ứng phó" button (`Map2DToolbar.tsx`) and the response-plan detail modal's
    "Xuất Word (.doc)" footer button (`Map2DResponseModal.tsx`). Written via
    `RNFS.writeFile(path, '\ufeff' + docHtml, 'utf8')` (direct text write, not base64 — the
    content is plain HTML, not a binary blob).
- Threat-zone plume (non-map view): SVG rendering via `react-native-svg` in
  `resultView/ThreatZoneView.tsx`.
- `formSidebar/` — 4 `FormCard`s + `FormSidebar.tsx` (collapsible, 340px/52px). Uses
  `KeyboardAwareScrollView` (`extraScrollHeight={100} extraHeight={70}`).
- **"Kết quả mô phỏng" drawer menu item is hidden** (removed from `MainDrawerContent.tsx`'s
  `MENU_ITEMS` array, per explicit user request) — the screen/route itself still exists and is
  still reachable from within the simulation flow, it's just not listed in the drawer anymore.

### CBRN scenario screen (`src/screens/cbrn-scenario/`)
Read-only, mobile-simplified port of pmbc_web's `PmbcKichbanungphocbrnComponent`
(`quanlykho/pmbc-kichbanungphocbrn`) — same flat-list UI pattern as the chatbot-domains screen,
drops create/edit/delete, **except** the "đính kèm" (attach) linking dialog, which **is** kept
(see below — this was initially scoped out incorrectly, then corrected after the user clarified
with a desktop screenshot of web's actual dialog).

- **Search** (`ten_kich_ban_cbrn`) + trạng thái filter pills, debounced 300ms, matching web's
  quick-search row.
- **"Đính kèm" / attach dialog** (`CbrnScenarioAttachModal.tsx`): matches web's real
  "attach-thhl" dialog — links Tình huống huấn luyện (training situations) to a kịch bản (scenario)
  via a checkbox list, **not** just an edit-only side effect. Backed by
  `src/api/tinhhuonghuanluyen/` (`TinhHuongHuanLuyenApi`) and
  `types/tinhhuonghuanluyen.types.ts`.
- **"Xuất dữ liệu" export** (`useCbrnScenario.hook.ts`): dropdown via `AppPopover` → "Xuất Excel"
  / "Xuất PDF", matching web's `printDL(type)` menu. Switches between the unfiltered `exportExcel`
  and filtered `exportSearchExcel` endpoints based on whether a search/status filter is active.
  File name: `LIST_KICHBANUNGPHOCBRN_EXPORT_<Date.now()>.xls`/`.pdf` — **must** keep the
  timestamp suffix, see §6 for why a fixed name broke this in practice.

### Chatbot domains screen (`src/screens/chatbot-domains/`)
Read-only, mobile-simplified port of pmbc_web's `PmbcQuanlylinhvucchatbotComponent`
(`quanlykho/pmbc-quanlylinhvucchatbot`) — flat list (rows separated by a bottom border, not
individual cards), drops create/edit/delete, tapping a row opens a read-only detail modal
(`DomainFieldDetailModal.tsx`).

- **"Xuất dữ liệu" export** (`useChatbotDomains.hook.ts`): same `AppPopover` dropdown pattern as
  the CBRN scenario screen — "Xuất Excel"/"Xuất PDF" → `PmbcQuanLyLinhVucChatbotApi.exportExcel`
  (`/gateway/pmbcquanlylinhvucchatbot/exportExcel`). This screen has **no search/filter UI**, so
  unlike the CBRN scenario screen there's no filtered/unfiltered split — always calls the plain
  `exportExcel`. Added **after** pmbc_web itself (confirmed: web's own
  `PmbcQuanlylinhvucchatbotService` has no export method at all) — see §3 for the full analysis
  of why there's a real backend contract here with no web reference UI to copy. File name:
  `LIST_LINHVUCCHATBOT_EXPORT_<Date.now()>.xls`/`.pdf` (timestamp suffix applied proactively,
  learned from the CBRN scenario export bug — see §6).

### Meeting room — "Tiến trình cuộc họp" STT panel (`src/screens/meeting-room/` or wherever the
meeting room screen lives — `MeetingRoomSttPanel.tsx`)
Mic-triggered speech-to-text ported from web, feeding the "Ý kiến đầy đủ"/"Tóm tắt ý kiến" tabs.
See §3 for the full WebSocket/audio-format contract (this is where the Int16-vs-Float32 bug and
the base64 PCM corruption bug were found and fixed). After the mic is turned off, the already-
streamed live text is kept as-is (not re-transcribed) — see §3.

### Meeting plan info modal — outside/"họp không giấy" tabs (`MeetingPlanInfoModal.tsx`)
- Search box added directly below the tab row (searches within the active tab's list).
- `KeyboardAvoidingView` added so the view lifts when the keyboard opens.
- "Sơ đồ chỗ ngồi" (seating chart) tab: shows a placeholder image, deliberately set up to be
  **easy to swap** (single constant/import, not hardcoded inline), and the image supports **free
  two-finger pinch-to-zoom** (`ZoomableImage` component, `src/components/ZoomableImage/`) — this
  went through several rounds of fixing (zoom not registering at all, then zoom working but
  **auto-closing the modal mid-pinch** — see §6 for the full root cause and fix).

### Shared components (`src/components/`)
- `SidebarSearchBox` (`chatbot/components/` originally, extracted so both chatbot sidebars share
  identical search UI).
- `ZoomableImage` — two-finger pinch-to-zoom + pan, via `react-native-gesture-handler`
  `Gesture.Pinch()`/`Gesture.Pan()` composed with `Gesture.Simultaneous()`. **Must** be the one
  and only `GestureHandlerRootView` inside whatever `<Modal>` it's rendered in — see §2/§6.
- `AppSelect` — generic search/select dropdown. Had a real bug this session: `keyboardDidHide`
  closed the dropdown without blurring the underlying `TextInput`, so retyping after the keyboard
  closed once never re-opened it (no `onFocus` fired again) — fixed by force-reopening
  (`setIsOpen(true)`) on every `onChangeText`, not just `onFocus`.
- `AppPopover` — see §2.

## 5. Auth store (`src/stores/authStore.ts`)

State: `token, refreshToken, user (UserDetail|null), userId (number|null), isLoading,
isBootstrapping, error`. `login()` and `bootstrap()` both call `UserApi.getDetail()` afterward to
populate `userId` — **anything needing the current user's id should read
`useAuthStore(s => s.userId)` and treat `null` as "not loaded yet / not authed"**, don't assume
it's always present synchronously on mount.

## 6. Gotchas already hit and fixed — don't reintroduce these

1. **Expo vs bare CLI**: project was accidentally built on Expo first, fully rebuilt as bare CLI
   per explicit user correction. Never suggest Expo-specific packages (`expo-*`).
2. **Yoga layout — percentage sizing**: percentage `width`/`height` on an absolutely-positioned
   child inside an auto-height flex:stretch parent corrupts the parent's sizing. Fix: measure via
   `onLayout` and pass pixel dimensions inline instead of percentage strings.
3. **`flex:1` inside a `flexWrap:'wrap'` row** causes premature wrapping of sibling text — give
   wrap-row children dedicated non-flex styles.
4. **ScrollView centering vs scrolling**: never set `justifyContent:'center'` directly on a
   ScrollView's `contentContainerStyle` if content can overflow — it breaks scroll-to-bottom.
   Correct pattern: inner wrapper gets `minHeight` = `onLayout`-measured viewport height, and
   *that* wrapper gets `justifyContent:'center'`.
5. **Composer pinned to bottom of chat, not end of scrollable list**: the chat-state composer
   must NEVER be a child of any ScrollView/KeyboardAwareScrollView — it must sit as a plain flex
   sibling after a `flex:1` FlatList, inside `KeyboardAvoidingView` **imported from
   `react-native-keyboard-controller`**, `behavior="padding"`, same on both platforms. Core RN's
   own `KeyboardAvoidingView` relies on Android's `windowSoftInputMode="adjustResize"` actually
   resizing the window, which doesn't reliably propagate on this RN 0.87 edge-to-edge app.
6. **`react-native-keyboard-aware-scroll-view` vs `react-native-keyboard-controller`**: both
   installed, used for *different* purposes — don't consolidate:
   - `KeyboardAwareScrollView` (older separate package) — actual scrollable forms (Login screen,
     chat empty-state composer, CBRN simulation form sidebar).
   - `KeyboardAvoidingView`/`KeyboardProvider` (from `react-native-keyboard-controller`) — fixed-
     bottom chat composer (point 5) and the meeting plan info modal's search box.
7. **SSL/TLS on port 8888**: backend had a genuine self-signed-cert-for-wrong-IP bug, diagnosed
   via `openssl s_client -connect <ip>:8888`, **fixed server-side** by switching back to plain
   HTTP. If logins start failing again with `ERR_NETWORK`/generic "wrong password" messages,
   suspect the backend cert again before assuming a client bug.
8. **Missing `/gateway` prefix** and **sending `null` instead of `{}`** in a POST body — two real
   bugs hit while wiring `qlchuyennganhdacthu`. Apply defensively to every new endpoint.
9. **Fast Refresh can show stale component state** after a hot-reload edits a `useState` default
   — force a full app restart (`adb shell am force-stop com.pmbc_mobile_v2 && adb shell am start
   -n com.pmbc_mobile_v2/.MainActivity`) before concluding there's a real bug.
10. **adb screenshot tap coordinates**: `adb exec-out screencap -p` captures at the device's real
    resolution (2560×1600); the image shown in this environment is auto-scaled (~1.28× down,
    shown ~2000px wide) **for display only** — `adb shell input tap X Y` needs raw device pixels.
    Safest: open the saved screenshot with `PIL.Image.open(...).getpixel(...)` directly instead
    of eyeballing the scaled image and doing the math by hand.
11. **STT: JSON envelope not parsed** — the socket sends `{"type":"partial"/"final","text":...}`,
    not raw text; must `JSON.parse` and extract `.text`. The literal string `<0x00>` is a
    "no speech" placeholder, not a real null byte — filter it out.
12. **STT: hand-rolled base64 decoder corrupted PCM audio** — replaced with `base64-js`'s
    `toByteArray`/`fromByteArray`.
13. **STT: Int16 PCM sent instead of required Float32** — the single most critical STT bug (see
    §3). Always convert `Int16Array` → `Float32Array` (`sample / 32768.0`) before sending to the
    STT socket.
14. **STT: batch re-transcribe on mic-off dropped/changed words** — fixed by persisting the
    already-streamed live text instead of re-running a batch `/ai/transcribe` call on mic-off.
15. **`MessageVoidChatApi.insert` response field** — the inserted message's `gid` is under
    `data?.obj`, **not** `data?.objDetail`. Reading the wrong field silently breaks any flow that
    depends on that `gid` (e.g. the Tóm tắt ứng phó summary step) with no visible error.
16. **Modal content collapsing to zero height**: a `ScrollView`/content with `flex:1` inside a
    parent that only has `maxHeight` (not a definite `height`) can collapse to zero height when
    content is shorter than the cap — a known RN Yoga quirk. Fix: use an explicit
    `Dimensions.get('window').height * N` pixel `maxHeight` instead of `flex:1`. Hit in
    `Map2DImpactModal`, `Map2DResponseModal`, `MeetingRoomInfoModal`.
17. **Modal scroll requiring multiple swipes**: nesting `TouchableOpacity` (card, to absorb taps)
    inside `TouchableOpacity` (backdrop, to dismiss) makes gesture recognizers compete with the
    inner ScrollView's pan gesture. Fix: change the card wrapper from `TouchableOpacity` to `View`
    with `onStartShouldSetResponder={() => true}`. Applied across 8 modals this session.
18. **Pinch-to-zoom auto-closing the modal** (CRITICAL — cost significant debugging time):
    nesting a **second** `GestureHandlerRootView` (scoped to just `ZoomableImage`) inside a Modal
    that already has an outer legacy-touch-system backdrop
    (`TouchableOpacity`/`onStartShouldSetResponder`) causes the second pinch finger's touch event
    to be captured by the legacy backdrop's dismiss handler instead of the gesture-handler root,
    closing the modal mid-pinch. Fix: remove the nested root from `ZoomableImage.tsx` and have
    exactly **one** `GestureHandlerRootView` wrapping the **entire** Modal's content (see §2
    rule). This is the single most important gesture-handler rule in this codebase going forward
    — re-check it first if *any* future pinch/multi-touch gesture inside a Modal misbehaves.
19. **Domain-selection rectangle (CBRN map) silently not completing**: `setSelectionMode(false)`
    was called in `finishDrawing` *before* reading `drawStart.x`/`drawStart.y` on the next lines
    — but `setSelectionMode(false)` nulls `drawStart` as a side effect, so the read threw a
    silent `TypeError` inside the WebView (no visible crash, dialog just never appeared). Fix:
    capture `x1 = drawStart.x, y1 = drawStart.y` into local consts **before** calling
    `setSelectionMode(false)`. Found via temporary `postToRN({type:'debug',...})` instrumentation
    + logcat, removed after.
20. **Leaflet marker labels invisible (CBRN map station pins)**: `iconSize: [0, 0]` relies on
    `overflow: visible` cascading through Leaflet's internal marker wrapper, which the WebView
    engine didn't honor reliably. Fix: explicit `iconSize: [120, 22]` +
    `.response-pin-marker { overflow: visible !important; }`.
21. **Map image export missing drawn polygons/overlays**: `react-native-view-shot`/`captureRef`
    cannot capture a WebView's separate native rendering surface at all — any attempt produces an
    image with just a blank/background rect where the map should be. Fix: capture **inside** the
    WebView via `html2canvas` (see §2/§4), with `crossOrigin: true` on every tile layer to avoid
    canvas tainting from cross-origin tile images.
22. **CBRN scenario export 500 — real root cause, two layers deep** (this session's longest debug
    chain, see also §3's export contract notes):
    - **Layer 1 — wrong/incomplete backend host**: the app's `API_URL` was briefly pointed at
      `https://smta.lqdtu.edu.vn:666`, which turned out to be **missing the Excel export
      template** for this feature (confirmed by reproducing the exact same 500 via a direct curl
      call to that host with a valid token, independent of request body contents — i.e. not a
      mobile-side bug). The *actual* production web admin panel runs on `http://103.124.94.201:8888`
      (confirmed from a real browser request's `Origin`/`Referer` headers), where the same
      request succeeds with a 200 and a real file. **Resolution**: `API_URL` was switched back to
      `103.124.94.201:8888`.
    - **Layer 2 — Android scoped-storage `EACCES` on a stale file name**: after fixing the host,
      Excel export *still* failed while PDF export succeeded. Root cause (confirmed via a
      temporary `console.log(err.message)` in the hook's `.catch()`): `ENOENT: open failed:
      EACCES (Permission denied)` writing to the exact same file path
      (`LIST_KICHBANUNGPHOCBRN_EXPORT.xls`) that a **previous, stale** export had already created
      days earlier under a different app install/session. Android's scoped storage ties write
      permission on a file in a shared public directory (Downloads) to whichever app-session
      originally created it — `ls -la` on the device still showed it as `-rw-rw----` (group-
      writable), but the current app process could not actually overwrite it. Deleting the stale
      file via `adb shell rm` confirmed the fix immediately. **Permanent fix**: every export
      file name in this app now includes a `Date.now()` suffix so this class of bug can't recur
      (see §2's "File export pattern" rule) — applied to the CBRN scenario export and proactively
      copied into the chatbot-domains export built afterward.
    - **Diagnostic technique worth reusing**: when an export/API call fails with a generic 500
      and the request body looks correct, capture the real JWT from a temporary
      `console.log('[API TOKEN]', token)` in `axiosInstance.ts`'s request interceptor (read back
      via `adb logcat`), then reproduce the exact failing call with `curl` directly against the
      server — this isolates "is this a server-side bug" from "is this a mobile request-shape
      bug" far faster than guessing from the client side alone. **Always remove the temporary
      token-logging line afterward** (it was removed both times this session).

## 7. Reverted work — do not resurrect without explicit request

- A native Kotlin `OkHttpClientFactory`/`OkHttpClientProvider` SSL-bypass workaround
  (`NetworkSecurityInit.kt` in debug/release source sets, `MainApplication.kt` edits) was
  implemented then **fully reverted** once the real fix (backend cert correction) was in place.
  `MainApplication.kt` should only contain `loadReactNative(this)` in `onCreate()`.
- `KeyboardStickyView` (react-native-keyboard-controller) was tried for the chat composer and
  explicitly abandoned in favor of the `KeyboardAwareScrollView`/`KeyboardAvoidingView` split
  (§6, point 6).
- `https://smta.lqdtu.edu.vn:666` as `API_URL` — tried, found missing export template
  configuration for at least the CBRN scenario feature, reverted back to `103.124.94.201:8888`
  (§6, point 22). Don't re-enable without first verifying export/template parity on that host.

## 8. Dev workflow / device testing cheatsheet

- Metro must be running (`packager-status:running` via `curl -s http://localhost:8081/status`).
- Hot reload: `curl -s -X POST http://localhost:8081/reload` — **but if state looks wrong after
  this, force a full restart** (see §6, point 9):
  ```
  adb shell am force-stop com.pmbc_mobile_v2
  adb shell am start -n com.pmbc_mobile_v2/.MainActivity
  ```
- Screenshot: `adb exec-out screencap -p > /tmp/x.png`, then read with the Read tool, or
  cross-check exact tap coordinates with Python/PIL `getpixel` (see §6, point 10).
- Logcat (JS console output only):
  ```
  adb logcat -c   # clear first for a clean capture window
  adb logcat -s "ReactNativeJS"
  ```
  or filter for a specific tag added temporarily (e.g. `grep "API ERROR" -A 30` to capture the
  full multi-line error body that follows the one-line `[API ERROR]` log).
- Typecheck before considering any change done: `npx tsc --noEmit` (must be silent/empty).
- Lint the touched files: `npx eslint <paths>` (must be silent/empty).
- Rebuild + reinstall after a **native**-affecting change (new native deps, Android
  manifest/gradle changes) — plain JS/TS edits fast-refresh automatically and don't need this:
  ```
  npx react-native run-android --mode=debug
  ```
- Device: Samsung Galaxy Tab S7 Lite, adb id `R52R70A5V2D`, real resolution 2560×1600.
- Reference design assets get dropped on `~/Desktop/` by the user (screenshots, logos) — always
  check `ls -la ~/Desktop/*.png ~/Desktop/*.jpg` sorted by time when a task mentions a reference
  image "để ngoài desktop".
- **Reproducing a server-side error directly**: capture a real JWT via a temporary
  `console.log('[API TOKEN]', token)` in `axiosInstance.ts`'s request interceptor (trigger the
  relevant in-app action once, read the token back from logcat, then remove the log line), then
  `curl` the suspect endpoint directly — see §6, point 22 for why this is worth doing before
  assuming a mobile-side bug.

## 9. Pending / not-yet-requested next steps

(Not committed to — just what's visibly incomplete, for the next session's awareness.)

- Left sidebar's star/pin/delete/tap-to-load are wired and typecheck clean but — at least as of
  when they were built — **hadn't yet been walked through on-device** step by step (kebab menu
  open/close, pin/star/delete round-trip, tap-to-load). Worth a quick on-device sanity pass if
  touching that area again.
- No conversation persistence from mobile — `upsertConversation` is never called after a stream
  finishes, so mobile-originated chats never appear in the left sidebar's own search results.
- Right sidebar's "Ngành đặc thù" selection isn't sent in the send-message payload (no field for
  it was found in web's contract — may be for a different, not-yet-ported feature).
- "Admin" greeting name on the chatbot screen is still hardcoded (no user-profile API wired for
  display name yet, even though `UserApi.getDetail()` exists and could supply `fullname`).
- Logout has no dedicated confirm-dialog design (native `Alert.alert` placeholder, explicitly
  called "tạm thời"/temporary by the user) — revisit styling if a reference shows up.
- CBRN scenario export's 500 error is now understood **and genuinely fixed** (host switched back
  + unique file names) — if it ever resurfaces, re-check §6 point 22 in order (host/template
  first, then stale-filename `EACCES` second) rather than re-diagnosing from scratch.
- Map image export (html2canvas-based) was implemented and typechecked but had **not yet been
  explicitly re-confirmed working on-device by the user** as of this writing — worth a quick
  on-device check (export, open the PNG, confirm the drawn polygons/markers are actually in it)
  next time this area is touched.
- "Xuất PA ứng phó" (.doc) export (CBRN simulation) was implemented, typechecked, and built/
  installed, but **not yet explicitly confirmed opening correctly in Word on-device** by the user.
- Chatbot domains export (Excel/PDF) was implemented and typechecked; same "not yet explicitly
  re-confirmed on-device" caveat applies.
- `npm install react-native-markdown-display` was run once while the shell's active Node was the
  system default `20.19.4` (not the pinned `22.21.0`) — install itself succeeded (only
  `EBADENGINE` warnings, non-fatal), but if Metro/build weirdness ever shows up around this
  package specifically, try reinstalling under the correct Node version first.
