/* Spec scaffold generation for README, templates, prompt specs, TODO specs, and source-derived review specs. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { agentsMd, specsReadme } from "../templates/agents.js";
import { reviewIndex, sourceInventory, sourceReviewSpec, specTemplate } from "../templates/spec-documents.js";
import { todoSpec, userPromptSpec } from "../templates/prompt-documents.js";
import type { AgentFileResult, GeneratedFile, SpecItem, SpecResult } from "./types.js";
import { scanSource, specCandidatesFromSource } from "./source-scan.js";
import { inferProjectName, inferSpecFileName, inferTitle, inferTodoFileName, listSpecsIn, timestampedMarkdownFile } from "./spec-files.js";
import { writeTextFile } from "./file-writers.js";
import { nowIso, relativePosix } from "../shared/utils.js";

export async function initSpecs(input: { projectRoot: string; specsDir?: string; projectName?: string; overwrite?: boolean }): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const overwrite = input.overwrite ?? false;
  const projectName = inferProjectName(root, input.projectName);
  const files: GeneratedFile[] = [];

  await writeTextFile(root, path.join(specsDir, "README.md"), specsReadme(projectName), overwrite, files);
  await writeTextFile(root, path.join(specsDir, "templates", "feature.md"), specTemplate("feature"), overwrite, files);
  await writeTextFile(root, path.join(specsDir, "templates", "bugfix.md"), specTemplate("bugfix"), overwrite, files);
  await writeTextFile(root, path.join(specsDir, "templates", "removal.md"), specTemplate("removal"), overwrite, files);

  return {
    projectRoot: root,
    specsDir,
    files,
    specs: [],
    nextSteps: [
      `在 ${specsDir}/active/ 中创建或修改 spec，也可以把短任务放到 ${specsDir}/todo/。`,
      "调用 spec_context 让 Codex 按 active specs 和未完成 TODO 修改代码和测试。"
    ]
  };
}

export async function generateSpecsFromSource(input: {
  projectRoot: string;
  specsDir?: string;
  projectName?: string;
  overwrite?: boolean;
  includePatterns?: string[];
  excludePatterns?: string[];
  maxFiles?: number;
}): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const overwrite = input.overwrite ?? false;
  const projectName = inferProjectName(root, input.projectName);
  const files: GeneratedFile[] = [];

  await initSpecs({ projectRoot: root, specsDir, projectName, overwrite });
  const summary = await scanSource({
    root,
    includePatterns: input.includePatterns,
    excludePatterns: input.excludePatterns,
    maxFiles: input.maxFiles
  });
  const candidates = specCandidatesFromSource(summary);
  await writeTextFile(root, path.join(specsDir, "review", "source-inventory.md"), sourceInventory(summary, nowIso()), overwrite, files);
  await writeTextFile(root, path.join(specsDir, "review", "index.md"), reviewIndex(specsDir, candidates), overwrite, files);

  const specs: string[] = [];
  for (const candidate of candidates) {
    const relative = path.join(specsDir, "review", `${candidate.domain}-${candidate.name}.md`);
    specs.push(relativePosix(root, path.join(root, relative)));
    await writeTextFile(root, relative, sourceReviewSpec(projectName, candidate), overwrite, files);
  }

  return {
    projectRoot: root,
    specsDir,
    files,
    specs,
    source: summary,
    nextSteps: [
      `审阅 ${specsDir}/review/source-inventory.md 和 ${specsDir}/review/index.md。`,
      `修改 ${specsDir}/review/*.md，把源码反推内容改成真实业务 spec。`,
      `开发时把目标 spec 放到 ${specsDir}/active/，再调用 spec_context。`
    ]
  };
}

export async function createSpecFromPrompt(input: {
  projectRoot: string;
  specsDir?: string;
  prompt: string;
  title?: string;
  overwrite?: boolean;
}): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const title = input.title?.trim() || inferTitle(input.prompt);
  const slug = inferSpecFileName(title);
  const files: GeneratedFile[] = [];
  await initSpecs({ projectRoot: root, specsDir });
  const relative = path.join(specsDir, "active", timestampedMarkdownFile(new Date(), slug));
  await writeTextFile(root, relative, userPromptSpec(title, input.prompt), input.overwrite ?? false, files);
  return {
    projectRoot: root,
    specsDir,
    files,
    specs: [relativePosix(root, path.join(root, relative))],
    nextSteps: [
      `审阅并修改 ${relative}。`,
      "调用 spec_context 让 Codex 按该 spec 修改代码和测试。"
    ]
  };
}

export async function createTodoFromPrompt(input: {
  projectRoot: string;
  specsDir?: string;
  prompt: string;
  title?: string;
  overwrite?: boolean;
}): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const title = input.title?.trim() || inferTitle(input.prompt);
  const slug = inferTodoFileName(title);
  const files: GeneratedFile[] = [];
  await initSpecs({ projectRoot: root, specsDir });
  const relative = path.join(specsDir, "todo", timestampedMarkdownFile(new Date(), slug));
  await writeTextFile(root, relative, todoSpec(title, input.prompt), input.overwrite ?? false, files);
  return {
    projectRoot: root,
    specsDir,
    files,
    specs: [relativePosix(root, path.join(root, relative))],
    nextSteps: [
      `审阅并修改 ${relative}。`,
      "调用 spec_context 让 Codex 按未完成 TODO 顺序执行任务。"
    ]
  };
}

export async function generateAgentsFile(input: { projectRoot: string; projectName?: string; overwrite?: boolean }): Promise<AgentFileResult> {
  const root = path.resolve(input.projectRoot);
  const projectName = inferProjectName(root, input.projectName);
  const files: GeneratedFile[] = [];
  await writeTextFile(root, "AGENTS.md", agentsMd(projectName), input.overwrite ?? false, files);
  return {
    projectRoot: root,
    file: "AGENTS.md",
    files,
    nextSteps: [
      "把 AGENTS.md 放在项目根目录，作为模型的默认工程规范入口。",
      "必要时继续维护 specs/ 和 AGENTS.md 的一致性。"
    ]
  };
}

export async function listSpecs(input: { projectRoot: string; specsDir?: string }): Promise<{ projectRoot: string; specsDir: string; active: SpecItem[]; review: SpecItem[]; todo: SpecItem[]; done: SpecItem[] }> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  return {
    projectRoot: root,
    specsDir,
    active: await listSpecsIn(root, specsDir, "active"),
    review: await listSpecsIn(root, specsDir, "review"),
    todo: await listSpecsIn(root, specsDir, "todo"),
    done: await listSpecsIn(root, specsDir, "done")
  };
}
