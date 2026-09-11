import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/lib/progress";
import { recommendNextAction } from "@/lib/recommend-next-action";
import type { FeaturePriority, ProjectStatus } from "@/types/database";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "기획 중",
  building: "개발 중",
  completed: "완료",
  archived: "보관됨",
};

const PRIORITY_LABEL: Record<FeaturePriority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (!project) {
    notFound();
  }

  const { data: features } = await supabase
    .from("features")
    .select("*")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, priority, status, sort_order")
    .eq("project_id", projectId);

  const totalTasks = tasks?.length ?? 0;
  const completedTasks =
    tasks?.filter((t) => t.status === "done").length ?? 0;
  const progress = calculateProgress(completedTasks, totalTasks);
  const nextAction = tasks ? recommendNextAction(tasks) : null;

  return (
    <div className="flex flex-1 flex-col gap-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <Badge variant="secondary">{STATUS_LABEL[project.status]}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {project.description}
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href={`/projects/${projectId}/tasks`} />}
        >
          태스크 보기
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">MVP 진행률</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{progress}%</span>
          <span className="text-muted-foreground">
            {completedTasks} / {totalTasks}개 태스크 완료
          </span>
        </div>
        <Progress value={progress} />
      </div>

      {nextAction && (
        <div className="flex flex-col gap-3 rounded-lg border p-4">
          <h2 className="text-sm font-medium">다음 액션</h2>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-medium">{nextAction.title}</span>
              <span className="text-sm text-muted-foreground">
                {nextAction.reason}
              </span>
            </div>
            <Button
              size="sm"
              nativeButton={false}
              render={
                <Link
                  href={`/projects/${projectId}/tasks/${nextAction.taskId}`}
                />
              }
            >
              시작하기
              <ArrowRight className="size-3.5" />
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Section title="문제">{project.problem}</Section>
        <Section title="타겟 유저">{project.target_user}</Section>
        <Section title="가치 제안">{project.value_proposition}</Section>
      </div>

      <Section title="MVP 요약">{project.mvp_summary}</Section>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">MVP 기능</h2>
        <ul className="flex flex-col gap-2">
          {(features ?? []).map((feature) => (
            <li
              key={feature.id}
              className="flex items-start justify-between gap-3 rounded-lg border p-3"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium">{feature.title}</span>
                <span className="text-sm text-muted-foreground">
                  {feature.description}
                </span>
              </div>
              <Badge variant="outline" className="shrink-0">
                {PRIORITY_LABEL[feature.priority]}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      {project.excluded_features.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-medium">MVP에서 제외된 기능</h2>
          <ul className="flex flex-col gap-1.5 text-sm text-muted-foreground">
            {project.excluded_features.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-muted-foreground/60">–</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}
