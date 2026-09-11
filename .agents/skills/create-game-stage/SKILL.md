---
name: create-game-stage
description: Creates a stage for the adventure game.
---

We are building a mobile real life adventure game. A game consists of several stages, each representing a different location or scenario that the player can explore. A game is defined in a JSON file, and this JSON file consists of an array of stage objects, each containing details about the stage such as its name, description, and possible actions the player can take.

A game in the JSON file should have the following type:

```typescript
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
```

Ask the user whether they want to create a new game or append a stage to an existing game. 
Ask the user for a name and description for the new game.
Ask the user for the details of the first stage, including its name, description, action, and preconditions.
Save the new game file with the provided details in the `gamedata` folder. Use the a camel case version of the game name as the filename.

