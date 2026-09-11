"use client";

import { useActionState } from "react";
import { generateProject } from "@/actions/projects";
import { initialGenerateProjectState } from "@/lib/validators/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function NewProjectForm() {
  const [state, formAction, pending] = useActionState(
    generateProject,
    initialGenerateProjectState,
  );

  return (
    <form action={formAction} className="flex w-full max-w-lg flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="idea">무엇을 만들고 싶으신가요?</Label>
        <Textarea
          id="idea"
          name="idea"
          rows={4}
          placeholder="공부 노트를 AI가 퀴즈로 만들어주는 앱을 만들고 싶어요."
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="targetAudience">타겟 유저 (선택)</Label>
        <Input id="targetAudience" name="targetAudience" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="platform">플랫폼 (선택)</Label>
          <Select name="platform">
            <SelectTrigger id="platform" className="w-full">
              <SelectValue placeholder="플랫폼 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web">웹</SelectItem>
              <SelectItem value="Mobile">모바일</SelectItem>
              <SelectItem value="Desktop">데스크톱</SelectItem>
              <SelectItem value="Other">기타</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="experienceLevel">경험 수준 (선택)</Label>
          <Select name="experienceLevel">
            <SelectTrigger id="experienceLevel" className="w-full">
              <SelectValue placeholder="수준 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">초급</SelectItem>
              <SelectItem value="Intermediate">중급</SelectItem>
              <SelectItem value="Advanced">고급</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "아이디어 분석 중..." : "프로젝트 생성"}
      </Button>
    </form>
  );
}
