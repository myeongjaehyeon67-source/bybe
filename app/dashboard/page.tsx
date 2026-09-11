import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/projects/empty-state";
import type { Project } from "@/types/project";

// Temporary mock data for the Phase 2 application shell.
// Replaced once projects are read from Supabase.
const MOCK_PROJECTS: Project[] = [
  {
    id: "1",
    name: "AI Quiz",
    description: "Turn study notes into quizzes with AI.",
    status: "building",
    completedTasks: 13,
    totalTasks: 18,
    nextAction: "Build Quiz Result Page",
  },
  {
    id: "2",
    name: "Habit Tracker",
    description: "A minimal daily habit tracker for solo builders.",
    status: "planning",
    completedTasks: 0,
    totalTasks: 12,
    nextAction: "Define MVP scope",
  },
  {
    id: "3",
    name: "Portfolio Site",
    description: "A one-page portfolio generated from project case studies.",
    status: "completed",
    completedTasks: 9,
    totalTasks: 9,
    nextAction: null,
  },
];

export default function DashboardPage() {
  const projects = MOCK_PROJECTS;

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
        <Button nativeButton={false} render={<Link href="/projects/new" />}>
          New Project
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
