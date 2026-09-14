import { Agent, run } from '@openai/agents';
import synthesisTool from './ttstool.ts';

const agent = new Agent({
  name: 'Tour Builder',
  model: 'gpt-5.6-luna',
  tools: [synthesisTool],
  instructions:
    'You provide assistance with building adventure tours.' +
    'Build a tour step by step based on user input. Ask the user for a location, create a tour of 3-5 points of interest that are in walking distance.' +
    'Using the speech synthesis tool, provide audio descriptions for each point of interest.',
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