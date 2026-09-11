import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TaskPriority } from "@/types/database";

const PRIORITY_VARIANT: Record<
  TaskPriority,
  "default" | "secondary" | "outline"
> = {
  high: "default",
  medium: "secondary",
  low: "outline",
};

export function TaskCard({
  projectId,
  task,
}: {
  projectId: string;
  task: { id: string; title: string; priority: TaskPriority; featureTitle: string | null };
}) {
  return (
    <Link href={`/projects/${projectId}/tasks/${task.id}`}>
      <Card className="gap-2 p-3 transition-colors hover:bg-muted/40">
        <span className="text-sm font-medium">{task.title}</span>
        <div className="flex items-center justify-between">
          {task.featureTitle ? (
            <span className="truncate text-xs text-muted-foreground">
              {task.featureTitle}
            </span>
          ) : (
            <span />
          )}
          <Badge variant={PRIORITY_VARIANT[task.priority]} className="shrink-0">
            {task.priority}
          </Badge>
        </div>
      </Card>
    </Link>
  );
}
