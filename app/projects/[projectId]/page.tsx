export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-xl font-semibold tracking-tight">
        Project {projectId}
      </h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        The project overview is coming in a later milestone.
      </p>
    </div>
  );
}
