import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/projects/empty-state";
import { createClient } from "@/lib/supabase/server";
import { recommendNextAction } from "@/lib/recommend-next-action";
import type { Project } from "@/types/project";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("projects")
    .select("id, name, description, status, tasks(id, title, priority, status, sort_order)")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const projects: Project[] = (rows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    description: row.description,
    status: row.status,
    completedTasks: row.tasks.filter((t) => t.status === "done").length,
    totalTasks: row.tasks.length,
    nextAction: recommendNextAction(row.tasks)?.title ?? null,
  }));

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">프로젝트</h1>
        <Button nativeButton={false} render={<Link href="/projects/new" />}>
          새 프로젝트
        </Button>
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
