/* User prompt spec and TODO spec templates. */
import { businessConfirmationSection, engineeringConstraintSection, workflowGuardSection } from "./markdown.js";

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
    "- 测试覆盖正常流程和关键失败分支。",
    "",
    ...workflowGuardSection(),
    "",
    ...engineeringConstraintSection(),
    "",
    ...businessConfirmationSection(),
    "",
    "## TODO",
    "",
    "- [ ] 定位相关实现和测试。",
    "- [ ] 按本 spec 修改代码。",
    "- [ ] 新增或更新测试。",
    "- [ ] 运行验证命令并记录结果。"
  ].join("\n");
}

export function todoSpec(title: string, prompt: string): string {
  const tasks = prompt
    .split(/\r?\n/)
    .map((line) => line.trim().replace(/^[-*]\s*/, "").replace(/^\[[ xX]\]\s*/, ""))
    .filter(Boolean);
  return [
    `# ${title}`,
    "",
    "## Meta",
    "",
    "- status: todo",
    "- source: user-prompt",
    "",
    "## 用户原始描述",
    "",
    prompt,
    "",
    "## TODO",
    "",
    ...(tasks.length ? tasks.map((task) => `- [ ] ${task}`) : ["- [ ] 待补充任务。"]),
    "",
    "## 执行要求",
    "",
    "- 开始前必须先调用 `spec_context`，确认当前 TODO 上下文和工程约束。",
    "- AI 必须按未勾选 TODO 从上到下执行。",
    "- 完成任务后把对应项改成 `[x]`。",
    "- 无法完成的任务保持 `[ ]`，并在任务下方写明阻塞原因。",
    "",
    ...engineeringConstraintSection(),
    "",
    ...businessConfirmationSection()
  ].join("\n");
}
