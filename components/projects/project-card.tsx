import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { calculateProgress } from "@/lib/progress";
import type { Project, ProjectStatus } from "@/types/project";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  planning: "기획 중",
  building: "개발 중",
  completed: "완료",
  archived: "보관됨",
};

const STATUS_VARIANT: Record<
  ProjectStatus,
  "secondary" | "default" | "outline" | "ghost"
> = {
  planning: "secondary",
  building: "default",
  completed: "outline",
  archived: "ghost",
};

export function ProjectCard({ project }: { project: Project }) {
  const progress = calculateProgress(
    project.completedTasks,
    project.totalTasks,
  );

  return (
    <Link href={`/projects/${project.id}`}>
      <Card className="h-full transition-colors hover:bg-muted/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle>{project.name}</CardTitle>
            <Badge variant={STATUS_VARIANT[project.status]}>
              {STATUS_LABEL[project.status]}
            </Badge>
          </div>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{progress}%</span>
              <span className="text-muted-foreground">
                {project.completedTasks} / {project.totalTasks} 태스크
              </span>
            </div>
            <Progress value={progress} />
          </div>
          {project.nextAction && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ArrowRight className="size-3.5 shrink-0" />
              <span>
                다음:{" "}
                <span className="text-foreground">{project.nextAction}</span>
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
