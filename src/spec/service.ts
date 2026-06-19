import { promises as fs } from "node:fs";
import path from "node:path";
import { agentsMd, engineeringConstraints, specsReadme, reviewIndex, sourceInventory, sourceReviewSpec, specTemplate, todoSpec, userPromptSpec } from "./templates.js";
import type { AgentFileResult, GeneratedFile, ReviewResult, SpecContext, SpecItem, SpecResult, TodoItem, VerificationItem } from "./types.js";
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

function resolveInsideRoot(root: string, file: string, label: string): string {
  const absolute = path.resolve(root, file);
  const relative = path.relative(root, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label} must be inside project root.`);
  return absolute;
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

async function writeRootFile(root: string, relativeFile: string, content: string, overwrite: boolean, files: GeneratedFile[]): Promise<void> {
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

export async function initSpecs(input: { projectRoot: string; specsDir?: string; projectName?: string; overwrite?: boolean }): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const overwrite = input.overwrite ?? false;
  const projectName = inferProjectName(root, input.projectName);
  const files: GeneratedFile[] = [];

  await ensureDir(path.join(root, specsDir, "review"));
  await ensureDir(path.join(root, specsDir, "active"));
  await ensureDir(path.join(root, specsDir, "todo"));
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
  const slug = slugifyAscii(title, "todo");
  const files: GeneratedFile[] = [];
  await initSpecs({ projectRoot: root, specsDir });
  const relative = path.join(specsDir, "todo", `${new Date().toISOString().slice(0, 10)}-${slug}.md`);
  await writeFileIfChanged(root, relative, todoSpec(title, input.prompt), input.overwrite ?? false, files);
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
  await writeRootFile(root, "AGENTS.md", agentsMd(projectName), input.overwrite ?? false, files);
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

function extractTodos(file: string, text: string): TodoItem[] {
  return text.split(/\r?\n/).flatMap((line, index) => {
    const task = /^\s*[-*]\s+\[([ xX])\]\s+(.+?)\s*$/.exec(line);
    if (task) {
      return [{
        file,
        text: task[2].trim(),
        checked: task[1].toLowerCase() === "x",
        line: index + 1
      }];
    }
    const plain = /^\s*[-*]\s+(?:TODO|todo|待办|任务)[:：]\s*(.+?)\s*$/.exec(line);
    if (plain) {
      return [{
        file,
        text: plain[1].trim(),
        checked: false,
        line: index + 1
      }];
    }
    return [];
  });
}

function normalizeTodoText(value: string): string {
  return value
    .trim()
    .replace(/^\[[ xX]\]\s*/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function markCompletedTodos(text: string, completedTodos: string[]): { text: string; matched: string[] } {
  const pending = new Set(completedTodos.map(normalizeTodoText).filter(Boolean));
  const matched = new Set<string>();
  const lines = text.split(/\r?\n/).map((line) => {
    const task = /^(\s*[-*]\s+)\[ \](\s+)(.+?)\s*$/.exec(line);
    if (!task) return line;
    const normalized = normalizeTodoText(task[3]);
    if (!pending.has(normalized)) return line;
    matched.add(normalized);
    return `${task[1]}[x]${task[2]}${task[3].trimEnd()}`;
  });
  return { text: lines.join("\n"), matched: [...matched] };
}

function bulletList(items: string[], empty: string): string[] {
  return items.length ? items.map((item) => `- ${item}`) : [`- ${empty}`];
}

function verificationLines(items: VerificationItem[]): string[] {
  if (!items.length) return ["- 未记录验证命令。"];
  return items.map((item) => {
    const note = item.note?.trim() ? `：${item.note.trim()}` : "";
    return `- ${item.status} \`${item.command}\`${note}`;
  });
}

async function readSpecsWithText(root: string, items: SpecItem[], maxChars: number): Promise<Array<SpecItem & { text: string }>> {
  const specs = [];
  for (const item of items) {
    const text = await fs.readFile(path.join(root, item.file), "utf8");
    specs.push({
      ...item,
      text: text.length > maxChars ? `${text.slice(0, maxChars).trimEnd()}\n\n...（已截断）` : text
    });
  }
  return specs;
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
  const todoSpecs = await listSpecsIn(root, specsDir, "todo");
  const selectedBase = requested.length
    ? [...activeSpecs, ...reviewSpecs, ...todoSpecs].filter((item) => requested.some((file) => item.file === file || item.file.endsWith(file)))
    : [...activeSpecs, ...todoSpecs];
  const selectedSpecs = await readSpecsWithText(root, selectedBase, maxSpecChars);
  const todos = selectedSpecs.flatMap((spec) => extractTodos(spec.file, spec.text));
  const openTodos = todos.filter((todo) => !todo.checked);
  const candidateFiles = await findCandidateFiles(root, selectedSpecs, input.candidateFileLimit ?? 40);
  const source = await scanSource({ root, maxFiles: 600 });
  const instructions = [
    "把 selected specs 和 open TODOs 作为本次开发的唯一需求源头。",
    "必须按 open TODOs 的顺序执行任务；没有 TODO 时再按 spec 的目标、行为规则和验收标准执行。",
    "每完成一个 TODO，必须同步把对应任务勾选为 [x]；无法完成时保留未勾选并写清阻塞原因。",
    "先阅读 spec 的目标、行为规则、验收标准和代码线索，再搜索代码。",
    "按 spec 更新实现和测试；不要根据旧对话记忆扩展范围。",
    "必须遵守 Engineering Constraints（含 KISS、YAGNI、Clean Code、Clean Architecture、DDD、SOLID、SoC、Fail Fast、Boy Scout Rule、禁止混层、禁止过度抽象、局部小步重构、性能与资源约束）；若 spec/TODO 与工程质量约束冲突，先保持实现边界清晰并向用户说明取舍。",
    "新建或重写代码文件时，必须在文件顶部写文件注释；复杂逻辑必须写说明性注释，但不要写废话。",
    "优先使用成熟库而不是自己手搓已有轮子；如果要引入新库，先评估必要性、维护状态和影响。",
    "遇到不明确、影响面大或高风险的方案时，先向用户询问和确认，不要自行拍板。",
    "优先用最少的文件和最直接的代码完成需求，但不要破坏边界或把不相关逻辑塞进同一处。",
    "如果 spec 涉及金额、权限、安全、删除、隐私、结算等高风险且描述不完整，先要求用户确认。",
    "实现或阶段性完成后调用 spec_checkpoint，记录完成 TODO、变更文件、验证结果、风险和阻塞。",
    "全部完成并验证通过后，再调用 spec_done 或按用户要求归档。"
  ];
  const markdown = [
    "# Spec Coding Context",
    "",
    `项目：\`${root}\``,
    `Specs：\`${specsDir}\``,
    `选中 spec：${selectedSpecs.length}`,
    "",
    "## Source Signals",
    "",
    `- package scripts: ${source.packageScripts.length}`,
    `- tests: ${source.testFiles.length}`,
    `- routes: ${source.routeHints.length}`,
    `- exports: ${source.exportHints.length}`,
    `- imports: ${source.importHints.length}`,
    `- references: ${source.referenceHints.length}`,
    "",
    "## Selected Specs",
    "",
    ...(selectedSpecs.length
      ? selectedSpecs.map((spec, index) => [`### ${index + 1}. ${spec.file}`, "", "```md", spec.text, "```"].join("\n"))
      : ["当前没有 active spec 或 todo spec。请先创建、移动 spec 到 active/，或把任务写入 todo/。"]),
    "",
    "## Open TODOs",
    "",
    ...(openTodos.length
      ? openTodos.map((todo, index) => `${index + 1}. ${todo.text}（${todo.file}:${todo.line}）`)
      : ["- 未发现未完成 TODO；请按 selected specs 的验收标准执行。"]),
    "",
    "## Completed TODOs",
    "",
    ...(todos.some((todo) => todo.checked)
      ? todos.filter((todo) => todo.checked).map((todo) => `- ${todo.text}（${todo.file}:${todo.line}）`)
      : ["- 无"]),
    "",
    "## Engineering Constraints",
    "",
    ...engineeringConstraints.map((item) => `- ${item}`),
    "",
    "## Candidate Files",
    "",
    ...(candidateFiles.length ? candidateFiles.map((file) => `- \`${file}\``) : ["- 未仅凭文件名找到候选文件，请按 spec 关键词全文搜索源码。"]),
    "",
    "## Source Hints",
    "",
    ...[
      ...source.packageScripts.slice(0, 12).map((item) => `- ${item}`),
      ...source.testFiles.slice(0, 12).map((item) => `- test: ${item}`),
      ...source.routeHints.slice(0, 12).map((item) => `- route: ${item}`),
      ...source.exportHints.slice(0, 12).map((item) => `- export: ${item}`),
      ...source.importHints.slice(0, 12).map((item) => `- import: ${item}`),
      ...source.referenceHints.slice(0, 12).map((item) => `- ref: ${item}`)
    ],
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
    todoSpecs,
    selectedSpecs,
    todos,
    source,
    candidateFiles,
    instructions,
    markdown
  };
}

export async function recordSpecCheckpoint(input: {
  projectRoot: string;
  specsDir?: string;
  file: string;
  summary: string;
  completedTodos?: string[];
  changedFiles?: string[];
  verification?: VerificationItem[];
  risks?: string[];
  blockers?: string[];
  note?: string;
}): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const source = resolveInsideRoot(root, input.file, "Checkpoint file");
  const oldText = await fs.readFile(source, "utf8");
  const completedTodos = input.completedTodos ?? [];
  const marked = markCompletedTodos(oldText, completedTodos);
  const unmatchedTodos = completedTodos
    .map(normalizeTodoText)
    .filter(Boolean)
    .filter((todo) => !marked.matched.includes(todo));
  const checkpoint = [
    "",
    "## Checkpoint",
    "",
    `- at: ${nowIso()}`,
    `- summary: ${input.summary.trim()}`,
    ...(input.note?.trim() ? [`- note: ${input.note.trim()}`] : []),
    "",
    "### Summary",
    "",
    ...bulletList([input.summary.trim()], "无"),
    "",
    "### Completed TODOs",
    "",
    ...bulletList(completedTodos, "无"),
    "",
    "### Changed Files",
    "",
    ...bulletList((input.changedFiles ?? []).map((file) => `\`${file}\``), "未记录"),
    "",
    "### Verification",
    "",
    ...verificationLines(input.verification ?? []),
    "",
    "### Risks",
    "",
    ...bulletList(input.risks ?? [], "无"),
    "",
    "### Blockers",
    "",
    ...bulletList(input.blockers ?? [], "无")
  ].join("\n");
  const nextText = `${marked.text.trimEnd()}\n${checkpoint}\n`;
  await fs.writeFile(source, nextText, "utf8");
  return {
    projectRoot: root,
    specsDir,
    files: [{ path: relativePosix(root, source), status: "updated" }],
    specs: [relativePosix(root, source)],
    nextSteps: [
      marked.matched.length ? `已勾选 ${marked.matched.length} 个 TODO。` : "未匹配到可勾选 TODO。",
      unmatchedTodos.length ? `有 ${unmatchedTodos.length} 个 completedTodos 未匹配到原文，请检查 TODO 文案是否一致。` : "所有 completedTodos 均已匹配或未提供 completedTodos。",
      "确认验证结果和风险后，可继续实现剩余 TODO，或调用 spec_done 归档。"
    ]
  };
}

export async function recordSpecReviewResult(input: {
  projectRoot: string;
  specsDir?: string;
  file: string;
  summary: string;
  completedTodos?: string[];
  incompleteTodos?: string[];
  changedFiles?: string[];
  verification?: VerificationItem[];
  risks?: string[];
  blockers?: string[];
  note?: string;
}): Promise<ReviewResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const source = resolveInsideRoot(root, input.file, "Review file");
  const lines = [
    "",
    "## Review Result",
    "",
    `- at: ${nowIso()}`,
    `- summary: ${input.summary.trim()}`,
    ...(input.note?.trim() ? [`- note: ${input.note.trim()}`] : []),
    "",
    "### Completed TODOs",
    "",
    ...bulletList(input.completedTodos ?? [], "无"),
    "",
    "### Incomplete TODOs",
    "",
    ...bulletList(input.incompleteTodos ?? [], "无"),
    "",
    "### Changed Files",
    "",
    ...bulletList((input.changedFiles ?? []).map((file) => `\`${file}\``), "未记录"),
    "",
    "### Verification",
    "",
    ...verificationLines(input.verification ?? []),
    "",
    "### Risks",
    "",
    ...bulletList(input.risks ?? [], "无"),
    "",
    "### Blockers",
    "",
    ...bulletList(input.blockers ?? [], "无")
  ];
  await fs.appendFile(source, `${lines.join("\n")}\n`, "utf8");
  return {
    file: relativePosix(root, source),
    summary: input.summary.trim(),
    completedTodos: input.completedTodos ?? [],
    incompleteTodos: input.incompleteTodos ?? [],
    verification: input.verification ?? [],
    changedFiles: input.changedFiles ?? [],
    risks: input.risks ?? [],
    blockers: input.blockers ?? []
  };
}

export async function markSpecDone(input: { projectRoot: string; specsDir?: string; file: string; note?: string }): Promise<SpecResult> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const source = resolveInsideRoot(root, input.file, "Spec file");
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
