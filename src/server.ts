import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  createSpecFromPrompt,
  generateSpecsFromSource,
  initSpecs,
  listSpecs,
  markSpecDone,
  specContext
} from "./spec/service.js";
import type { GeneratedFile, SpecItem, SpecResult } from "./spec/types.js";

const RootSchema = z.object({
  projectRoot: z.string().describe("Absolute or relative project root path."),
  specsDir: z.string().default("specs").describe("Specs directory relative to project root.")
});

function textResult(markdown: string) {
  return {
    content: [
      {
        type: "text" as const,
        text: `${markdown.trimEnd()}\n`
      }
    ]
  };
}

function code(value: string | undefined): string {
  return value ? `\`${value}\`` : "`无`";
}

function fileStatus(file: GeneratedFile): string {
  const label = file.status === "created" ? "创建" : file.status === "updated" ? "更新" : "跳过";
  return `- ${label} ${code(file.path)}${file.reason ? `（${file.reason}）` : ""}`;
}

function renderSpecResult(title: string, result: SpecResult): string {
  const created = result.files.filter((file) => file.status === "created").length;
  const updated = result.files.filter((file) => file.status === "updated").length;
  const skipped = result.files.filter((file) => file.status === "skipped").length;
  return [
    `# ${title}`,
    "",
    `项目：${code(result.projectRoot)}`,
    `Specs：${code(result.specsDir)}`,
    `文件变更：创建 ${created} 个，更新 ${updated} 个，跳过 ${skipped} 个。`,
    "",
    "## 文件",
    "",
    ...(result.files.length ? result.files.slice(0, 100).map(fileStatus) : ["- 无文件变更"]),
    result.files.length > 100 ? `- 其余 ${result.files.length - 100} 个文件未展开。` : "",
    "",
    "## Specs",
    "",
    ...(result.specs.length ? result.specs.map((file) => `- ${code(file)}`) : ["- 无"]),
    "",
    "## 下一步",
    "",
    ...result.nextSteps.map((step) => `- ${step}`)
  ].filter(Boolean).join("\n");
}

function renderSpecItems(title: string, items: SpecItem[]): string[] {
  return [
    `## ${title}`,
    "",
    ...(items.length
      ? items.map((item) => `- ${code(item.file)}：${item.title}（status: ${item.status}, source: ${item.source}）`)
      : ["- 无"])
  ];
}

export function createSpecCodingServer(): McpServer {
  const server = new McpServer({
    name: "spec-coding",
    version: "0.2.0"
  });

  server.registerTool(
    "spec_init",
    {
      description: "Initialize a lightweight spec-coding directory with review, active, done, and templates folders.",
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
    "spec_create",
    {
      description: "Create an active spec from a user prompt. The user can edit the generated Markdown before implementation.",
      inputSchema: RootSchema.extend({
        prompt: z.string().min(1),
        title: z.string().optional(),
        overwrite: z.boolean().default(false)
      })
    },
    async ({ projectRoot, specsDir, prompt, title, overwrite }) =>
      textResult(renderSpecResult("已创建 Active Spec", await createSpecFromPrompt({ projectRoot, specsDir, prompt, title, overwrite })))
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
        `项目：${code(result.projectRoot)}`,
        `Specs：${code(result.specsDir)}`,
        "",
        ...renderSpecItems("Active", result.active),
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
      description: "Return model-ready context for implementing active specs or selected review specs.",
      inputSchema: RootSchema.extend({
        files: z.array(z.string()).default([]).describe("Optional spec files to include. Defaults to all specs/active/*.md."),
        maxSpecChars: z.number().int().positive().default(8000),
        candidateFileLimit: z.number().int().positive().default(40)
      })
    },
    async ({ projectRoot, specsDir, files, maxSpecChars, candidateFileLimit }) => {
      const context = await specContext({ projectRoot, specsDir, files, maxSpecChars, candidateFileLimit });
      return textResult(context.markdown);
    }
  );

  server.registerTool(
    "spec_done",
    {
      description: "Move an implemented spec into specs/done after code and tests have been verified.",
      inputSchema: RootSchema.extend({
        file: z.string().describe("Spec file path, usually under specs/active."),
        note: z.string().optional()
      })
    },
    async ({ projectRoot, specsDir, file, note }) =>
      textResult(renderSpecResult("Spec 已完成", await markSpecDone({ projectRoot, specsDir, file, note })))
  );

  return server;
}

export async function serveStdio(): Promise<void> {
  const server = createSpecCodingServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
