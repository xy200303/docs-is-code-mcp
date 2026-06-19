/* Shared schemas for write-capable MCP spec tools. */
import { z } from "zod";
import { RootSchema, VerificationSchema } from "./tool-schema.js";

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
  risks: z.array(z.string()).default([]),
  blockers: z.array(z.string()).default([]),
  note: z.string().optional()
});

export const SpecDoneSchema = RootSchema.extend({
  file: z.string().describe("Spec file path, usually under specs/active."),
  note: z.string().optional()
});
