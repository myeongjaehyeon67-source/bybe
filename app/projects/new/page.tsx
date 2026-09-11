import { NewProjectForm } from "@/components/projects/new-project-form";

export default function NewProjectPage() {
  return (
    <div className="flex flex-1 flex-col items-center gap-6 pt-8">
      <div className="flex flex-col gap-1 text-center">
        <h1 className="text-xl font-semibold tracking-tight">새 프로젝트</h1>
        <p className="text-sm text-muted-foreground">
          아이디어를 설명하면 Project OS가 MVP 계획으로 정리해드려요.
        </p>
      </div>
      <NewProjectForm />
    </div>
  );
}
