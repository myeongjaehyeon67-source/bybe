import "server-only";
import { GoogleGenAI, Type } from "@google/genai";
import {
  projectGenerationSchema,
  type NewProjectInput,
  type ProjectGeneration,
} from "@/lib/validators/project";

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    project: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        description: { type: Type.STRING },
        problem: { type: Type.STRING },
        targetUser: { type: Type.STRING },
        valueProposition: { type: Type.STRING },
      },
      required: [
        "name",
        "description",
        "problem",
        "targetUser",
        "valueProposition",
      ],
    },
    mvp: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        features: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              priority: { type: Type.STRING, enum: ["high", "medium", "low"] },
            },
            required: ["title", "description", "priority"],
          },
        },
      },
      required: ["summary", "features"],
    },
    excludedFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ["project", "mvp", "excludedFeatures"],
};

function buildPrompt(input: NewProjectInput): string {
  const context = [
    input.targetAudience && `Target audience: ${input.targetAudience}`,
    input.platform && `Platform: ${input.platform}`,
    input.experienceLevel && `Experience level: ${input.experienceLevel}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are an AI product manager for solo builders and vibe coders. Turn the rough idea below into a focused MVP definition.

Rough idea:
${input.idea}
${context ? `\n${context}` : ""}

Rules:
- Keep the MVP as small as possible. Prefer fewer, essential features.
- List 3-6 MVP features, ordered by priority.
- excludedFeatures must list features that are commonly tempting to add but are NOT needed for the MVP.
- Do not suggest payments, teams, or real-time collaboration for the MVP.
- Respond in the same language the rough idea above is written in.`;
}

async function callGemini(input: NewProjectInput): Promise<unknown> {
  const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await client.models.generateContent({
    model: "gemini-3.6-flash",
    contents: buildPrompt(input),
    config: {
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  return JSON.parse(response.text ?? "");
}

export async function generateProjectPlan(
  input: NewProjectInput,
): Promise<ProjectGeneration> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error(
      "AI 생성 기능이 아직 설정되지 않았어요. .env.local에 GEMINI_API_KEY를 추가해주세요.",
    );
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callGemini(input);
      return projectGenerationSchema.parse(raw);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Project generation failed", lastError);
  throw new Error("프로젝트 계획을 생성하지 못했어요. 다시 시도해주세요.");
}
