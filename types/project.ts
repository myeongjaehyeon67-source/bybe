export type ProjectStatus = "planning" | "building" | "completed" | "archived";

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  completedTasks: number;
  totalTasks: number;
  nextAction: string | null;
}
