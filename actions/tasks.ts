"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { generateCodingPrompt } from "@/lib/ai/generate-coding-prompt";
import type { TaskStatus } from "@/types/database";

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  projectId: string,
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("tasks")
    .update({ status })
    .eq("id", taskId);

  if (error) {
    throw new Error("Failed to update task status.");
  }

  revalidatePath(`/projects/${projectId}/tasks`);
  revalidatePath(`/projects/${projectId}`);
  revalidatePath("/dashboard");
}

export interface GenerateCodingPromptState {
  error: string | null;
}

export async function generateCodingPromptAction(
  _prevState: GenerateCodingPromptState,
  formData: FormData,
): Promise<GenerateCodingPromptState> {
  const taskId = formData.get("taskId") as string;
  const projectId = formData.get("projectId") as string;

  const supabase = await createClient();
  const { data: task } = await supabase
    .from("tasks")
    .select("title, description, acceptance_criteria, projects(name)")
    .eq("id", taskId)
    .single();

  if (!task) {
    return { error: "태스크를 찾을 수 없어요." };
  }

  try {
    const prompt = await generateCodingPrompt({
      projectName: task.projects?.name ?? "",
      taskTitle: task.title,
      taskDescription: task.description,
      acceptanceCriteria: task.acceptance_criteria,
    });

    const { error } = await supabase
      .from("tasks")
      .update({ ai_coding_prompt: prompt })
      .eq("id", taskId);

    if (error) {
      return { error: "프롬프트를 저장하지 못했어요. 다시 시도해주세요." };
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "생성에 실패했어요.",
    };
  }

  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
  return { error: null };
}
