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
  return `${action} Requires prior spec_context.`;
}

export function registerWriteTools(server: McpServer, guard: SessionGuardState): void {
  server.registerTool(
    "spec_generate_agents",
    {
      description: specContextRequiredDescription("Advanced maintenance helper. Prefer spec_bootstrap. Regenerates AGENTS.md and CLAUDE.md."),
      inputSchema: WriteTextSchema
    },
    async ({ projectRoot, projectName, overwrite }) =>
      withSpecContext(guard, async () =>
        textResult(renderAgentFileResult("AGENTS.md / CLAUDE.md 已生成", await generateAgentsFile({ projectRoot, projectName, overwrite })))
      )
  );

  server.registerTool(
    "spec_create",
    {
      description: specContextRequiredDescription("Create an active feature spec."),
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
      description: specContextRequiredDescription("Create a lightweight TODO spec."),
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
      description: specContextRequiredDescription("Record checkpoint results."),
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
      description: specContextRequiredDescription("Record review or handoff results."),
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
      description: specContextRequiredDescription("Archive verified specs into done. Do not use for partial work. Final behaviorRecords must cover the whole feature for user review, including defaults chosen by the model."),
      inputSchema: SpecDoneSchema
    },
    async ({ projectRoot, specsDir, file, behaviorRecords, note }) =>
      withSpecContext(guard, async () =>
        textResult(renderSpecResult("Spec 已完成", await markSpecDone({ projectRoot, specsDir, file, behaviorRecords, note })))
      )
  );
}
