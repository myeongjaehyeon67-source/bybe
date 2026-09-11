import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateTaskStatus } from "@/actions/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GeneratePromptButton } from "@/components/tasks/generate-prompt-button";
import { CopyButton } from "@/components/tasks/copy-button";
import type { TaskStatus } from "@/types/database";

const STATUS_OPTIONS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "할 일" },
  { status: "doing", label: "진행 중" },
  { status: "done", label: "완료" },
];

const PRIORITY_LABEL = { high: "높음", medium: "보통", low: "낮음" };

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  const { projectId, taskId } = await params;
  const supabase = await createClient();

  const { data: task } = await supabase
    .from("tasks")
    .select("*, features(title)")
    .eq("id", taskId)
    .single();

  if (!task) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Link
        href={`/projects/${projectId}/tasks`}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        태스크 목록으로
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            {task.title}
          </h1>
          <Badge variant="outline">{PRIORITY_LABEL[task.priority]}</Badge>
        </div>
        {task.features && (
          <span className="text-sm text-muted-foreground">
            관련 기능: {task.features.title}
          </span>
        )}
        <p className="text-sm text-muted-foreground">{task.description}</p>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">상태</h2>
        <div className="flex gap-2">
          {STATUS_OPTIONS.map((option) => (
            <form
              key={option.status}
              action={updateTaskStatus.bind(
                null,
                taskId,
                option.status,
                projectId,
              )}
            >
              <Button
                type="submit"
                variant={task.status === option.status ? "default" : "outline"}
                size="sm"
              >
                {option.label}
              </Button>
            </form>
          ))}
        </div>
      </div>

      {task.acceptance_criteria.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium">완료 조건</h2>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            {task.acceptance_criteria.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5">□</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">AI 코딩 프롬프트</h2>
        {task.ai_coding_prompt ? (
          <div className="flex flex-col gap-2">
            <pre className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-3 text-sm">
              {task.ai_coding_prompt}
            </pre>
            <CopyButton text={task.ai_coding_prompt} />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              아직 생성되지 않았어요.
            </p>
            <GeneratePromptButton taskId={taskId} projectId={projectId} />
          </div>
        )}
      </div>
    </div>
  );
}
