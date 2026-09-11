import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import { taskGenerationSchema, type TaskGeneration } from "@/lib/validators/task";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    tasks: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
          relatedFeatureTitle: { type: Type.STRING },
          acceptanceCriteria: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
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

async function callGemini(context: ProjectContext): Promise<unknown> {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: buildPrompt(context),
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(response.text ?? "");
}

export async function generateTasksForFeatures(
  context: ProjectContext,
): Promise<TaskGeneration> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "AI 생성 기능이 아직 설정되지 않았어요. .env.local에 GEMINI_API_KEY를 추가해주세요.",
    );
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callGemini(context);
      return taskGenerationSchema.parse(raw);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Task generation failed", lastError);
  throw new Error("개발 태스크를 생성하지 못했어요. 다시 시도해주세요.");
}
