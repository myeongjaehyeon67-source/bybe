import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { taskGenerationSchema, type TaskGeneration } from "@/lib/validators/task";

const TOOL_NAME = "return_tasks";

const TOOL_INPUT_SCHEMA = {
  type: "object" as const,
  properties: {
    tasks: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          priority: { type: "string", enum: ["high", "medium", "low"] },
          relatedFeatureTitle: { type: "string" },
          acceptanceCriteria: {
            type: "array",
            items: { type: "string" },
          },
        },
        required: ["title", "description", "priority", "acceptanceCriteria"],
      },
    },
  },
  required: ["tasks"],
};

interface FeatureInput {
  title: string;
  description: string;
  priority: string;
}

interface ProjectContext {
  name: string;
  mvpSummary: string;
  features: FeatureInput[];
}

function buildPrompt(context: ProjectContext): string {
  const featureList = context.features
    .map((f) => `- ${f.title} (${f.priority}): ${f.description}`)
    .join("\n");

  return `You are an AI product manager breaking an MVP down into development tasks.

Project: ${context.name}
MVP summary: ${context.mvpSummary}

MVP features:
${featureList}

Turn this into a logically ordered list of concrete development tasks that implement these features. Rules:
- Each task must be small enough to implement in one sitting.
- Do not write vague tasks like "Build the app". Prefer concrete tasks like "Create project creation form" or "Create POST API route for project generation".
- Order tasks the way they should be built (foundational tasks first).
- Set relatedFeatureTitle to the exact title of the feature a task belongs to, when applicable.
- Give each task 2-5 short acceptance criteria.
- Respond in the same language the project name and MVP summary are written in.`;
}

async function callClaude(context: ProjectContext): Promise<unknown> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    tools: [
      {
        name: TOOL_NAME,
        description: "Return the ordered list of development tasks.",
        input_schema: TOOL_INPUT_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [{ role: "user", content: buildPrompt(context) }],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  return toolUse?.input;
}

export async function generateTasksForFeatures(
  context: ProjectContext,
): Promise<TaskGeneration> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "AI 생성 기능이 아직 설정되지 않았어요. .env.local에 ANTHROPIC_API_KEY를 추가해주세요.",
    );
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callClaude(context);
      return taskGenerationSchema.parse(raw);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Task generation failed", lastError);
  throw new Error("개발 태스크를 생성하지 못했어요. 다시 시도해주세요.");
}
