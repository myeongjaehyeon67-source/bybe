import { z } from "zod";

export const newProjectInputSchema = z.object({
  idea: z.string().min(10, "Describe your idea in a bit more detail."),
  targetAudience: z.string().optional(),
  platform: z.enum(["Web", "Mobile", "Desktop", "Other"]).optional(),
  experienceLevel: z.enum(["Beginner", "Intermediate", "Advanced"]).optional(),
});

export type NewProjectInput = z.infer<typeof newProjectInputSchema>;

export const featurePrioritySchema = z.enum(["high", "medium", "low"]);

export const projectGenerationSchema = z.object({
  project: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    problem: z.string().min(1),
    targetUser: z.string().min(1),
    valueProposition: z.string().min(1),
  }),
  mvp: z.object({
    summary: z.string().min(1),
    features: z
      .array(
        z.object({
          title: z.string().min(1),
          description: z.string().min(1),
          priority: featurePrioritySchema,
        }),
      )
      .min(1),
  }),
  excludedFeatures: z.array(z.string()),
});

export type ProjectGeneration = z.infer<typeof projectGenerationSchema>;

export interface GenerateProjectState {
  error: string | null;
}

export const initialGenerateProjectState: GenerateProjectState = {
  error: null,
};
