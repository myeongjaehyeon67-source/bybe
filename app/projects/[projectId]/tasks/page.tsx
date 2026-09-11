import { createClient } from "@/lib/supabase/server";
import { TaskCard } from "@/components/tasks/task-card";
import type { TaskStatus } from "@/types/database";

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: "todo", label: "To Do" },
  { status: "doing", label: "Doing" },
  { status: "done", label: "Done" },
];

export default async function TasksPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, priority, status, features(title)")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  const rows = tasks ?? [];

  return (
    <div className="flex flex-1 flex-col gap-6">
      <h1 className="text-xl font-semibold tracking-tight">Tasks</h1>

      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tasks yet. Tasks are generated automatically when a project is
          created.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {COLUMNS.map((column) => {
            const columnTasks = rows.filter((t) => t.status === column.status);
            return (
              <div key={column.status} className="flex flex-col gap-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                  {column.label} ({columnTasks.length})
                </h2>
                <div className="flex flex-col gap-2">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      projectId={projectId}
                      task={{
                        id: task.id,
                        title: task.title,
                        priority: task.priority,
                        featureTitle: task.features?.title ?? null,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
