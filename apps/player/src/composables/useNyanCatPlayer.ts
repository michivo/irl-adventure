import { AudioPlayer } from '@mediagrid/capacitor-native-audio';
import { toErrorMessage, useLogger } from './useLogger';

const NYAN_CAT_AUDIO_SOURCE = 'https://www.nyan.cat/music/original.mp3';

const audioId = generateAudioId();
const { logError } = useLogger('nyanCatPlayer');
let isInitialized = false;

async function initialize(): Promise<void> {
  if (isInitialized) {
    return;
  }
  try {
    await AudioPlayer.create({
      audioId,
      audioSource: NYAN_CAT_AUDIO_SOURCE,
      friendlyTitle: '',
      useForNotification: true,
      isBackgroundMusic: true,
      loop: true,
    });
    await AudioPlayer.initialize({ audioId });
    isInitialized = true;
  } catch (error) {
    logError(`Failed to initialize audio: ${toErrorMessage(error)}`);
  }
}

function generateAudioId(): string {
  return Math.ceil(Math.random() * 10_000_000).toString();
}

export function useNyanCatPlayer() {
  async function play(): Promise<void> {
    await initialize();
    try {
      await AudioPlayer.play({ audioId });
    } catch (error) {
      logError(`Failed to play audio: ${toErrorMessage(error)}`);
    }
  }

  async function stop(): Promise<void> {
    try {
      await AudioPlayer.stop({ audioId });
    } catch (error) {
      logError(`Failed to stop audio: ${toErrorMessage(error)}`);
    } finally {
      isInitialized = false;
    }
  }

  return { play, stop };
}
