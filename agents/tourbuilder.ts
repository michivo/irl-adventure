import { Agent, run } from '@openai/agents';
import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';
import synthesisTool from './ttstool.ts';
import uploadFileTool from './storagetool.ts';

const uploadInstructions =
  'Use the upload file tool to upload audio files to Firebase Storage and obtain public download URLs. Create a new folder for the files. Use these URLs in the JSON file.';

const createGameInstructions = `Use the audio data and stage names to create a real life adventure game. A game is defined in a JSON file as a Game object with a \`stages\` array of stage objects, each containing details about the stage such as its name, description, and possible actions the player can take.
A game in the JSON file should have the following type:
\`\`\`typescript
type Game = {
    id: string;
    version: number;
    name: string;
    stages: Stage[];
    description?: string | undefined;
}

type Stage = {
  id: string;
  name: string;
  action: {
        type: "PLAY_AUDIO";
        audioUrl: string;
  };
  description?: string | undefined;
  preconditions?: ({
    name: string;
    type: "COMPLETE_PREVIOUS_STAGE";
    previousStageId: string;
  } | {
    name: string;
    type: "LOCATION_REACHED";
    locationLatitude: number;
    locationLongitude: number;
    locationAccuracy: number;
  })[] | undefined;
}
\`\`\`'. Use random uuids for the \`id\` fields in the Game and Stage objects.`;

const agent = new Agent({
  name: 'Tour Builder',
  model: 'gpt-5.6-luna',
  tools: [synthesisTool, uploadFileTool],
  instructions:
    'You provide assistance with building adventure tours.' +
    'Build a tour step by step based on user input. Ask the user for a location, create a tour of 3-5 points of interest that are in walking distance, so limit everything to a small area. Get the GPS coordinates for each POI.' +
    'Using the speech synthesis tool, provide one audio description for each point of interest. Do not put them in a shared file. ' +
    createGameInstructions +
    ' ' +
    uploadInstructions,
});

const readline = createInterface({ input: stdin, output: stdout });

try {
  const location = await readline.question('Wo soll die Tour stattfinden?\n> ');
  let result = await run(agent, `Die Tour soll in ${location.trim()} stattfinden.`);

  while (true) {
    console.log(result.finalOutput);

    const answer = await readline.question('> ');
    if (!answer.trim()) {
      continue;
    }

    result = await run(agent, [
      ...result.history,
      { role: 'user', content: answer.trim() },
    ]);
  }
} catch (error) {
  if (!(error instanceof Error) || error.name !== 'AbortError') {
    throw error;
  }
} finally {
  readline.close();
}
