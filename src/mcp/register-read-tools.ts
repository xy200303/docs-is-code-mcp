/* Read-only MCP tools for spec inspection and context generation. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { bootstrapProject, generateSpecsFromSource, initSpecs, listSpecs } from "../spec/scaffold.js";
import { specContext } from "../spec/context.js";
import { ensureDefaultGuidanceFiles, guidanceItems, readGuidance } from "../spec/guidance.js";
import { workflowStateLines } from "../spec/context-markdown.js";
import { renderSpecItems, renderSpecResult } from "./render-spec.js";
import { textResult } from "./render-core.js";
import { RootSchema } from "./tool-schema.js";
import type { SessionGuardState } from "../spec/types.js";
import { markSpecContextSeen } from "./session-guard.js";
import { workflowRecommendationLines } from "../spec/workflow-next-step.js";
import { APP_VERSION } from "../shared/meta.js";
import { renderSkillsResult, searchSkills, UI_UX_PRO_MAX_SKILL_NAME, UI_UX_PRO_MAX_SKILL_SOURCE } from "../skills/skills-cli.js";

const SPEC_CONTEXT_GATE_DESCRIPTION = "Unlocks guarded write tools for this session.";

const ReadContextSchema = RootSchema.extend({
  files: z.array(z.string()).default([]).describe("Spec files to select."),
  maxSpecChars: z.number().int().positive().default(8000),
  candidateFileLimit: z.number().int().positive().default(40),
  contextMode: z.enum(["workflow", "hints", "full"]).default("workflow").describe("workflow, hints, or full indexes.")
});

const GuidanceReadSchema = RootSchema.extend({
  name: z.string().min(1).describe("Guidance name from spec_guidance_list, such as engineering, ui-ux, spec-writing, git-commit, pr-submit, or quality-review.")
});

const SkillsSearchSchema = RootSchema.extend({
  query: z.string().min(1).describe("Search query for skills.sh, such as ui/ux, testing, prisma, or react."),
  maxChars: z.number().int().positive().default(6000).describe("Maximum characters of cleaned search output to return.")
});

export function registerReadTools(server: McpServer, guard: SessionGuardState): void {
  server.registerTool(
    "spec_bootstrap",
    {
      description: "PRIMARY ENTRYPOINT. Use this before spec_init. Creates AGENTS and starter specs.",
      inputSchema: RootSchema.extend({
        projectName: z.string().optional(),
        projectKind: z.enum(["auto", "new", "existing"]).default("auto"),
        initialPrompt: z.string().optional(),
        overwrite: z.boolean().default(false),
        includePatterns: z.array(z.string()).default([]),
        excludePatterns: z.array(z.string()).default([]),
        maxFiles: z.number().int().positive().default(800)
      })
    },
    async ({ projectRoot, specsDir, projectName, projectKind, initialPrompt, overwrite, includePatterns, excludePatterns, maxFiles }) =>
      textResult(renderSpecResult("Spec Coding 项目引导完成", await bootstrapProject({ projectRoot, specsDir, projectName, projectKind, initialPrompt, overwrite, includePatterns, excludePatterns, maxFiles })))
  );

  server.registerTool(
    "spec_init",
    {
      description: "Advanced setup helper. Prefer spec_bootstrap. Creates specs templates.",
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
      description: "Advanced existing-project helper. Prefer spec_bootstrap. Regenerates source-review tasks.",
      inputSchema: RootSchema.extend({
        projectName: z.string().optional(),
        overwrite: z.boolean().default(false),
        includePatterns: z.array(z.string()).default([]),
        excludePatterns: z.array(z.string()).default([]),
        maxFiles: z.number().int().positive().default(800)
      })
    },
    async ({ projectRoot, specsDir, projectName, overwrite, includePatterns, excludePatterns, maxFiles }) =>
      textResult(renderSpecResult("已生成 AI 源码审查任务", await generateSpecsFromSource({ projectRoot, specsDir, projectName, overwrite, includePatterns, excludePatterns, maxFiles })))
  );

  server.registerTool(
    "spec_list",
    {
      description: "List spec workflow state.",
      inputSchema: RootSchema
    },
    async ({ projectRoot, specsDir }) => {
      const result = await listSpecs({ projectRoot, specsDir });
      return textResult([
        "# Spec 列表",
        "",
        `Spec Coding MCP：${APP_VERSION}`,
        `项目：${projectRoot}`,
        `Specs：${specsDir}`,
        "",
        ...workflowStateLines({
          activeCount: result.active.length,
          todoCount: result.todo.length,
          reviewCount: result.review.length,
          doneCount: result.done.length,
          selectedCount: 0,
          openTodoCount: 0
        }),
        ...renderSpecItems("Active", result.active),
        "",
        ...renderSpecItems("TODO", result.todo),
        "",
        ...renderSpecItems("Review", result.review),
        "",
        ...renderSpecItems("Done", result.done),
        "",
        ...workflowRecommendationLines({
          projectRoot,
          specsDir,
          activeSpecs: result.active,
          reviewSpecs: result.review,
          todoSpecs: result.todo,
          doneSpecs: result.done,
          openTodos: [],
          selectedSpecs: []
        }, "inspect")
      ].join("\n"));
    }
  );

  server.registerTool(
    "spec_guidance_list",
    {
      description: "List built-in editable guidance prompts. Use when the model needs reminders such as engineering, UI/UX, spec-writing, git commit, PR, or quality-review principles without bloating spec_context.",
      inputSchema: RootSchema
    },
    async ({ projectRoot, specsDir }) => {
      await ensureDefaultGuidanceFiles(projectRoot, specsDir);
      const items = guidanceItems(specsDir);
      return textResult([
        "# Guidance Prompts",
        "",
        `项目：${projectRoot}`,
        `Specs：${specsDir}`,
        "",
        "这些提示词是指导性原则，不替代当前 spec、TODO、用户要求或代码事实。",
        `用户可编辑 ${specsDir}/guidance/*.md；目录缺失、为空或缺少默认文件时，工具会自动补齐内置默认 Markdown。`,
        "",
        "## Available",
        "",
        ...items.map((item) => [
          `- \`${item.name}\` v${item.version} [${item.category}]：${item.title}；${item.purpose}（${item.file}）`,
          `  - description: ${item.description}`,
          `  - triggers: ${item.triggers.join(", ")}`,
          `  - appliesTo: ${item.appliesTo.join(", ")}`
        ].join("\n")),
        "",
        "## Next",
        "",
        "- 当需要校准某类原则或工作流时，调用 `spec_guidance_read` 并传入对应 name。"
      ].join("\n"));
    }
  );

  server.registerTool(
    "spec_guidance_read",
    {
      description: "Read one editable guidance prompt by name. The project file under specs/guidance wins over the built-in default.",
      inputSchema: GuidanceReadSchema
    },
    async ({ projectRoot, specsDir, name }) => {
      const item = await readGuidance({ projectRoot, specsDir, name });
      return textResult([
        `# ${item.title}`,
        "",
        `name: \`${item.name}\``,
        `version: \`${item.version}\``,
        `source: \`${item.source}\``,
        `file: \`${item.file}\``,
        `category: \`${item.category}\``,
        `description: ${item.description}`,
        `triggers: ${item.triggers.map((trigger) => `\`${trigger}\``).join(", ")}`,
        `appliesTo: ${item.appliesTo.map((target) => `\`${target}\``).join(", ")}`,
        "",
        "## Purpose",
        "",
        item.purpose,
        "",
        "## Prompt",
        "",
        item.content.trimEnd()
      ].join("\n"));
    }
  );

  server.registerTool(
    "spec_skills_search",
    {
      description: `Search skills.sh through the official skills CLI. Use this to discover task-specific skills before complex work; UI/UX work should prefer ${UI_UX_PRO_MAX_SKILL_NAME} from ${UI_UX_PRO_MAX_SKILL_SOURCE}.`,
      inputSchema: SkillsSearchSchema
    },
    async ({ query, maxChars }) =>
      textResult(renderSkillsResult("Skills Search", await searchSkills({ query, maxChars }), [
        "Install a selected skill with `spec_skills_install`.",
        `For UI/UX tasks, the recommended default is \`${UI_UX_PRO_MAX_SKILL_NAME}\`.`
      ]))
  );

  server.registerTool(
    "spec_context",
    {
      description: `REQUIRED BEFORE WRITES. Return compact spec workflow context. ${SPEC_CONTEXT_GATE_DESCRIPTION}`,
      inputSchema: ReadContextSchema
    },
    async ({ projectRoot, specsDir, files, maxSpecChars, candidateFileLimit, contextMode }) => {
      const context = await specContext({ projectRoot, specsDir, files, maxSpecChars, candidateFileLimit, contextMode });
      markSpecContextSeen(guard);
      return textResult(context.markdown);
    }
  );
}
