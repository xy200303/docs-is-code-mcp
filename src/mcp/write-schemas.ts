/* Shared schemas for write-capable MCP spec tools. */
import { z } from "zod";
import { RootSchema, VerificationSchema } from "./tool-schema.js";

const BehaviorRecordSchema = z.object({
  scenario: z.string().min(1).describe("Chinese scenario name, such as normal flow, permission denied, default config, or empty input."),
  condition: z.string().min(1).describe("Chinese condition or branch predicate."),
  result: z.string().min(1).describe("Chinese observable result."),
  defaultBehavior: z.string().optional().describe("Chinese default parameter/config behavior."),
  edgeCase: z.string().optional().describe("Chinese edge-case or boundary handling result."),
  verification: z.string().optional().describe("Verification command or evidence."),
  relatedFiles: z.array(z.string()).default([]).describe("Related source, test, or spec files.")
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
  file: z.string().describe("Spec or TODO file path to update, usually under specs/active or specs/todo."),
  summary: z.string().min(1).describe("Concise implementation summary."),
  completedTodos: z.array(z.string()).default([]).describe("TODO texts completed in this checkpoint. Matching unchecked tasks will be marked [x]."),
  changedFiles: z.array(z.string()).default([]),
  verification: z.array(VerificationSchema).default([]),
  behaviorRecords: z.array(BehaviorRecordSchema).default([]).describe("Structured Chinese actual behavior records."),
  risks: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  note: z.string().optional()
});

export const SpecReviewResultSchema = RootSchema.extend({
  file: z.string().describe("Spec or TODO file path to update."),
  summary: z.string().min(1),
  completedTodos: z.array(z.string()).default([]),
  incompleteTodos: z.array(z.string()).default([]),
  changedFiles: z.array(z.string()).default([]),
  verification: z.array(VerificationSchema).default([]),
  behaviorRecords: z.array(BehaviorRecordSchema).default([]).describe("Structured Chinese actual behavior records."),
  risks: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  note: z.string().optional()
});

export const SpecDoneSchema = RootSchema.extend({
  file: z.string().describe("Spec file path, usually under specs/active."),
  behaviorRecords: z.array(BehaviorRecordSchema).default([]).describe("Structured Chinese final behavior contract rows preserved in specs/done."),
  note: z.string().optional()
});
