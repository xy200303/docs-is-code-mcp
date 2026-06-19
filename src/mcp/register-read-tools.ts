/* Read-only MCP tools for spec inspection and context generation. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { generateSpecsFromSource, initSpecs, listSpecs } from "../spec/scaffold.js";
import { specContext } from "../spec/context.js";
import { renderSpecItems, renderSpecResult } from "./render-spec.js";
import { textResult } from "./render-core.js";
import { RootSchema } from "./tool-schema.js";
import type { SessionGuardState } from "../spec/types.js";
import { markSpecContextSeen } from "./session-guard.js";

const SPEC_CONTEXT_GATE_DESCRIPTION = "This call unlocks write operations in the current session; non-trivial code or doc changes must call spec_context first, read this output, and only then start implementation. If you skip spec_context, write tools will fail fast with a clear guard error.";

const ReadContextSchema = RootSchema.extend({
  files: z.array(z.string()).default([]).describe("Optional spec files to include. Defaults to all specs/active/*.md."),
  maxSpecChars: z.number().int().positive().default(8000),
  candidateFileLimit: z.number().int().positive().default(40),
  contextMode: z.enum(["workflow", "hints", "full"]).default("workflow").describe("workflow omits source scans by default; hints adds lightweight search targets; full adds expanded source hints.")
});

export function registerReadTools(server: McpServer, guard: SessionGuardState): void {
  server.registerTool(
    "spec_init",
    {
      description: "Initialize a lightweight spec-coding directory with review, active, todo, done, and templates folders.",
      inputSchema: RootSchema.extend({
        projectName: z.string().optional(),
        overwrite: z.boolean().default(false)
      })
    },
    async ({ projectRoot, specsDir, projectName, overwrite }) =>
      textResult(renderSpecResult("Spec Coding 初始化完成", await initSpecs({ projectRoot, specsDir, projectName, overwrite })))
  );

  server.registerTool(
    "spec_generate_from_source",
    {
      description: "Generate source-derived current-code specs from an existing project so users can review the system before future development.",
      inputSchema: RootSchema.extend({
        projectName: z.string().optional(),
        overwrite: z.boolean().default(false),
        includePatterns: z.array(z.string()).default([]),
        excludePatterns: z.array(z.string()).default([]),
        maxFiles: z.number().int().positive().default(800)
      })
    },
    async ({ projectRoot, specsDir, projectName, overwrite, includePatterns, excludePatterns, maxFiles }) =>
      textResult(renderSpecResult("已从源码反推 Specs", await generateSpecsFromSource({ projectRoot, specsDir, projectName, overwrite, includePatterns, excludePatterns, maxFiles })))
  );

  server.registerTool(
    "spec_list",
    {
      description: "List review, active, and done specs.",
      inputSchema: RootSchema
    },
    async ({ projectRoot, specsDir }) => {
      const result = await listSpecs({ projectRoot, specsDir });
      return textResult([
        "# Spec 列表",
        "",
        `项目：${projectRoot}`,
        `Specs：${specsDir}`,
        "",
        ...renderSpecItems("Active", result.active),
        "",
        ...renderSpecItems("TODO", result.todo),
        "",
        ...renderSpecItems("Review", result.review),
        "",
        ...renderSpecItems("Done", result.done)
      ].join("\n"));
    }
  );

  server.registerTool(
    "spec_context",
    {
      description: `Return model-ready context for implementing active specs or selected review specs. ${SPEC_CONTEXT_GATE_DESCRIPTION}`,
      inputSchema: ReadContextSchema
    },
    async ({ projectRoot, specsDir, files, maxSpecChars, candidateFileLimit, contextMode }) => {
      const context = await specContext({ projectRoot, specsDir, files, maxSpecChars, candidateFileLimit, contextMode });
      markSpecContextSeen(guard);
      return textResult(context.markdown);
    }
  );
}
