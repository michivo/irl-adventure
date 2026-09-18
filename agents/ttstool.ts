import { EdgeTTS, Constants } from '@andresaya/edge-tts';
import { tool } from '@openai/agents';
import { z } from 'zod';

export const synthesisTool = tool({
  name: 'TTS Synthesis',
  description: 'Synthesizes text to speech',
  parameters: z.object({ text: z.string() }),
  async execute({ text }: { text: string }) {
    return await synthesizeTextToSpeech(text);
  },
});

export async function synthesizeTextToSpeech(text: string) {
  const tts = new EdgeTTS();

  try {
    const options = {
      volume: '90%',
      outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    };
    await tts.synthesize(text, config.voice, options);
    const fileId = getAudioFileId();
    const fileName = await tts.toFile(`./output/${fileId}`);
    return {
      fileName,
      info: tts.getAudioInfo(),
      boundaries: tts.getWordBoundaries(),
    };
  } catch (error) {
    console.error('Error during synthesis:', error);
    throw error;
  }
}

function getAudioFileId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export default synthesisTool;
