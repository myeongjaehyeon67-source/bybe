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
        <p className="font-medium">아직 프로젝트가 없어요</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          러프한 아이디어를 입력하면 Project OS가 MVP 계획과 개발 태스크로
          정리해드려요.
        </p>
      </div>
      <Button nativeButton={false} render={<Link href="/projects/new" />}>
        새 프로젝트
      </Button>
    </div>
  );
}
