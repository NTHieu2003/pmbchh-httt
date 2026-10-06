import RNFS from 'react-native-fs';
import Sound from 'react-native-sound';

Sound.setCategory('Playback');

// Matches pmbc_mobile's `audioRecordingService.playAudio` — writes the
// downloaded base64 WAV to a local temp file (react-native-sound only
// plays from a file path/URL, not raw base64) then plays it. One sound
// instance at a time, same single-`audioMessSelected` model pmbc_web uses.
let currentSound: Sound | null = null;

const stop = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!currentSound) {
      resolve();
      return;
    }
    const sound = currentSound;
    currentSound = null;
    sound.stop(() => {
      sound.release();
      resolve();
    });
  });
};

// Resolves when playback finishes (naturally or stopped) so the caller can
// clear its "currently playing" UI state.
const play = async (base64Wav: string): Promise<void> => {
  await stop();

  const path = `${RNFS.CachesDirectoryPath}/meeting_stt_playback.wav`;
  await RNFS.writeFile(path, base64Wav, 'base64');

  return new Promise((resolve, reject) => {
    const sound = new Sound(path, '', (error) => {
      if (error) {
        reject(error);
        return;
      }
      currentSound = sound;
      sound.play(() => {
        if (currentSound === sound) currentSound = null;
        sound.release();
        resolve();
      });
    });
  });
};

export const AudioPlaybackService = { play, stop };
