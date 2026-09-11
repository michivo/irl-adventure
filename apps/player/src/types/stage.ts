import * as z from "zod";
import { ActionSchema } from "./action";

export const StagePreconditions = ["COMPLETE_PREVIOUS_STAGE", "LOCATION_REACHED"] as const;

export type StagePreconditionType = (typeof StagePreconditions)[number];

const StagePreconditionSchemaBase = z.object({
  name: z.string().min(1),
  type: z.enum(StagePreconditions),
});
  
export const StageCompletePreconditionSchema = StagePreconditionSchemaBase.safeExtend({
  type: z.literal("COMPLETE_PREVIOUS_STAGE"),
  previousStageId: z.string(),
});

export type StageCompletePrecondition = z.infer<typeof StageCompletePreconditionSchema>;

export const StageLocationReachedPreconditionSchema = StagePreconditionSchemaBase.safeExtend({
  type: z.literal("LOCATION_REACHED"),
  locationLatitude: z.number(),
  locationLongitude: z.number(),
  locationAccuracy: z.number(),
});

export const StagePreconditionSchema = z.union([
  StageCompletePreconditionSchema,
  StageLocationReachedPreconditionSchema,
]);

export type StageLocationReachedPrecondition = z.infer<typeof StageLocationReachedPreconditionSchema>;

export type StagePrecondition = z.infer<typeof StagePreconditionSchema>;

export const StageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  preconditions: z.array(StagePreconditionSchema).optional(),
  action: z.lazy(() => ActionSchema),
});

export type Stage = z.infer<typeof StageSchema>;