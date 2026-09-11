import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-xl border border-dashed py-24 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Sparkles className="size-5 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="font-medium">No projects yet</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Enter a rough idea and Project OS will turn it into an MVP plan and
          development tasks.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/projects/new" />}>
        New Project
      </Button>
    </div>
  );
}
