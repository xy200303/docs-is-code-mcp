/* Shared schemas for write-capable MCP spec tools. */
import { z } from "zod";
import { RootSchema, VerificationSchema } from "./tool-schema.js";

const BehaviorRecordSchema = z.object({
  scenario: z.string().min(1).describe("Scenario name."),
  condition: z.string().min(1).describe("Branch condition."),
  result: z.string().min(1).describe("Observed result."),
  trigger: z.string().optional().describe("User/system trigger and runtime entrypoint."),
  input: z.string().optional().describe("Input data, configuration, state, and source."),
  steps: z.array(z.string()).default([]).describe("End-to-end execution steps."),
  output: z.string().optional().describe("Returned value, UI state, persisted data, or emitted event."),
  sideEffects: z.string().optional().describe("External side effects such as writes, network calls, scheduled work, or no side effect."),
  defaultBehavior: z.string().optional().describe("Default behavior, including defaults chosen by the model, omitted inputs, configuration fallback, and unchanged baseline behavior."),
  edgeCase: z.string().optional().describe("Edge handling, including failure, boundary, permission, state, exception, null/empty, and other non-happy paths."),
  verification: z.string().optional().describe("Verification evidence."),
  relatedFiles: z.array(z.string()).default([]).describe("Related files.")
});

export const WriteTextSchema = RootSchema.extend({
  projectName: z.string().optional(),
  overwrite: z.boolean().default(false)
});

export const SpecPromptSchema = WriteTextSchema.extend({
  prompt: z.string().min(1),
  title: z.string().optional()
});

export const SpecCheckpointSchema = RootSchema.extend({
  file: z.string().describe("Spec/TODO file path."),
  summary: z.string().min(1).describe("Implementation summary."),
  completedTodos: z.array(z.string()).default([]).describe("Completed TODO texts."),
  changedFiles: z.array(z.string()).default([]),
  verification: z.array(VerificationSchema).default([]),
  behaviorRecords: z.array(BehaviorRecordSchema).default([]).describe("Actual behavior records."),
  risks: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  note: z.string().optional()
});

export const SpecReviewResultSchema = RootSchema.extend({
  file: z.string().describe("Spec/TODO file path."),
  summary: z.string().min(1),
  completedTodos: z.array(z.string()).default([]),
  incompleteTodos: z.array(z.string()).default([]),
  changedFiles: z.array(z.string()).default([]),
  verification: z.array(VerificationSchema).default([]),
  behaviorRecords: z.array(BehaviorRecordSchema).default([]).describe("Actual behavior records."),
  risks: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  note: z.string().optional()
});

export const SpecDoneSchema = RootSchema.extend({
  file: z.string().describe("Spec file path."),
  behaviorRecords: z.array(BehaviorRecordSchema).default([]).describe("Final behavior contract for user review. Cover the whole feature across all known normal, failure, boundary, permission, state, exception, null/empty, and default behavior cases; include defaults chosen by the model."),
  note: z.string().optional()
});
