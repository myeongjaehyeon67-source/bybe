import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/lib/progress";
import type { FeaturePriority, ProjectStatus } from "@/types/database";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "Planning",
  building: "Building",
  completed: "Completed",
  archived: "Archived",
};

const PRIORITY_LABEL: Record<FeaturePriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
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
    .select("status")
    .eq("project_id", projectId);

  const totalTasks = tasks?.length ?? 0;
  const completedTasks =
    tasks?.filter((t) => t.status === "done").length ?? 0;
  const progress = calculateProgress(completedTasks, totalTasks);

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
          View Tasks
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium">MVP Progress</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{progress}%</span>
          <span className="text-muted-foreground">
            {completedTasks} / {totalTasks} tasks completed
          </span>
        </div>
        <Progress value={progress} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Section title="Problem">{project.problem}</Section>
        <Section title="Target User">{project.target_user}</Section>
        <Section title="Value Proposition">
          {project.value_proposition}
        </Section>
      </div>

      <Section title="MVP Summary">{project.mvp_summary}</Section>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-medium">MVP Features</h2>
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
          <h2 className="text-sm font-medium">Excluded From MVP</h2>
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
