"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
      <h1 className="text-lg font-semibold">문제가 발생했어요</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        일시적인 오류일 수 있어요. 다시 시도해주세요.
      </p>
      <Button onClick={() => reset()}>다시 시도</Button>
    </div>
  );
}
