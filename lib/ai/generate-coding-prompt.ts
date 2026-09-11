import "server-only";
import Anthropic from "@anthropic-ai/sdk";

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
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "AI 생성 기능이 아직 설정되지 않았어요. .env.local에 ANTHROPIC_API_KEY를 추가해주세요.",
    );
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 1024,
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("코딩 프롬프트를 생성하지 못했어요. 다시 시도해주세요.");
  }

  return text;
}
