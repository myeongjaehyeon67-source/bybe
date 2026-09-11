import { z } from "zod";

export const taskPrioritySchema = z.enum(["high", "medium", "low"]);

export const taskGenerationSchema = z.object({
  tasks: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        priority: taskPrioritySchema,
        relatedFeatureTitle: z.string().optional(),
        acceptanceCriteria: z.array(z.string()).min(1),
      }),
    )
    .min(1),
});

export type TaskGeneration = z.infer<typeof taskGenerationSchema>;
