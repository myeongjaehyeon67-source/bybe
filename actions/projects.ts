"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateProjectPlan } from "@/lib/ai/generate-project";
import {
  newProjectInputSchema,
  type GenerateProjectState,
} from "@/lib/validators/project";

export async function generateProject(
  _prevState: GenerateProjectState,
  formData: FormData,
): Promise<GenerateProjectState> {
  const parsed = newProjectInputSchema.safeParse({
    idea: formData.get("idea"),
    targetAudience: formData.get("targetAudience") || undefined,
    platform: formData.get("platform") || undefined,
    experienceLevel: formData.get("experienceLevel") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  let plan;
  try {
    plan = await generateProjectPlan(parsed.data);
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Generation failed.",
    };
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      user_id: user.id,
      name: plan.project.name,
      description: plan.project.description,
      original_idea: parsed.data.idea,
      problem: plan.project.problem,
      target_user: plan.project.targetUser,
      value_proposition: plan.project.valueProposition,
      mvp_summary: plan.mvp.summary,
      platform: parsed.data.platform ?? null,
      experience_level: parsed.data.experienceLevel ?? null,
      excluded_features: plan.excludedFeatures,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return { error: "Couldn't save your project. Please try again." };
  }

  const { error: featuresError } = await supabase.from("features").insert(
    plan.mvp.features.map((feature) => ({
      project_id: project.id,
      title: feature.title,
      description: feature.description,
      priority: feature.priority,
      included_in_mvp: true,
    })),
  );

  if (featuresError) {
    return {
      error: "Project was saved, but features failed to save. Please retry.",
    };
  }

  redirect(`/projects/${project.id}`);
}
