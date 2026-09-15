import { Agent, run } from '@openai/agents';
import synthesisTool from './ttstool.ts';

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
  tools: [synthesisTool],
  instructions:
    'You provide assistance with building adventure tours.' +
    'Build a tour step by step based on user input. Ask the user for a location, create a tour of 3-5 points of interest that are in walking distance. Get the GPS coordinates for each POI.' +
    'Using the speech synthesis tool, provide one audio description for each point of interest. Do not put them in a shared file. ' + 
    createGameInstructions
});

console.log("Wo soll die Tour stattfinden?");
const location = await new Promise<string>((resolve) => {
  const stdin = process.stdin;
  const stdout = process.stdout;
  stdin.resume();
  stdout.write('> ');
  stdin.once('data', (data) => {
    resolve(data.toString().trim());
  });
});

const result = await run(agent, `Die Tour soll in ${location} stattfinden.`);

console.log(result.finalOutput);