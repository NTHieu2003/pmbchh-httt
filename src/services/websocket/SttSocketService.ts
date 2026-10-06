import { toByteArray } from 'base64-js';

import { GuidePropertyApi } from '@/api/guideproperty';

// Separate from the main meeting socket on purpose — matches both
// pmbc_web's `socketHandleMic`/`URL_SOCKET_STT` and pmbc_mobile's
// `socketSTT`: a short-lived connection opened only while this device's own
// mic is on, carrying raw binary PCM in and a JSON partial/final transcript
// envelope out (`{"type":"partial"|"final","text":"...", ...}` — parsed by
// the caller in useMeetingRoom.hook.ts's `startOwnRecording`; no
// connectReq handshake here, the STT backend is a plain streaming endpoint
// unlike the meeting gateway).
let cachedSttUrl: string | null = null;

const fetchSttUrl = async (): Promise<string> => {
  if (cachedSttUrl) return cachedSttUrl;
  const prop = await GuidePropertyApi.getOneByCode('URL_SOCKET_STT');
  const url = prop?.description?.trim();
  if (!url) throw new Error('URL_SOCKET_STT chưa được cấu hình (guideproperty)');
  cachedSttUrl = url;
  return url;
};

export type SttMessageListener = (text: string) => void;

class SttSocketService {
  private socket: WebSocket | null = null;

  async connect(onMessage: SttMessageListener): Promise<boolean> {
    try {
      const url = await fetchSttUrl();
      const socket = new WebSocket(url);

      return await new Promise((resolve) => {
        socket.onopen = () => {
          this.socket = socket;
          resolve(true);
        };
        socket.onerror = () => {
          socket.close();
          this.socket = null;
          resolve(false);
        };
        socket.onclose = () => {
          this.socket = null;
          resolve(false);
        };
        socket.onmessage = (event) => {
          if (typeof event.data === 'string') onMessage(event.data);
        };
      });
    } catch {
      return false;
    }
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }

  // `base64Chunk` is one `AudioRecord.on('data', ...)` frame — raw 16kHz
  // mono PCM16, base64-encoded by the native module. The STT backend
  // expects normalized Float32 samples, not raw Int16 bytes — confirmed
  // from pmbc_web's own `sendBlobToAPI` (thamgiahop.component.ts:1535-1538),
  // which does this exact `int16Array[i] / 32768.0` conversion before
  // sending. Sending raw Int16 bytes (what pmbc_mobile's older `socketSTT`
  // did) makes the server read it as noise and report "no speech" forever,
  // regardless of how correctly the bytes themselves were decoded.
  sendPcmChunk(base64Chunk: string) {
    if (!this.isConnected()) return;

    const bytes = toByteArray(base64Chunk);
    const sampleCount = Math.floor(bytes.byteLength / 2);
    const int16 = new Int16Array(bytes.buffer, bytes.byteOffset, sampleCount);
    const float32 = new Float32Array(sampleCount);
    for (let i = 0; i < sampleCount; i += 1) {
      float32[i] = int16[i] / 32768.0;
    }

    this.socket?.send(float32.buffer);
  }

  close() {
    this.socket?.close();
    this.socket = null;
  }
}

export default SttSocketService;
