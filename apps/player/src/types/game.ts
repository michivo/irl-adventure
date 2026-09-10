import * as z from "zod";

export const StageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
});

export type Stage = z.infer<typeof StageSchema>;

export const GameSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  stages: z.array(StageSchema),
});

export type Game = z.infer<typeof GameSchema>;