/* Spec-related MCP response rendering helpers. */
import type { ReviewPrioritizeResult } from "../spec/types.js";
import type { AgentFileResult, ReviewResult, SpecItem, SpecResult } from "../spec/types.js";
import { code, fileStatus } from "./render-core.js";

const DEFAULT_LIST_LIMIT = 20;

function limitedLines<T>(items: T[], render: (item: T) => string, empty: string, limit = DEFAULT_LIST_LIMIT): string[] {
  const visibleItems = items.slice(0, limit);
  const hiddenCount = items.length - visibleItems.length;
  if (!visibleItems.length) return [empty];
  return [
    ...visibleItems.map(render),
    ...(hiddenCount > 0 ? [`- 其余 ${hiddenCount} 项未展开；需要详情请读取对应文件或目录。`] : [])
  ];
}

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
    ...limitedLines(result.files, fileStatus, "- 无文件变更"),
    "",
    "## Specs",
    "",
    ...limitedLines(result.specs, (file) => `- ${code(file)}`, "- 无"),
    "",
    "## 下一步",
    "",
    ...result.nextSteps.map((step) => `- ${step}`)
  ].filter(Boolean).join("\n");
}

export function renderSpecItems(title: string, items: SpecItem[], limit = DEFAULT_LIST_LIMIT): string[] {
  const visibleItems = items.slice(0, limit);
  const hiddenCount = items.length - visibleItems.length;
  return [
    `## ${title}`,
    "",
    ...(visibleItems.length
      ? visibleItems.map((item) => `- ${code(item.file)}：${item.title}（status: ${item.status}, source: ${item.source}）`)
      : ["- 无"]),
    ...(hiddenCount > 0 ? [`- 其余 ${hiddenCount} 个未展开；需要详情请读取对应 specs 目录。`] : [])
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
    ...limitedLines(result.completedTodos, (item) => `- ${item}`, "- 无"),
    "",
    "## Incomplete TODOs",
    "",
    ...limitedLines(result.incompleteTodos, (item) => `- ${item}`, "- 无"),
    "",
    "## Changed Files",
    "",
    ...limitedLines(result.changedFiles, (item) => `- \`${item}\``, "- 未记录"),
    "",
    "## Verification",
    "",
    ...limitedLines(result.verification, (item) => `- ${item.status} \`${item.command}\`${item.note ? `（${item.note}）` : ""}`, "- 无"),
    "",
    "## Risks",
    "",
    ...limitedLines(result.risks, (item) => `- ${item}`, "- 无"),
    "",
    "## Blockers",
    "",
    ...limitedLines(result.blockers, (item) => `- ${item}`, "- 无")
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
    ...limitedLines(result.files, fileStatus, "- 无文件变更"),
    "",
    "## 下一步",
    "",
    ...result.nextSteps.map((step) => `- ${step}`)
  ].join("\n");
}

export function renderReviewPrioritizeResult(result: ReviewPrioritizeResult): string {
  if (result.analyzedFiles === 0) {
    return [
      "# 审查优先级分析",
      "",
      `项目：${code(result.projectRoot)}`,
      "",
      "未在 Git 历史中找到符合条件的源码变更记录。",
      "",
      "可能原因：",
      "- 仓库中没有最近的提交或提交只涉及被排除的文件",
      "- 提交只涉及排除的文件类型（lock 文件、node_modules 等）"
    ].join("\n");
  }

  const lines = [
    "# 审查优先级分析（基于 Git 变更历史）",
    "",
    `项目：${code(result.projectRoot)}`,
    `分析文件：${result.analyzedFiles} 个`,
    `总提交数：${result.totalCommits}`,
    `权重：recency=${result.weights.recency}、frequency=${result.weights.frequency}、churn=${result.weights.churn}`,
    "",
    "评分依据：",
    "- **Recency**：最近修改的文件风险更高",
    "- **Frequency**：频繁修改的文件稳定性更差",
    "- **Churn**：变更量大的文件需要更仔细审查",
    "- **Category Boost**：core 代码 1.2x，test 0.7x，doc 0.3x",
    "",
    "## 优先审查文件",
    "",
    "| # | 文件 | 评分 | 提交 | 距今天数 | 变更行 | 类别 |",
    "|---|---|---|---|---|---|---|",
  ];

  for (let i = 0; i < result.prioritized.length; i++) {
    const item = result.prioritized[i];
    lines.push(`| ${i + 1} | \`${item.file}\` | ${item.score} | ${item.commitCount} | ${item.daysSinceLastChange} | ${item.linesChanged} | ${item.category} |`);
  }

  lines.push(
    "",
    "## 解读建议",
    "",
    "- 评分 >= 0.5：**高优先级**，建议立即审查",
    "- 评分 0.2-0.5：**中优先级**，下次审查窗口处理",
    "- 评分 < 0.2：**低优先级**，常规审查即可",
    "",
    "## 下一步",
    "",
    "- 对高优先级文件调用 `spec_create` 创建审查 spec，放到 `specs/active/`",
    "- 审查完成后调用 `spec_checkpoint` 记录进度",
    "- 需要调整评分时，通过 `weights` 参数调整 recency/frequency/churn 权重"
  );

  return lines.join("\n");
}
