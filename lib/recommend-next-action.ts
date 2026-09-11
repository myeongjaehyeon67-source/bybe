import type { TaskPriority, TaskStatus } from "@/types/database";

interface TaskForRecommendation {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  sort_order: number;
}

export interface NextActionRecommendation {
  taskId: string;
  title: string;
  priority: TaskPriority;
  reason: string;
}

const PRIORITY_RANK: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function recommendNextAction(
  tasks: TaskForRecommendation[],
): NextActionRecommendation | null {
  const inProgress = [...tasks]
    .filter((t) => t.status === "doing")
    .sort((a, b) => a.sort_order - b.sort_order)[0];

  if (inProgress) {
    return {
      taskId: inProgress.id,
      title: inProgress.title,
      priority: inProgress.priority,
      reason: "이미 진행 중인 작업이에요. 마무리하면 다음 단계로 넘어갈 수 있어요.",
    };
  }

  const next = [...tasks]
    .filter((t) => t.status === "todo")
    .sort((a, b) => {
      const byPriority = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      return byPriority !== 0 ? byPriority : a.sort_order - b.sort_order;
    })[0];

  if (!next) return null;

  return {
    taskId: next.id,
    title: next.title,
    priority: next.priority,
    reason: "MVP를 완성하기 위해 다음으로 진행하면 좋은 작업이에요.",
  };
}
