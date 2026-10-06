import { GuidePropertyApi } from '@/api/guideproperty';
import { useAuthStore } from '@/stores';
import { base64Encode } from '@/utils';

// The realtime meeting socket's address isn't derivable from `env.API_URL`
// — pmbc_web's own login flow fetches it at runtime from the
// "guideproperty" config table (code `URL_SOCKET_WEB`) instead of
// hardcoding it, and mobile mirrors that here. Deriving it from the API
// host's origin (the previous approach here) silently hit the wrong
// service, which accepts the WS upgrade but then kills the connection
// (close code 1011) the moment it receives our `connectReq` frame — looks
// "connected" for a few ms, never delivers anything.
let cachedSocketUrl: string | null = null;

const fetchSocketUrl = async (): Promise<string> => {
  if (cachedSocketUrl) return cachedSocketUrl;
  const prop = await GuidePropertyApi.getOneByCode('URL_SOCKET_WEB');
  const url = prop?.description?.trim();
  if (!url) throw new Error('URL_SOCKET_WEB chưa được cấu hình (guideproperty)');
  cachedSocketUrl = url;
  return url;
};

type SocketChangeListener = (socket: WebSocket | null) => void;

// Singleton — mirrors pmbc_mobile's WebSocketService: one shared connection
// for the whole app, a 10s ping to keep it alive, and a raw `connectReq`
// handshake carrying the base64-encoded bearer token (not a header — the
// upstream gateway's websocket upgrade doesn't forward Authorization).
class MeetingSocketService {
  private socket: WebSocket | null = null;
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private onChangeListener: SocketChangeListener | null = null;
  // Dedupes concurrent `connect()` callers (the Provider's own mount
  // effect + the Provider's `sendMessage` reconnect-on-demand fallback can
  // both fire within the same tick) — without this, two WebSockets open
  // for the same token almost back-to-back, and the server kills one with
  // an abrupt close (observed as code 1003/1011) instead of just the
  // intended single connection.
  private connectingPromise: Promise<void> | null = null;

  setOnSocketChange(listener: SocketChangeListener) {
    this.onChangeListener = listener;
  }

  connect(): Promise<void> {
    if (this.isConnected()) return Promise.resolve();
    if (this.connectingPromise) return this.connectingPromise;

    this.connectingPromise = this.openSocket().finally(() => {
      this.connectingPromise = null;
    });
    return this.connectingPromise;
  }

  private async openSocket(): Promise<void> {
    const url = await fetchSocketUrl();
    const { token, refreshToken } = useAuthStore.getState();
    if (!token) {
      throw new Error('No auth token');
    }

    return new Promise((resolve) => {
      // pmbc_web's browser session sends `Cookie: token=...;
      // refresh-token=...` on the WS upgrade request automatically (it's
      // the same cookie the REST API login sets) — the server appears to
      // require it before it'll accept a `connectReq` frame at all,
      // otherwise it closes with code 1003 right after receiving it. RN's
      // WebSocket has no cookie jar, so this has to be sent explicitly via
      // the (RN-only) `headers` option.
      const cookie = refreshToken ? `token=${token}; refresh-token=${refreshToken}` : `token=${token}`;
      const socket = new WebSocket(url, undefined, { headers: { Cookie: cookie } });
      this.socket = socket;

      socket.onopen = () => {
        const encodedToken = base64Encode(token);
        socket.send(JSON.stringify({ type: 'connectReq', content: encodedToken }));

        this.pingInterval = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping' }));
          }
        }, 10000);

        this.onChangeListener?.(socket);
        resolve();
      };

      // Guard against a stale socket's onclose/onerror firing after a
      // newer `connect()` has already replaced `this.socket` — without
      // this, the old handler would report the wrong (newer) socket's
      // state, or null out a connection that's actually still live.
      const handleTerminated = () => {
        this.clearPing();
        if (this.socket === socket) {
          this.socket = null;
          this.onChangeListener?.(null);
        }
      };

      socket.onclose = handleTerminated;
      socket.onerror = handleTerminated;
    });
  }

  private clearPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // Matches pmbc_mobile/pmbc_web's sendMessage — every frame (not just the
  // connectReq handshake) goes over the wire JSON-encoded, including plain
  // strings like `groupID14_8` (becomes `"groupID14_8"`); the server
  // expects to `JSON.parse` everything it receives.
  send(message: string) {
    if (this.isConnected()) {
      this.socket?.send(JSON.stringify(message));
    }
  }

  close() {
    this.clearPing();
    this.socket?.close();
    this.socket = null;
  }
}

export default new MeetingSocketService();
