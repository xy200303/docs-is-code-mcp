/* Shared input schemas for spec-coding MCP tools. */
import { z } from "zod";

export const RootSchema = z.object({
  projectRoot: z.string().describe("Absolute or relative project root path."),
  specsDir: z.string().default("specs").describe("Specs directory relative to project root.")
});

export const VerificationSchema = z.object({
  command: z.string().min(1),
  status: z.enum(["passed", "failed", "not-run"]),
  note: z.string().optional()
});
