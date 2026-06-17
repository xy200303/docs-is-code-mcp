import type { SourceScanSummary, SourceSpecCandidate } from "./types.js";

function list(items: string[], empty = "未识别到明显线索"): string[] {
  return items.length ? items.map((item) => `- \`${item}\``) : [`- ${empty}`];
}

export function specsReadme(projectName: string): string {
  return [
    `# ${projectName} Specs`,
    "",
    "本目录用于 spec coding：先写清楚规格，再让 AI 按规格修改代码和测试。",
    "",
    "## 工作流",
    "",
    "1. 没有 spec 的旧系统，先用 MCP 从源码反推 `review/` specs。",
    "2. 用户审查 `review/*.md`，把源码事实改成真实业务规格。",
    "3. 要开发时，把 spec 放到 `active/`，或直接让 MCP 读取指定 spec。",
    "4. Codex 按 spec 修改代码和测试。",
    "5. 验证通过后，把 spec 移到 `done/`。",
    "",
    "## 状态",
    "",
    "- `source-derived/current-code`：从现有源码反推，表示当前代码大概率已有对应实现，待用户审查。",
    "- `draft`：用户正在描述需求，尚未实现。",
    "- `active`：准备实现或正在实现。",
    "- `done`：代码和测试已按该 spec 完成。",
    "",
    "## 目录",
    "",
    "- `review/`：从源码反推的待审查 specs。",
    "- `active/`：当前要实现的 specs。",
    "- `done/`：已经完成的 specs。",
    "- `templates/`：新建 feature、bugfix、removal spec 的模板。"
  ].join("\n");
}

export function specTemplate(kind: "feature" | "bugfix" | "removal"): string {
  const title = kind === "feature" ? "新增功能" : kind === "bugfix" ? "问题修复" : "移除功能";
  return [
    `# ${title}`,
    "",
    "## Meta",
    "",
    "- status: draft",
    "- source: user-authored",
    "",
    "## 目标",
    "",
    "- 待描述。",
    "",
    "## 影响范围",
    "",
    "- 后端/API：待确认",
    "- 前端/客户端：待确认",
    "- 数据/迁移：待确认",
    "- 测试：待确认",
    "",
    "## 行为规则",
    "",
    "| 场景 | 条件 | 预期结果 |",
    "|---|---|---|",
    "| 正常 | 待补充 | 待补充 |",
    "| 失败 | 待补充 | 待补充 |",
    "",
    "## 验收标准",
    "",
    "- 待补充可验证结果。",
    "",
    "## 代码线索",
    "",
    "- 待补充相关文件、函数、路由、组件或测试。"
  ].join("\n");
}

export function sourceInventory(summary: SourceScanSummary, generatedAt: string): string {
  const section = (title: string, items: string[]) => [`## ${title}`, "", ...list(items), ""].join("\n");
  return [
    "# 源码反推清单",
    "",
    `生成时间：${generatedAt}`,
    "",
    `扫描源码和配置文件 ${summary.totalFiles} 个。以下是静态启发式线索，用于辅助用户审查系统。`,
    "",
    section("Manifest", summary.manifests),
    section("API 文件", summary.apiFiles),
    section("UI 文件", summary.uiFiles),
    section("数据文件", summary.dataFiles),
    section("测试文件", summary.testFiles),
    section("路由线索", summary.routeHints),
    section("组件线索", summary.componentHints),
    section("模型线索", summary.modelHints)
  ].join("\n");
}

export function reviewIndex(specsDir: string, candidates: SourceSpecCandidate[]): string {
  return [
    "# 反推 Spec 索引",
    "",
    "| Spec | 文件 | 状态 | 来源 |",
    "|---|---|---|---|",
    ...(candidates.length
      ? candidates.map((item) => `| ${item.title} | \`${specsDir}/review/${item.domain}-${item.name}.md\` | source-derived/current-code | 源码静态扫描 |`)
      : ["| 待补充 | 待补充 | 待审查 | 源码静态扫描 |"])
  ].join("\n");
}

export function sourceReviewSpec(projectName: string, input: SourceSpecCandidate): string {
  return [
    `# ${input.title}`,
    "",
    "## Meta",
    "",
    "- status: source-derived/current-code",
    "- source: existing-source-scan",
    "- review: required",
    "",
    "## 当前代码事实",
    "",
    `MCP 从 \`${projectName}\` 的源码结构、命名、路由、组件、模型和测试中反推出此能力。它表示当前代码里大概率存在相关实现，但业务语义需要用户审查。`,
    "",
    "## 源码证据",
    "",
    ...list(input.evidence),
    "",
    "## 推断目标",
    "",
    `当前代码似乎提供 \`${input.title}\` 能力。请把这里改成真实业务目标。`,
    "",
    "## 入口与接口线索",
    "",
    ...list(input.routes, "未识别到明显路由"),
    "",
    "## UI/客户端线索",
    "",
    ...list(input.components, "未识别到明显组件"),
    "",
    "## 数据线索",
    "",
    ...list(input.models, "未识别到明显模型"),
    "",
    "## 已有测试线索",
    "",
    ...list(input.tests, "未识别到相关测试"),
    "",
    "## 待用户审查",
    "",
    "- 真实业务目标是否正确。",
    "- 正常流程、失败分支、权限、数据约束是否完整。",
    "- 这个功能是否仍需要保留。",
    "- 如果要修改，请直接编辑本 spec，再让 Codex 按最新 spec 更新代码。",
    "",
    "## 行为规则",
    "",
    "| 场景 | 条件 | 当前推断 | 目标行为 |",
    "|---|---|---|---|",
    "| 正常 | 从源码入口触发 | 保持现有可观察行为 | 待用户确认 |",
    "| 失败 | 参数、权限、状态或依赖异常 | 待从源码和测试补充 | 待用户确认 |",
    "",
    "## 验收标准",
    "",
    "- 用户确认或修改本 spec 后，AI 应按最新 spec 更新代码和测试。",
    "- 若本 spec 仅用于审查且不需要改动，可保持 `source-derived/current-code` 状态。",
    "- 若当前功能需要移除，把状态改为 `active/removal` 并写清移除范围。"
  ].join("\n");
}

export function userPromptSpec(title: string, prompt: string): string {
  return [
    `# ${title}`,
    "",
    "## Meta",
    "",
    "- status: active",
    "- source: user-prompt",
    "",
    "## 用户原始描述",
    "",
    prompt,
    "",
    "## 目标",
    "",
    "- 根据用户描述实现对应行为。",
    "",
    "## 影响范围",
    "",
    "- 后端/API：待 Codex 根据代码定位",
    "- 前端/客户端：待 Codex 根据代码定位",
    "- 数据/迁移：待 Codex 根据代码定位",
    "- 测试：必须新增或更新",
    "",
    "## 行为规则",
    "",
    "| 场景 | 条件 | 预期结果 |",
    "|---|---|---|",
    "| 正常 | 满足业务前置条件 | 完成目标行为 |",
    "| 失败 | 参数、权限、状态或依赖异常 | 返回可理解错误，不产生未声明副作用 |",
    "",
    "## 验收标准",
    "",
    "- 代码行为符合本 spec。",
    "- 测试覆盖正常流程和关键失败分支。"
  ].join("\n");
}
