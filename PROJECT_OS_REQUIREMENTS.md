# Project OS — Product Requirements Document

## 1. Product Overview

### Product Name
Project OS

### One-line Description
Project OS is an AI-powered project manager for solo builders and vibe coders that turns a rough app idea into a clear MVP plan, development tasks, and recommended next actions.

### Core Problem
Solo builders, beginners, designers, and vibe coders often struggle with:

- turning a vague idea into a buildable MVP
- deciding which features are truly necessary
- knowing what to build next
- preventing feature creep
- writing useful coding prompts for AI coding tools
- finishing projects instead of endlessly expanding them

Project OS should reduce that decision-making burden.

### Core Value Proposition
A user enters a rough project idea.

Project OS converts it into:

1. Problem definition
2. Target user
3. Value proposition
4. MVP scope
5. Included features
6. Excluded features
7. Development tasks
8. Recommended next action
9. AI-ready coding prompts for each task

The product should feel like an AI Product Manager for solo builders.

---

# 2. Target Users

Primary users:

- students building personal projects
- beginner developers
- designers learning to code
- solo developers
- indie hackers
- users building apps with Claude Code, Cursor, or similar AI coding tools

Typical user situation:

> "I have an app idea, but I don't know what I should build first."

> "My AI coding project keeps getting bigger and more complicated."

> "I need help deciding what belongs in the MVP."

> "I want a clear coding task I can give to Claude Code."

---

# 3. Product Principles

The product should follow these principles.

## 3.1 Simplicity First

Prefer the simplest possible implementation.

Avoid unnecessary abstractions, dependencies, screens, and features.

## 3.2 MVP Focus

The product should actively help users reduce scope.

It should not encourage users to add unnecessary features.

## 3.3 Action Over Documentation

The product should always guide the user toward a concrete next action.

## 3.4 AI Should Structure, Not Just Chat

AI should return structured project information.

Avoid building a generic ChatGPT-style chat experience.

## 3.5 Solo Builder Optimized

The experience should be optimized for one person building one project at a time.

---

# 4. MVP Scope

The MVP should support the following core flow:

```text
Sign Up / Login

↓

Dashboard

↓

Create Project

↓

Enter Rough Idea

↓

AI Generates Project Definition + MVP

↓

AI Generates Features + Development Tasks

↓

User Updates Task Status

↓

Project Progress Updates

↓

AI Recommends Next Action

↓

User Opens Task

↓

AI Coding Prompt Is Available

↓

MVP Completed
```

---

# 5. Core Features

## 5.1 Authentication

Users should be able to:

- sign up
- log in
- log out

Use Supabase Auth.

For the MVP, email/password authentication is sufficient.

Social login is not required.

---

## 5.2 Dashboard

The dashboard is the main entry screen after login.

It should display the user's projects.

Each project card should show:

- project name
- short description
- progress percentage
- completed task count
- total task count
- recommended next action
- project status

Example:

```text
Project OS

72% complete
13 / 18 tasks

Next:
Build project overview page
```

The dashboard should contain:

- New Project button
- project cards
- empty state when no projects exist

---

## 5.3 New Project

Users should be able to create a project by entering a rough idea.

Primary input:

```text
What do you want to build?
```

Example:

```text
I want to build an app that turns study notes into AI-generated quizzes.
```

Optional inputs:

- target audience
- platform
- experience level

Suggested values:

### Platform

- Web
- Mobile
- Desktop
- Other

### Experience Level

- Beginner
- Intermediate
- Advanced

The main action button:

```text
Generate Project
```

---

# 6. AI Project Generator

When the user submits an idea, the AI should generate a structured project definition.

The result must include:

- project name
- one-line description
- problem
- target user
- value proposition
- MVP summary
- MVP features
- excluded features

AI output should use structured JSON.

Example:

```json
{
  "project": {
    "name": "AI Quiz",
    "description": "Turn study notes into quizzes with AI.",
    "problem": "Students struggle to test their understanding after studying.",
    "targetUser": "Students",
    "valueProposition": "Generate practice quizzes instantly from study notes."
  },
  "mvp": {
    "summary": "Users paste study notes and receive an AI-generated quiz.",
    "features": [
      {
        "title": "Authentication",
        "description": "Users can create and access their account.",
        "priority": "high"
      },
      {
        "title": "Study Note Input",
        "description": "Users can paste study notes.",
        "priority": "high"
      },
      {
        "title": "AI Quiz Generation",
        "description": "AI generates quiz questions from notes.",
        "priority": "high"
      },
      {
        "title": "Quiz Experience",
        "description": "Users can answer generated questions.",
        "priority": "high"
      },
      {
        "title": "Result Screen",
        "description": "Users can see their result.",
        "priority": "high"
      }
    ]
  },
  "excludedFeatures": [
    "Leaderboard",
    "Multiplayer",
    "Native mobile app",
    "Social sharing"
  ]
}
```

The AI response must be validated before saving.

Do not rely on raw prose output for application state.

---

# 7. Project Overview

The project overview page should give the user a clear snapshot of the project.

Required sections:

## Project Header

Show:

- project name
- short description
- status

## MVP Progress

Show:

- progress percentage
- completed tasks
- total tasks

Example:

```text
62%

12 / 19 tasks completed
```

## Next Action

Show the current recommended next task.

Example:

```text
Next Action

Build Quiz Result Page

Difficulty: Medium

[Start]
```

## MVP Features

Show included features and their status.

Example:

```text
✓ Authentication
✓ Study note input
✓ AI quiz generation
○ Quiz experience
○ Result page
```

## Excluded From MVP

Show explicitly excluded features.

Example:

```text
Excluded from MVP

- Multiplayer
- Leaderboard
- Mobile app
```

This section is important because it helps prevent feature creep.

---

# 8. Task Management

Each project contains development tasks.

Supported statuses:

```text
todo
doing
done
```

The MVP may use either:

- simple columns
- lightweight Kanban board

Do not build complex drag-and-drop behavior unless it is trivial to support.

Clicking a task should open its details.

Each task should contain:

- title
- description
- related feature
- priority
- status
- acceptance criteria
- AI coding prompt

Example:

```text
Build Quiz Result Page

Why:
Users need feedback after completing a quiz.

Acceptance Criteria:

□ Score is displayed
□ Correct answers are displayed
□ Retry button exists
□ Back to dashboard button exists
```

---

# 9. AI Task Generator

After the MVP features are generated, the AI should convert them into development tasks.

Tasks should be:

- concrete
- small enough to implement
- ordered logically
- focused on the MVP
- independent where possible

Avoid tasks such as:

```text
Build the app
```

Prefer:

```text
Create project creation form

Create POST API route for project generation

Store generated project in Supabase

Render MVP features on project overview page
```

Each task should include:

```json
{
  "title": "Build Quiz Result Page",
  "description": "Create the page users see after completing a quiz.",
  "priority": "high",
  "acceptanceCriteria": [
    "Display score",
    "Display correct answer count",
    "Provide retry action",
    "Provide dashboard navigation"
  ]
}
```

---

# 10. Next Action Recommendation

Project OS should recommend one next action for the user.

The recommendation should consider:

- incomplete tasks
- task priority
- dependencies
- current project progress
- MVP importance

The recommendation should not suggest optional or excluded features before required MVP tasks are complete.

Example:

```text
Build Quiz Result Page

Reason:
The core flow is currently:

Input → Generate → Quiz → Result

The Result step is still missing, so this task completes the primary user journey.
```

The recommendation should return:

```json
{
  "taskId": "...",
  "reason": "..."
}
```

---

# 11. AI Coding Prompt Generator

Every development task should have a coding prompt suitable for tools such as:

- Claude Code
- Cursor
- Codex-style coding agents

Example:

```text
Implement the Quiz Result page.

Current stack:
- Next.js
- TypeScript
- Supabase
- Tailwind CSS
- shadcn/ui

Requirements:
- Show quiz score
- Show number of correct answers
- Provide retry action
- Provide return-to-dashboard action

Constraints:
- Do not modify unrelated files.
- Reuse existing UI components when possible.
- Do not add new dependencies unless necessary.
- Keep the implementation simple.
```

Coding prompts should include:

- goal
- relevant context
- requirements
- acceptance criteria
- constraints

They should not instruct the coding agent to rebuild unrelated parts of the application.

---

# 12. Screens

The MVP should contain only the following primary screens.

## 12.1 Login

Purpose:

Authenticate the user.

Required elements:

- email
- password
- login
- sign up

---

## 12.2 Dashboard

Purpose:

Show existing projects and the next action.

Required elements:

- project list
- project cards
- progress
- next action
- New Project button

---

## 12.3 New Project

Purpose:

Capture a rough idea and generate the project plan.

Required elements:

- idea textarea
- optional target audience
- optional platform
- optional experience level
- Generate Project button
- loading state
- error state

---

## 12.4 Project Overview

Purpose:

Show the project definition and MVP status.

Required sections:

- project summary
- problem
- target user
- value proposition
- progress
- next action
- features
- excluded features

---

## 12.5 Tasks

Purpose:

Manage project implementation.

Required elements:

- todo tasks
- doing tasks
- done tasks
- task detail view
- acceptance criteria
- AI coding prompt

---

# 13. Database Schema

Use Supabase Postgres.

Keep the schema simple.

---

## 13.1 projects

Suggested fields:

```text
id
user_id
name
description
original_idea
problem
target_user
value_proposition
mvp_summary
platform
experience_level
status
created_at
updated_at
```

Suggested status values:

```text
planning
building
completed
archived
```

---

## 13.2 features

Suggested fields:

```text
id
project_id
title
description
priority
included_in_mvp
status
created_at
updated_at
```

Suggested priority values:

```text
high
medium
low
```

Suggested status values:

```text
todo
doing
done
```

---

## 13.3 tasks

Suggested fields:

```text
id
project_id
feature_id
title
description
priority
status
acceptance_criteria
ai_coding_prompt
sort_order
created_at
updated_at
```

Acceptance criteria may be stored as JSONB.

---

# 14. Progress Calculation

Project progress should initially be calculated from task completion.

Formula:

```text
completed tasks / total tasks * 100
```

Example:

```text
12 completed tasks
20 total tasks

Progress = 60%
```

Do not use complex weighted progress in the MVP.

---

# 15. Suggested Tech Stack

Use:

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase Postgres
- Supabase Auth
- OpenAI API or another structured-output-capable LLM provider
- Vercel
- Lucide icons

Keep dependencies minimal.

Do not introduce another state management library unless clearly necessary.

Prefer:

- React state
- server actions
- route handlers
- server components where appropriate

---

# 16. Suggested Route Structure

Example:

```text
/
 /login
 /dashboard
 /projects/new
 /projects/[projectId]
 /projects/[projectId]/tasks
```

API or server-side actions may support:

```text
generateProject
generateTasks
generateCodingPrompt
recommendNextAction
```

---

# 17. Suggested Application Structure

A possible structure:

```text
app/
  login/
  dashboard/
  projects/
    new/
    [projectId]/
      page.tsx
      tasks/

components/
  layout/
  projects/
  tasks/
  ui/

lib/
  ai/
  supabase/
  validators/
  utils/

types/

actions/
```

Claude Code may adjust this structure if there is a clearly simpler alternative.

Avoid unnecessary architectural complexity.

---

# 18. UI Direction

The interface should feel:

- minimal
- focused
- calm
- professional
- productivity-oriented

Visual inspiration may come from tools like Linear and Notion, but do not copy them directly.

Use:

- clear typography
- generous whitespace
- subtle borders
- restrained card usage
- small or moderate border radius
- clear hierarchy

Avoid:

- excessive gradients
- excessive shadows
- glassmorphism
- oversized rounded cards
- decorative animations
- unnecessary visual effects

The UI should prioritize information clarity.

---

# 19. Loading and Error States

All AI actions should include:

- loading state
- success state
- error state
- retry option when appropriate

Examples:

```text
Analyzing your idea...
```

```text
Generating MVP...
```

```text
Creating development tasks...
```

Never leave the UI in an indefinite loading state.

AI failures should not delete existing project data.

---

# 20. AI Safety and Reliability Requirements

AI-generated data should be validated.

Use schema validation such as Zod.

Do not directly trust model output.

When AI output is invalid:

1. attempt safe parsing or retry
2. return a clear application error
3. avoid writing malformed data to the database

Never expose AI provider API keys to the browser.

All sensitive AI requests must run server-side.

---

# 21. Authentication and Data Access

Users must only be able to access their own projects.

Use Supabase Row Level Security where appropriate.

A user must not be able to:

- read another user's projects
- modify another user's projects
- read another user's tasks
- modify another user's tasks

---

# 22. Out of Scope for MVP

Do NOT implement these features unless explicitly requested later.

- payments
- subscriptions
- teams
- organizations
- collaboration
- real-time multiplayer editing
- GitHub integration
- Figma integration
- Slack integration
- Discord integration
- Google Drive integration
- calendar integration
- native mobile app
- desktop app
- push notifications
- email notifications
- analytics dashboard
- community
- marketplace
- templates marketplace
- public project sharing
- advanced permissions
- complex task dependencies
- time tracking
- Gantt chart
- complex drag-and-drop systems

If a requested implementation seems to require one of these features, stop and reconsider whether it is actually needed for the MVP.

---

# 23. Future Features

These may be considered only after the MVP works.

## GitHub Integration

Possible future behavior:

- connect repository
- inspect commits
- detect completed work
- automatically update task progress
- recommend next action based on repository state

## AI Project Review

AI could inspect:

- current project status
- scope
- unfinished tasks
- possible overbuilding

And answer:

```text
Am I overbuilding?

What should I build next?

What can I remove from the MVP?

Is my core user flow complete?
```

## Portfolio Generation

Project OS could eventually convert a finished project into a portfolio case study.

These are future ideas and must not affect MVP implementation.

---

# 24. Development Order

Implement the application in this order.

## Phase 1 — Foundation

1. Initialize Next.js project
2. Configure TypeScript
3. Configure Tailwind
4. Add shadcn/ui
5. Configure Supabase
6. Set environment variables

## Phase 2 — Application Shell

7. Build global layout
8. Build navigation/sidebar
9. Build dashboard with mock data
10. Build reusable project card
11. Build empty state

Do not connect AI yet.

## Phase 3 — Authentication

12. Implement sign up
13. Implement login
14. Implement logout
15. Protect authenticated routes

## Phase 4 — Database

16. Create projects table
17. Create features table
18. Create tasks table
19. Add RLS policies
20. Create TypeScript types

## Phase 5 — Project Creation

21. Build New Project page
22. Create project generation schema
23. Connect AI Project Generator
24. Validate structured AI output
25. Save project
26. Save generated features
27. Redirect to Project Overview

## Phase 6 — Tasks

28. Generate tasks from MVP features
29. Save tasks
30. Build Tasks screen
31. Implement task status updates
32. Calculate project progress

## Phase 7 — AI Assistance

33. Recommend next action
34. Generate AI coding prompts
35. Display coding prompt in task details

## Phase 8 — Polish

36. Add loading states
37. Add error handling
38. Add empty states
39. Improve responsive behavior
40. Verify permissions
41. Deploy to Vercel

---

# 25. Definition of MVP Complete

The MVP is complete when a new user can:

1. create an account
2. log in
3. create a project from a rough idea
4. receive an AI-generated project definition
5. see a clearly defined MVP
6. see excluded features
7. receive generated development tasks
8. change task status
9. see automatic progress updates
10. receive a recommended next action
11. open a task
12. copy an AI-generated coding prompt
13. complete all tasks
14. see the project reach 100%

If all of the above work reliably, the MVP is complete.

Do not delay release for non-essential features.

---

# 26. Claude Code Development Rules

Follow these rules during implementation.

## General

- Always prefer the simplest implementation.
- Keep the product within MVP scope.
- Do not invent new features.
- Do not modify unrelated files.
- Do not redesign working screens unless requested.
- Avoid premature abstraction.
- Avoid unnecessary dependencies.
- Prefer existing project patterns.

## Before Implementing a Task

Before making changes:

1. inspect the relevant existing files
2. identify the smallest implementation path
3. explain what will change
4. implement only the requested scope

## When Fixing Bugs

Use this process:

1. identify the root cause
2. explain the root cause
3. make the smallest possible fix
4. check for regressions
5. avoid unrelated refactoring

## TypeScript

- Use strict TypeScript.
- Avoid `any` unless unavoidable.
- Define reusable domain types.
- Validate external data.

## UI

- Reuse existing UI components.
- Keep components small.
- Do not add decorative UI without purpose.
- Maintain consistent spacing and typography.
- Preserve responsive behavior.

## Database

- Do not make destructive schema changes without explaining them.
- Keep migrations explicit.
- Respect user ownership.
- Apply Row Level Security where appropriate.

## AI

- AI calls must be server-side.
- Never expose API keys.
- Use structured output.
- Validate all model output.
- AI failures must not corrupt saved data.

## Dependencies

Before adding a package, ask:

```text
Can this be implemented cleanly with the current stack?
```

If yes, do not add the dependency.

---

# 27. Instructions for Claude Code

When first reading this file:

Do NOT immediately build the entire application.

First:

1. inspect the current repository
2. summarize the existing architecture
3. compare the repository with this PRD
4. identify what already exists
5. identify the next smallest implementation milestone
6. propose a short implementation plan

Then implement one milestone at a time.

Never attempt to generate the entire product in a single large change.

The priority is:

```text
Working vertical slice
>
Simple architecture
>
Correct behavior
>
Polish
>
Extra features
```

Project OS should remain small, focused, and shippable.
