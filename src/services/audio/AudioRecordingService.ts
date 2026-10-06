import { PermissionsAndroid, Platform } from 'react-native';
import AudioRecord from 'react-native-audio-record';

// Matches pmbc_mobile's `initAudioRecord`/`AudioRecord.start()` — 16kHz
// mono PCM16, the format the STT backend expects raw over the websocket
// (see SttSocketService). `AudioRecord.on('data', ...)` streams base64 PCM
// chunks as they're captured (not a timer/interval — driven by the native
// module itself).
let isInitialized = false;

const initIfNeeded = () => {
  if (isInitialized) return;
  AudioRecord.init({
    sampleRate: 16000,
    channels: 1,
    bitsPerSample: 16,
    audioSource: 6, // VOICE_RECOGNITION on Android; ignored on iOS.
    wavFile: 'meeting_stt.wav',
  });
  isInitialized = true;
};

export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true; // iOS prompts via Info.plist on first use.
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
  return result === PermissionsAndroid.RESULTS.GRANTED;
};

export const AudioRecordingService = {
  // `onChunk` receives each base64 PCM frame as it's captured — forward it
  // straight to `SttSocketService.sendPcmChunk` for live partial/final STT.
  start: (onChunk: (base64Chunk: string) => void) => {
    initIfNeeded();
    AudioRecord.start();
    AudioRecord.on('data', onChunk);
  },

  // Resolves with the local `file://`-less path of the recorded WAV file
  // (same shape pmbc_mobile passed straight into `FileSystem.readAsStringAsync`
  // and the multipart batch-transcribe request) — used for the post-mic-off
  // "Ý kiến đầy đủ" re-transcription pass.
  stop: async (): Promise<string | null> => {
    const audioFile = await AudioRecord.stop();
    return audioFile ?? null;
  },
};
