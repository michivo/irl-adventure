import { EdgeTTS, Constants } from '@andresaya/edge-tts';
import { tool } from '@openai/agents';
import { z } from 'zod';

const synthesisTool = tool({
    name: 'TTS Synthesis',
    description: 'Synthesizes text to speech',
    parameters: z.object({ text: z.string() }),
    async execute({ text }: { text: string }) {
        const tts = new EdgeTTS();

        const options = {
            rate: '100%',
            volume: '90%',
            outputFormat: Constants.OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3
        };
        await tts.synthesize(text, 'de-DE-AriaNeural', options);
        const fileName = await tts.toFile('./output/audio');
        return {
            fileName,
            info: tts.getAudioInfo(),
            boundaries: tts.getWordBoundaries()
        };
    }
});

export default synthesisTool;
