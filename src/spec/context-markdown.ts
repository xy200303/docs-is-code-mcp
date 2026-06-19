/* Markdown rendering helpers for spec context assembly. */
import type { SourceScanSummary, SpecContext, SpecItem } from "./types.js";
import { businessConfirmationBullets, engineeringRuleSections } from "../templates/markdown.js";
import { currentTaskInstructions } from "../templates/prompt-protocol.js";

function withFallbackLines(items: string[], empty: string): string[] {
  return items.length ? items : [empty];
}

export function buildContextInstructions(): string[] {
  return currentTaskInstructions;
}

function renderSelectedSpecs(selectedSpecs: Array<SpecItem & { text: string }>): string[] {
  return selectedSpecs.length
    ? selectedSpecs.map((spec, index) => [`### ${index + 1}. ${spec.file}`, "", "```md", spec.text, "```"].join("\n"))
    : ["当前没有 active spec 或 todo spec。请先创建、移动 spec 到 active/，或把任务写入 todo/。"];
}

function renderTodoLines(todos: SpecContext["todos"]): string[] {
  return todos.length
    ? todos.map((todo, index) => `${index + 1}. ${todo.text}（${todo.file}:${todo.line}）`)
    : ["- 未发现未完成 TODO；请按 selected specs 的验收标准执行。"];
}

function renderCompletedTodoLines(todos: SpecContext["todos"]): string[] {
  const completed = todos.filter((todo) => todo.checked);
  return completed.length ? completed.map((todo) => `- ${todo.text}（${todo.file}:${todo.line}）`) : ["- 无"];
}

function renderSourceHints(source: SourceScanSummary): string[] {
  return [
    ...source.packageScripts.slice(0, 12).map((item) => `- ${item}`),
    ...source.testFiles.slice(0, 12).map((item) => `- test: ${item}`),
    ...source.routeHints.slice(0, 12).map((item) => `- route: ${item}`),
    ...source.exportHints.slice(0, 12).map((item) => `- export: ${item}`),
    ...source.importHints.slice(0, 12).map((item) => `- import: ${item}`),
    ...source.referenceHints.slice(0, 12).map((item) => `- ref: ${item}`)
  ];
}

export function buildSpecContextMarkdown(input: {
  root: string;
  specsDir: string;
  selectedSpecs: Array<SpecItem & { text: string }>;
  todos: SpecContext["todos"];
  source: SourceScanSummary;
  candidateFiles: string[];
  instructions: string[];
}): string {
  const openTodos = input.todos.filter((todo) => !todo.checked);
  return [
    "# Spec Coding Context",
    "",
    `项目：\`${input.root}\``,
    `Specs：\`${input.specsDir}\``,
    `选中 spec：${input.selectedSpecs.length}`,
    "",
    "## Source Signals",
    "",
    `- package scripts: ${input.source.packageScripts.length}`,
    `- tests: ${input.source.testFiles.length}`,
    `- routes: ${input.source.routeHints.length}`,
    `- exports: ${input.source.exportHints.length}`,
    `- imports: ${input.source.importHints.length}`,
    `- references: ${input.source.referenceHints.length}`,
    "",
    "## Selected Specs",
    "",
    ...renderSelectedSpecs(input.selectedSpecs),
    "",
    "## Open TODOs",
    "",
    ...renderTodoLines(openTodos),
    "",
    "## Completed TODOs",
    "",
    ...renderCompletedTodoLines(input.todos),
    "",
    "## Engineering Constraints",
    "",
    ...engineeringRuleSections(),
    "",
    "## Business Confirmation Rules",
    "",
    ...businessConfirmationBullets(),
    "",
    "## Candidate Files",
    "",
    ...(input.candidateFiles.length ? input.candidateFiles.map((file) => `- \`${file}\``) : ["- 未仅凭文件名找到候选文件，请按 spec 关键词全文搜索源码。"]),
    "",
    "## Source Hints",
    "",
    ...withFallbackLines(renderSourceHints(input.source), "- 无"),
    "",
    "## Current Task Protocol",
    "",
    ...input.instructions.map((item) => `- ${item}`)
  ].join("\n");
}
