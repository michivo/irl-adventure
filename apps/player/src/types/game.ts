import * as z from "zod";
import { StageSchema } from "./stage";

export const GameSchema = z.object({
  id: z.string(),
  version: z.number(),
  name: z.string().min(1),
  description: z.string().optional(),
  stages: z.array(StageSchema),
});

export type Game = z.infer<typeof GameSchema>;