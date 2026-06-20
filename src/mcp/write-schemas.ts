/* Shared schemas for write-capable MCP spec tools. */
import { z } from "zod";
import { RootSchema, VerificationSchema } from "./tool-schema.js";

const BehaviorRecordSchema = z.object({
  scenario: z.string().min(1).describe("Scenario name."),
  condition: z.string().min(1).describe("Branch condition."),
  result: z.string().min(1).describe("Observed result."),
  defaultBehavior: z.string().optional().describe("Default behavior."),
  edgeCase: z.string().optional().describe("Edge handling."),
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
  behaviorRecords: z.array(BehaviorRecordSchema).default([]).describe("Final behavior records."),
  note: z.string().optional()
});
