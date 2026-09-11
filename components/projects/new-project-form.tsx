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
        <Label htmlFor="idea">What do you want to build?</Label>
        <Textarea
          id="idea"
          name="idea"
          rows={4}
          placeholder="I want to build an app that turns study notes into AI-generated quizzes."
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="targetAudience">Target audience (optional)</Label>
        <Input id="targetAudience" name="targetAudience" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="platform">Platform (optional)</Label>
          <Select name="platform">
            <SelectTrigger id="platform" className="w-full">
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Web">Web</SelectItem>
              <SelectItem value="Mobile">Mobile</SelectItem>
              <SelectItem value="Desktop">Desktop</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="experienceLevel">Experience (optional)</Label>
          <Select name="experienceLevel">
            <SelectTrigger id="experienceLevel" className="w-full">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Analyzing your idea..." : "Generate Project"}
      </Button>
    </form>
  );
}
