import * as z from "zod";

export const ActionTypes = ["PLAY_AUDIO"] as const;
    
export type ActionType = (typeof ActionTypes)[number];

export const ActionSchemaBase = z.object({
    type: z.enum(ActionTypes),
});

export const AudioAction = ActionSchemaBase.safeExtend({
    type: z.literal("PLAY_AUDIO"),
    audioUrl: z.url(),
});

export const ActionSchema = z.discriminatedUnion("type", [
    AudioAction,
]);

export type Action = z.infer<typeof ActionSchema>;

export type AudioAction = z.infer<typeof AudioAction>;