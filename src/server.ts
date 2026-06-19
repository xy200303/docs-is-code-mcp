import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  createSpecFromPrompt,
  generateAgentsFile,
  createTodoFromPrompt,
  generateSpecsFromSource,
  initSpecs,
  listSpecs,
  markSpecDone,
  recordSpecCheckpoint,
  recordSpecReviewResult,
  specContext
} from "./spec/service.js";
import type { AgentFileResult, GeneratedFile, ReviewResult, SpecItem, SpecResult } from "./spec/types.js";

const RootSchema = z.object({
  projectRoot: z.string().describe("Absolute or relative project root path."),
  specsDir: z.string().default("specs").describe("Specs directory relative to project root.")
});

const VerificationSchema = z.object({
  command: z.string().min(1),
  status: z.enum(["passed", "failed", "not-run"]),
  note: z.string().optional()
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

function renderReviewResult(title: string, result: ReviewResult): string {
  return [
    `# ${title}`,
    "",
    `文件：${code(result.file)}`,
    `摘要：${result.summary}`,
    "",
    "## Completed TODOs",
    "",
    ...(result.completedTodos.length ? result.completedTodos.map((item) => `- ${item}`) : ["- 无"]),
    "",
    "## Incomplete TODOs",
    "",
    ...(result.incompleteTodos.length ? result.incompleteTodos.map((item) => `- ${item}`) : ["- 无"]),
    "",
    "## Changed Files",
    "",
    ...(result.changedFiles.length ? result.changedFiles.map((item) => `- \`${item}\``) : ["- 未记录"]),
    "",
    "## Verification",
    "",
    ...(result.verification.length
      ? result.verification.map((item) => `- ${item.status} \`${item.command}\`${item.note ? `（${item.note}）` : ""}`)
      : ["- 无"]),
    "",
    "## Risks",
    "",
    ...(result.risks.length ? result.risks.map((item) => `- ${item}`) : ["- 无"]),
    "",
    "## Blockers",
    "",
    ...(result.blockers.length ? result.blockers.map((item) => `- ${item}`) : ["- 无"])
  ].join("\n");
}

function renderAgentFileResult(title: string, result: AgentFileResult): string {
  return [
    `# ${title}`,
    "",
    `项目：${code(result.projectRoot)}`,
    `文件：${code(result.file)}`,
    "",
    "## 文件",
    "",
    ...(result.files.length ? result.files.map(fileStatus) : ["- 无文件变更"]),
    "",
    "## 下一步",
    "",
    ...result.nextSteps.map((step) => `- ${step}`)
  ].join("\n");
}

export function createSpecCodingServer(): McpServer {
  const server = new McpServer({
    name: "spec-coding",
    version: "0.2.1"
  });

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
    "spec_generate_agents",
    {
      description: "Generate or update AGENTS.md in the project root with the project's engineering principles and operating rules.",
      inputSchema: RootSchema.extend({
        projectName: z.string().optional(),
        overwrite: z.boolean().default(false)
      })
    },
    async ({ projectRoot, projectName, overwrite }) =>
      textResult(renderAgentFileResult("AGENTS.md 已生成", await generateAgentsFile({ projectRoot, projectName, overwrite })))
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
    "spec_todo",
    {
      description: "Create a lightweight executable TODO spec. Models must follow unchecked TODO items in order when spec_context is called.",
      inputSchema: RootSchema.extend({
        prompt: z.string().min(1).describe("TODO text. Each non-empty line becomes an unchecked task."),
        title: z.string().optional(),
        overwrite: z.boolean().default(false)
      })
    },
    async ({ projectRoot, specsDir, prompt, title, overwrite }) =>
      textResult(renderSpecResult("已创建 TODO Spec", await createTodoFromPrompt({ projectRoot, specsDir, prompt, title, overwrite })))
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
    "spec_checkpoint",
    {
      description: "Record implementation progress back into a spec or TODO file, including completed TODOs, changed files, verification, risks, and blockers.",
      inputSchema: RootSchema.extend({
        file: z.string().describe("Spec or TODO file path to update, usually under specs/active or specs/todo."),
        summary: z.string().min(1).describe("Concise implementation summary."),
        completedTodos: z.array(z.string()).default([]).describe("TODO texts completed in this checkpoint. Matching unchecked tasks will be marked [x]."),
        changedFiles: z.array(z.string()).default([]),
        verification: z.array(VerificationSchema).default([]),
        risks: z.array(z.string()).default([]),
        blockers: z.array(z.string()).default([]),
        note: z.string().optional()
      })
    },
    async ({ projectRoot, specsDir, file, summary, completedTodos, changedFiles, verification, risks, blockers, note }) =>
      textResult(renderSpecResult("Spec Checkpoint 已记录", await recordSpecCheckpoint({ projectRoot, specsDir, file, summary, completedTodos, changedFiles, verification, risks, blockers, note })))
  );

  server.registerTool(
    "spec_review_result",
    {
      description: "Write a structured implementation result back into a spec, including completed and incomplete TODOs, verification, changed files, risks, and blockers.",
      inputSchema: RootSchema.extend({
        file: z.string().describe("Spec or TODO file path to update."),
        summary: z.string().min(1),
        completedTodos: z.array(z.string()).default([]),
        incompleteTodos: z.array(z.string()).default([]),
        changedFiles: z.array(z.string()).default([]),
        verification: z.array(VerificationSchema).default([]),
        risks: z.array(z.string()).default([]),
        blockers: z.array(z.string()).default([]),
        note: z.string().optional()
      })
    },
    async ({ projectRoot, specsDir, file, summary, completedTodos, incompleteTodos, changedFiles, verification, risks, blockers, note }) =>
      textResult(renderReviewResult("Spec Review Result 已记录", await recordSpecReviewResult({ projectRoot, specsDir, file, summary, completedTodos, incompleteTodos, changedFiles, verification, risks, blockers, note })))
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
