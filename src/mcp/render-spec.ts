/* Spec-related MCP response rendering helpers. */
import type { AgentFileResult, ReviewResult, SpecItem, SpecResult } from "../spec/types.js";
import { code, fileStatus } from "./render-core.js";

export function renderSpecResult(title: string, result: SpecResult): string {
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

export function renderSpecItems(title: string, items: SpecItem[]): string[] {
  return [
    `## ${title}`,
    "",
    ...(items.length
      ? items.map((item) => `- ${code(item.file)}：${item.title}（status: ${item.status}, source: ${item.source}）`)
      : ["- 无"])
  ];
}

export function renderReviewResult(title: string, result: ReviewResult): string {
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

export function renderAgentFileResult(title: string, result: AgentFileResult): string {
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
