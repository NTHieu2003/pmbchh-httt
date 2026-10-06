import { ApiClient } from '../axiosInstance';
import { AI_ENDPOINTS } from './ai.endpoints';

// Matches pmbc_web's AiService — the batch/high-quality pass run once a
// mic turns off (see useMeetingRoom.hook.ts's post-recording flow), as
// opposed to the live partial/final text streamed during recording by the
// separate STT websocket (SttSocketService).
export const AiApi = {
  // `fileUri` is a local `file://` path (from AudioRecordingService.stop()).
  transcribeAudio: async (fileUri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', {
      uri: fileUri.startsWith('file://') ? fileUri : `file://${fileUri}`,
      type: 'audio/wav',
      name: 'recording.wav',
    } as unknown as Blob);

    const response = await ApiClient.post(AI_ENDPOINTS.TRANSCRIBE, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const data = response as unknown as { text?: string; data?: { text?: string } };
    return data?.text ?? data?.data?.text ?? '';
  },

  summarizeText: async (inputText: string, outputLength?: string): Promise<string> => {
    const response = await ApiClient.post(AI_ENDPOINTS.SUMMARIZE, {
      input_text: inputText,
      output_length: outputLength,
    });
    const data = response as unknown as { summary?: string };
    return data?.summary ?? '';
  },

  normalizeText: async (text: string): Promise<string> => {
    const response = await ApiClient.post(AI_ENDPOINTS.NORMALIZE, { text });
    const data = response as unknown as { text?: string };
    return data?.text ?? text;
  },
};
