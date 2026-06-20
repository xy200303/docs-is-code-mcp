# 增强 status JSON 推荐结构

## Meta

- status: done
- source: user-prompt

## 用户原始描述

增强 `specc status --json` 的机器可读能力，给 JSON 输出增加结构化推荐字段，同时保持现有 `nextStep` 字符串兼容。

目标：
- JSON 输出新增 `recommendation` 对象，至少包含 `nextTool`、`alternatives`、`reason`。
- 文本输出可以继续只显示 `Next Step`，不要变复杂。
- `nextStep` 字符串保持存在，避免破坏已有脚本。
- empty、active/open TODO、done-only 三类状态都应有稳定的结构化推荐。
- 保持 status 只读，不写文件。

验收：
- 更新 smoke 覆盖 `--json` 的 recommendation 字段。
- `bun run build` 通过。
- `bun test/unit.ts` 通过。
- `bun test/smoke.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

## TODO

- [x] 增强 `specc status --json` 的机器可读能力，给 JSON 输出增加结构化推荐字段，同时保持现有 `nextStep` 字符串兼容。
- [x] 目标：
- [x] JSON 输出新增 `recommendation` 对象，至少包含 `nextTool`、`alternatives`、`reason`。
- [x] 文本输出可以继续只显示 `Next Step`，不要变复杂。
- [x] `nextStep` 字符串保持存在，避免破坏已有脚本。
- [x] empty、active/open TODO、done-only 三类状态都应有稳定的结构化推荐。
- [x] 保持 status 只读，不写文件。
- [x] 验收：
- [x] 更新 smoke 覆盖 `--json` 的 recommendation 字段。
- [x] `bun run build` 通过。
- [x] `bun test/unit.ts` 通过。
- [x] `bun test/smoke.ts` 通过。
- [x] `bun run release:check` 通过。
- [x] `git diff --check` 通过。

## 执行要求

- 开始前必须先调用 `spec_context`，确认当前 TODO 上下文和工程约束。
- AI 必须按未勾选 TODO 从上到下执行。
- 完成任务后把对应项改成 `[x]`。
- 无法完成的任务保持 `[ ]`，并在任务下方写明阻塞原因。
- 完成后必须记录实际行为：业务分支条件、默认参数行为、边界处理结果和验证结果。

## 实际行为记录

- 分支条件：完成后补充已实现行为。
- 默认参数行为：完成后补充默认值和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令和结果。

## 工程质量约束

这些规则是强制约束，不是建议。

### Hard Rules

- Fail Fast：尽早校验输入、依赖、前置条件和无效状态。
- 风险先确认：不明确、高影响或高风险决策先问用户。
- 文件注释：新建或重写文件保留顶部注释；复杂边界写为什么，不写废话。
- 禁止在一个文件里混合 UI、业务、数据访问逻辑；禁止在领域层引用 Web / DB 框架。
- 禁止为了模式而模式：不要无故引入接口、工厂、泛型、抽象层。
- 性能与资源：避免不必要高复杂度，不阻塞主线程，不泄露连接、内存或文件句柄。

### Recommended Practices

- KISS + YAGNI：优先最简单可用方案，不预埋未确认复杂度。
- Clean Code：业务意图命名，短函数，低嵌套，DRY，显式行为。
- Human Readable：按线性故事写代码，复杂逻辑拆成有语义的小步骤。
- Clean Architecture + DDD：按业务能力分层，领域规则不依赖框架、DB 或 Web。
- SOLID + SoC：职责单一，关注点分离，组合优于继承，依赖抽象。
- 测试优先：核心逻辑可单测，验证命令和结果必须记录。
- 向后兼容：小步修改，不破坏已有 API、数据和行为契约。
- 成熟库优先：已有成熟方案不手搓；新增依赖先确认必要性。
- 项目结构：按业务语义拆分目录和文件，避免单文件堆砌和目录平铺。
- UI/交互：符合直觉，状态完整，文案简洁，布局清楚。
- Boy Scout Rule：局部顺手清理，不做无关大重构。
- AI + Human：结构清晰、边界明确，便于 AI 修改和人类维护。

## 业务不确定性强制确认

这些规则是硬性约束，不是建议。

- 业务不确定性强制确认：金额、费率、结算、退款、折扣、税费、状态机、并发、幂等、重试、回滚、规则来源不明或角色差异，必须先问清楚。
- 禁止猜业务：不要用常识补规则，不要自行假设边界。
- 澄清格式：说明不清楚之处，给出 2 到 3 种可能解释，等待用户确认。
- 金钱与合规：涉及钱、合规、审计的实现必须有明确来源或产品确认注释。

## Checkpoint

- at: 2026-06-20T15:52:03.341Z
- summary: 增强 specc status --json 输出：保留 nextStep 字符串，同时新增 recommendation 对象，包含 nextTool、alternatives、reason，覆盖空项目、done-only 和 open TODO 状态。

### Summary

- 增强 specc status --json 输出：保留 nextStep 字符串，同时新增 recommendation 对象，包含 nextTool、alternatives、reason，覆盖空项目、done-only 和 open TODO 状态。

### Completed TODOs

- 增强 `specc status --json` 的机器可读能力，给 JSON 输出增加结构化推荐字段，同时保持现有 `nextStep` 字符串兼容。
- 目标：
- JSON 输出新增 `recommendation` 对象，至少包含 `nextTool`、`alternatives`、`reason`。
- 文本输出可以继续只显示 `Next Step`，不要变复杂。
- `nextStep` 字符串保持存在，避免破坏已有脚本。
- empty、active/open TODO、done-only 三类状态都应有稳定的结构化推荐。
- 保持 status 只读，不写文件。
- 验收：
- 更新 smoke 覆盖 `--json` 的 recommendation 字段。
- `bun run build` 通过。
- `bun test/unit.ts` 通过。
- `bun test/smoke.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

### Changed Files

- `src/cli/command-status.ts`
- `test/smoke.ts`

### Verification

- passed `bun run build`：TypeScript 编译通过。
- passed `bun test/unit.ts`：既有单测通过。
- passed `bun test/smoke.ts`：覆盖 empty、done-only、active/open TODO 的 JSON recommendation 字段。
- passed `bun run release:check`：发布契约通过。
- passed `git diff --check`：仅出现 Windows LF/CRLF 提示，无空白错误。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| 空项目 JSON 推荐 | active/todo/review/done/openTodos 全为 0 | JSON 保留 nextStep，并输出 recommendation.nextTool=`spec_bootstrap`，alternatives 包含 `spec_todo` 和 `spec_create`。 | 文本输出仍只显示 Next Step。 | status 保持只读，不写入 specs。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
| done-only JSON 推荐 | done > 0 且没有 active/todo/review/openTodos | JSON 输出 recommendation.nextTool=`spec_todo`，alternatives 包含 `spec_create`，nextStep 继续保留人类可读提示。 | 不会推荐 bootstrap。 | 适合脚本判断项目已接入但当前没有待执行任务。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
| open TODO JSON 推荐 | 存在 active/todo spec 且 openTodos > 0 | JSON 输出 recommendation.nextTool=`spec_context`，alternatives 为空，nextStep 保持 open TODO 执行提示。 | 机器和人类输出共享同一个内部 decision。 | 文本输出未新增复杂结构。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T15:52:16.736Z
- note: 已完成 status JSON 结构化推荐字段增强。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| 空项目 JSON 推荐 | 项目没有任何 spec 或 open TODO | recommendation.nextTool 为 `spec_bootstrap`，alternatives 包含 `spec_todo`、`spec_create`。 | nextStep 字符串继续存在。 | 文本输出不显示 recommendation 对象。 | bun test/smoke.ts | `src/cli/command-status.ts` |
| done-only JSON 推荐 | 只有 done specs，没有可执行项 | recommendation.nextTool 为 `spec_todo`，alternatives 包含 `spec_create`。 | nextStep 仍是兼容的人类可读字符串。 | 不会推荐 bootstrap。 | bun test/smoke.ts | `src/cli/command-status.ts` |
| open TODO JSON 推荐 | 存在 open TODO | recommendation.nextTool 为 `spec_context`，alternatives 为空。 | 文本输出仍只显示 Next Step。 | 脚本可稳定读取 nextTool，无需解析英文 nextStep。 | bun test/smoke.ts | `src/cli/command-status.ts` |
