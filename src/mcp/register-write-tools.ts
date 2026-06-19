/* Write-capable MCP tools for spec creation and result recording. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { createSpecFromPrompt, createTodoFromPrompt, generateAgentsFile } from "../spec/scaffold.js";
import { markSpecDone } from "../spec/done-writer.js";
import { recordSpecCheckpoint } from "../spec/checkpoint-writer.js";
import { recordSpecReviewResult } from "../spec/review-result-writer.js";
import { renderAgentFileResult, renderReviewResult, renderSpecResult } from "./render-spec.js";
import { textResult } from "./render-core.js";
import { SpecCheckpointSchema, SpecDoneSchema, SpecPromptSchema, SpecReviewResultSchema, WriteTextSchema } from "./write-schemas.js";
import type { SessionGuardState } from "../spec/types.js";
import { SPEC_CONTEXT_REQUIRED_MESSAGE, requireSpecContext } from "./session-guard.js";

function withSpecContext<T>(guard: SessionGuardState, action: () => Promise<T>): Promise<T> {
  requireSpecContext(guard);
  return action();
}

function specContextRequiredDescription(action: string): string {
  return `${action} ${SPEC_CONTEXT_REQUIRED_MESSAGE}`;
}

export function registerWriteTools(server: McpServer, guard: SessionGuardState): void {
  server.registerTool(
    "spec_generate_agents",
    {
      description: specContextRequiredDescription("Generate or update AGENTS.md in the project root with the project's engineering principles and operating rules."),
      inputSchema: WriteTextSchema
    },
    async ({ projectRoot, projectName, overwrite }) =>
      withSpecContext(guard, async () =>
        textResult(renderAgentFileResult("AGENTS.md 已生成", await generateAgentsFile({ projectRoot, projectName, overwrite })))
      )
  );

  server.registerTool(
    "spec_create",
    {
      description: specContextRequiredDescription("Create an active spec from a user prompt."),
      inputSchema: SpecPromptSchema
    },
    async ({ projectRoot, specsDir, prompt, title, overwrite }) =>
      withSpecContext(guard, async () =>
        textResult(renderSpecResult("已创建 Active Spec", await createSpecFromPrompt({ projectRoot, specsDir, prompt, title, overwrite })))
      )
  );

  server.registerTool(
    "spec_todo",
    {
      description: specContextRequiredDescription("Create a lightweight executable TODO spec."),
      inputSchema: SpecPromptSchema
    },
    async ({ projectRoot, specsDir, prompt, title, overwrite }) =>
      withSpecContext(guard, async () =>
        textResult(renderSpecResult("已创建 TODO Spec", await createTodoFromPrompt({ projectRoot, specsDir, prompt, title, overwrite })))
      )
  );

  server.registerTool(
    "spec_checkpoint",
    {
      description: specContextRequiredDescription("Record implementation progress back into a spec or TODO file, including completed TODOs, changed files, verification, actual behavior notes, risks, and blockers."),
      inputSchema: SpecCheckpointSchema
    },
    async ({ projectRoot, specsDir, file, summary, completedTodos, changedFiles, verification, behaviorRecords, risks, blockers, note }) =>
      withSpecContext(guard, async () =>
        textResult(renderSpecResult("Spec Checkpoint 已记录", await recordSpecCheckpoint({ projectRoot, specsDir, file, summary, completedTodos, changedFiles, verification, behaviorRecords, risks, blockers, note })))
      )
  );

  server.registerTool(
    "spec_review_result",
    {
      description: specContextRequiredDescription("Write a structured implementation result back into a spec, including completed and incomplete TODOs, verification, actual behavior notes, changed files, risks, and blockers."),
      inputSchema: SpecReviewResultSchema
    },
    async ({ projectRoot, specsDir, file, summary, completedTodos, incompleteTodos, changedFiles, verification, behaviorRecords, risks, blockers, note }) =>
      withSpecContext(guard, async () =>
        textResult(renderReviewResult("Spec Review Result 已记录", await recordSpecReviewResult({ projectRoot, specsDir, file, summary, completedTodos, incompleteTodos, changedFiles, verification, behaviorRecords, risks, blockers, note })))
      )
  );

  server.registerTool(
    "spec_done",
    {
      description: specContextRequiredDescription("Move an implemented spec into specs/done after code and tests have been verified, preserving final actual behavior notes."),
      inputSchema: SpecDoneSchema
    },
    async ({ projectRoot, specsDir, file, behaviorRecords, note }) =>
      withSpecContext(guard, async () =>
        textResult(renderSpecResult("Spec 已完成", await markSpecDone({ projectRoot, specsDir, file, behaviorRecords, note })))
      )
  );
}
