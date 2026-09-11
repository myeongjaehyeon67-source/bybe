import "server-only";
import { GoogleGenAI } from "@google/genai";

const TECH_STACK = ["Next.js", "TypeScript", "Supabase", "Tailwind CSS", "shadcn/ui"].join(
  ", ",
);

interface CodingPromptInput {
  projectName: string;
  taskTitle: string;
  taskDescription: string;
  acceptanceCriteria: string[];
}

function buildPrompt(input: CodingPromptInput): string {
  return `Write a coding prompt for an AI coding agent (like Claude Code or Cursor) to implement one development task.

Project: ${input.projectName}
Task: ${input.taskTitle}
Description: ${input.taskDescription}
Acceptance criteria:
${input.acceptanceCriteria.map((c) => `- ${c}`).join("\n")}

Current stack: ${TECH_STACK}

Write ONLY the prompt text the agent should receive, covering:
- Goal
- Requirements (derived from the acceptance criteria)
- Constraints: do not modify unrelated files, reuse existing UI components, do not add new dependencies unless necessary, keep the implementation simple.

Return plain text only, no commentary before or after.`;
}

export async function generateCodingPrompt(
  input: CodingPromptInput,
): Promise<string> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "AI 생성 기능이 아직 설정되지 않았어요. .env.local에 GEMINI_API_KEY를 추가해주세요.",
    );
  }

  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents: buildPrompt(input),
  });

  const text = (response.text ?? "").trim();

  if (!text) {
    throw new Error("코딩 프롬프트를 생성하지 못했어요. 다시 시도해주세요.");
  }

  return text;
}
