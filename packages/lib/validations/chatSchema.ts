import * as z from "zod";

export const chatSchema = z.object({
  prompt: z.string().min(1, {
    message: "prompt is required.",
  }),
});

export type ChatInputType = z.infer<typeof chatSchema>;
