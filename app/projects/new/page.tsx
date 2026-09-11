import { NewProjectForm } from "@/components/projects/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 pt-8">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">New Project</h1>
        <p className="text-sm text-muted-foreground">
          Describe your idea and Project OS will turn it into an MVP plan.
        </p>
      </div>
      <NewProjectForm />
    </div>
  );
}
