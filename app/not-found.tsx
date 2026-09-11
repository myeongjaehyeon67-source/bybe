import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-lg font-semibold">페이지를 찾을 수 없어요</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        요청하신 페이지가 없거나 접근 권한이 없어요.
      </p>
      <Button nativeButton={false} render={<Link href="/dashboard" />}>
        대시보드로 이동
      </Button>
    </div>
  );
}
