import { promises as fs } from "node:fs";
import path from "node:path";
import { specsReadme, reviewIndex, sourceInventory, sourceReviewSpec, specTemplate, userPromptSpec } from "./templates.js";
import type { GeneratedFile, SpecContext, SpecItem, SpecResult } from "./types.js";
import { scanSource, specCandidatesFromSource } from "./source-scan.js";
import { ensureDir, listMarkdownFiles, listTextFiles, nowIso, pathExists, relativePosix, slugifyAscii, unique } from "../shared/utils.js";

async function writeFileIfChanged(root: string, relativeFile: string, content: string, overwrite: boolean, files: GeneratedFile[]): Promise<void> {
  const absolute = path.join(root, relativeFile);
  await ensureDir(path.dirname(absolute));
  const normalized = content.trimEnd() + "\n";
  if (await pathExists(absolute)) {
    const old = await fs.readFile(absolute, "utf8");
    if (old === normalized) {
      files.push({ path: relativePosix(root, absolute), status: "skipped", reason: "内容未变化" });
      return;
    }
    if (!overwrite) {
      files.push({ path: relativePosix(root, absolute), status: "skipped", reason: "文件已存在且 overwrite=false" });
      return;
    }
    await fs.writeFile(absolute, normalized, "utf8");
    files.push({ path: relativePosix(root, absolute), status: "updated" });
    return;
  }
  await fs.writeFile(absolute, normalized, "utf8");
  files.push({ path: relativePosix(root, absolute), status: "created" });
}

function inferProjectName(projectRoot: string, explicit?: string): string {
  if (explicit?.trim()) return explicit.trim();
  return path.basename(projectRoot) || "未命名系统";
}

function inferTitle(prompt: string): string {
  const firstLine = prompt.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  if (!firstLine) return "未命名 Spec";
  return firstLine.replace(/^#+\s*/, "").slice(0, 48);
}

export async function initSpecs(input: { projectRoot: string; specsDir?: string; projectName?: string; overwrite?: boolean }): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const overwrite = input.overwrite ?? false;
  const projectName = inferProjectName(root, input.projectName);
  const files: GeneratedFile[] = [];

  await ensureDir(path.join(root, specsDir, "review"));
  await ensureDir(path.join(root, specsDir, "active"));
  await ensureDir(path.join(root, specsDir, "done"));
  await ensureDir(path.join(root, specsDir, "templates"));
  await writeFileIfChanged(root, path.join(specsDir, "README.md"), specsReadme(projectName), overwrite, files);
  await writeFileIfChanged(root, path.join(specsDir, "templates", "feature.md"), specTemplate("feature"), overwrite, files);
  await writeFileIfChanged(root, path.join(specsDir, "templates", "bugfix.md"), specTemplate("bugfix"), overwrite, files);
  await writeFileIfChanged(root, path.join(specsDir, "templates", "removal.md"), specTemplate("removal"), overwrite, files);

  return {
    projectRoot: root,
    specsDir,
    files,
    specs: [],
    nextSteps: [
      `在 ${specsDir}/active/ 中创建或修改 spec。`,
      "调用 spec_context 让 Codex 按 active specs 修改代码和测试。"
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
  await writeFileIfChanged(root, path.join(specsDir, "review", "source-inventory.md"), sourceInventory(summary, nowIso()), overwrite, files);
  await writeFileIfChanged(root, path.join(specsDir, "review", "index.md"), reviewIndex(specsDir, candidates), overwrite, files);

  const specs: string[] = [];
  for (const candidate of candidates) {
    const relative = path.join(specsDir, "review", `${candidate.domain}-${candidate.name}.md`);
    specs.push(relativePosix(root, path.join(root, relative)));
    await writeFileIfChanged(root, relative, sourceReviewSpec(projectName, candidate), overwrite, files);
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
  const slug = slugifyAscii(title, "spec");
  const files: GeneratedFile[] = [];
  await initSpecs({ projectRoot: root, specsDir });
  const relative = path.join(specsDir, "active", `${new Date().toISOString().slice(0, 10)}-${slug}.md`);
  await writeFileIfChanged(root, relative, userPromptSpec(title, input.prompt), input.overwrite ?? false, files);
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

function readMeta(text: string, key: string, fallback: string): string {
  const pattern = new RegExp(`^-\\s*${key}:\\s*(.+?)\\s*$`, "im");
  return pattern.exec(text)?.[1]?.trim() ?? fallback;
}

function titleFromMarkdown(text: string, fallback: string): string {
  return /^#\s+(.+?)\s*$/m.exec(text)?.[1]?.trim() ?? fallback;
}

async function listSpecsIn(root: string, specsDir: string, subdir: string): Promise<SpecItem[]> {
  const dir = path.join(root, specsDir, subdir);
  const files = await listMarkdownFiles(dir);
  const items: SpecItem[] = [];
  for (const absolute of files) {
    const text = await fs.readFile(absolute, "utf8");
    const stat = await fs.stat(absolute);
    items.push({
      file: relativePosix(root, absolute),
      title: titleFromMarkdown(text, path.basename(absolute, ".md")),
      status: readMeta(text, "status", subdir),
      source: readMeta(text, "source", subdir),
      updatedAt: stat.mtime.toISOString()
    });
  }
  return items.sort((a, b) => a.file.localeCompare(b.file));
}

export async function listSpecs(input: { projectRoot: string; specsDir?: string }): Promise<{ projectRoot: string; specsDir: string; active: SpecItem[]; review: SpecItem[]; done: SpecItem[] }> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  return {
    projectRoot: root,
    specsDir,
    active: await listSpecsIn(root, specsDir, "active"),
    review: await listSpecsIn(root, specsDir, "review"),
    done: await listSpecsIn(root, specsDir, "done")
  };
}

async function findCandidateFiles(root: string, specs: Array<SpecItem & { text: string }>, limit: number): Promise<string[]> {
  const words = unique(specs.flatMap((spec) => `${spec.title} ${spec.text}`.match(/[\p{L}\p{N}_-]{2,}/gu) ?? []))
    .filter((word) => !["status", "source", "active", "draft", "review", "spec", "测试", "功能", "实现"].includes(word))
    .slice(0, 80);
  const files = await listTextFiles(root, {
    maxFiles: 1500,
    excludeDirs: ["node_modules", ".git", "dist", "build", "coverage", "specs", "docs"],
    extensions: new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".java", ".vue", ".svelte"])
  });
  return files
    .map((absolute) => relativePosix(root, absolute))
    .map((file) => ({
      file,
      score: words.reduce((score, word) => score + (file.toLowerCase().includes(word.toLowerCase()) ? Math.min(word.length, 12) : 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))
    .slice(0, limit)
    .map((item) => item.file);
}

export async function specContext(input: { projectRoot: string; specsDir?: string; files?: string[]; maxSpecChars?: number; candidateFileLimit?: number }): Promise<SpecContext> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const maxSpecChars = input.maxSpecChars ?? 8000;
  const requested = input.files ?? [];
  const activeSpecs = await listSpecsIn(root, specsDir, "active");
  const reviewSpecs = await listSpecsIn(root, specsDir, "review");
  const selectedBase = requested.length
    ? [...activeSpecs, ...reviewSpecs].filter((item) => requested.some((file) => item.file === file || item.file.endsWith(file)))
    : activeSpecs;
  const selectedSpecs = [];
  for (const item of selectedBase) {
    const text = await fs.readFile(path.join(root, item.file), "utf8");
    selectedSpecs.push({
      ...item,
      text: text.length > maxSpecChars ? `${text.slice(0, maxSpecChars).trimEnd()}\n\n...（已截断）` : text
    });
  }
  const candidateFiles = await findCandidateFiles(root, selectedSpecs, input.candidateFileLimit ?? 40);
  const instructions = [
    "把 selected specs 作为本次开发的唯一需求源头。",
    "先阅读 spec 的目标、行为规则、验收标准和代码线索，再搜索代码。",
    "按 spec 更新实现和测试；不要根据旧对话记忆扩展范围。",
    "如果 spec 涉及金额、权限、安全、删除、隐私、结算等高风险且描述不完整，先要求用户确认。",
    "验证通过后调用 spec_done 或按用户要求归档。"
  ];
  const markdown = [
    "# Spec Coding Context",
    "",
    `项目：\`${root}\``,
    `Specs：\`${specsDir}\``,
    `选中 spec：${selectedSpecs.length}`,
    "",
    "## Selected Specs",
    "",
    ...(selectedSpecs.length
      ? selectedSpecs.map((spec, index) => [`### ${index + 1}. ${spec.file}`, "", "```md", spec.text, "```"].join("\n"))
      : ["当前没有 active spec。请先创建或移动 spec 到 active/。"]),
    "",
    "## Candidate Files",
    "",
    ...(candidateFiles.length ? candidateFiles.map((file) => `- \`${file}\``) : ["- 未仅凭文件名找到候选文件，请按 spec 关键词全文搜索源码。"]),
    "",
    "## Instructions",
    "",
    ...instructions.map((item) => `- ${item}`)
  ].join("\n");
  return {
    projectRoot: root,
    specsDir,
    activeSpecs,
    reviewSpecs,
    selectedSpecs,
    candidateFiles,
    instructions,
    markdown
  };
}

export async function markSpecDone(input: { projectRoot: string; specsDir?: string; file: string; note?: string }): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const source = path.resolve(root, input.file);
  if (!source.startsWith(root)) throw new Error("Spec file must be inside project root.");
  const doneDir = path.join(root, specsDir, "done");
  await ensureDir(doneDir);
  const target = path.join(doneDir, path.basename(source));
  let text = await fs.readFile(source, "utf8");
  text += [
    "",
    "## Done",
    "",
    `- doneAt: ${nowIso()}`,
    input.note ? `- note: ${input.note}` : "- note: verified by user/Codex"
  ].join("\n");
  await fs.writeFile(target, text.trimEnd() + "\n", "utf8");
  await fs.rm(source);
  return {
    projectRoot: root,
    specsDir,
    files: [{ path: relativePosix(root, target), status: "created" }],
    specs: [relativePosix(root, target)],
    nextSteps: ["Spec 已归档到 done/。"]
  };
}
