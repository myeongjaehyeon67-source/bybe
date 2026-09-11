import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import {
  projectGenerationSchema,
  type NewProjectInput,
  type ProjectGeneration,
} from "@/lib/validators/project";

const TOOL_NAME = "return_project_plan";

const TOOL_INPUT_SCHEMA = {
  type: "object" as const,
  properties: {
    project: {
      type: "object",
      properties: {
        name: { type: "string" },
        description: { type: "string" },
        problem: { type: "string" },
        targetUser: { type: "string" },
        valueProposition: { type: "string" },
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
      type: "object",
      properties: {
        summary: { type: "string" },
        features: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              priority: { type: "string", enum: ["high", "medium", "low"] },
            },
            required: ["title", "description", "priority"],
          },
        },
      },
      required: ["summary", "features"],
    },
    excludedFeatures: {
      type: "array",
      items: { type: "string" },
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
- Do not suggest payments, teams, or real-time collaboration for the MVP.`;
}

async function callClaude(input: NewProjectInput): Promise<unknown> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const response = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 2048,
    tools: [
      {
        name: TOOL_NAME,
        description: "Return the structured MVP project plan.",
        input_schema: TOOL_INPUT_SCHEMA,
      },
    ],
    tool_choice: { type: "tool", name: TOOL_NAME },
    messages: [{ role: "user", content: buildPrompt(input) }],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  return toolUse?.input;
}

export async function generateProjectPlan(
  input: NewProjectInput,
): Promise<ProjectGeneration> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error(
      "AI generation is not configured yet. Add ANTHROPIC_API_KEY to .env.local.",
    );
  }

  let lastError: unknown;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const raw = await callClaude(input);
      return projectGenerationSchema.parse(raw);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("Project generation failed", lastError);
  throw new Error("Couldn't generate your project plan. Please try again.");
}
