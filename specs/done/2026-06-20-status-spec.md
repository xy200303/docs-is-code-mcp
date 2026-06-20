# 让 status 推荐使用真实 spec 文件

## Meta

- status: done
- source: user-prompt

## 用户原始描述

让 specc status 的工作流推荐使用 listSpecs 得到的真实 spec 文件和 open TODO 文件，而不是在 status-recommendation.ts 中根据计数生成 active-1.md、review-1.md 这类占位文件。要求：
- 保留 status JSON 的 workflowState 计数字段和 schemaVersion 契约。
- status recommendation 内部使用真实 SpecItem/TodoItem 构造 workflow-next-step 的 WorkflowState。
- review-only 状态下 recommendation.arguments.files 应指向真实 review spec 路径。
- open TODO 状态下共享推荐仍优先 spec_context，status nextStep 保持简洁。
- 去掉不必要的 placeholderSpec/placeholderTodo 逻辑。
- 更新单元测试或 smoke 测试覆盖真实文件路径。
- 验证 bun run build、bun test/unit.ts、bun test/smoke.ts、bun run release:check、git diff --check。

## TODO

- [x] 让 specc status 的工作流推荐使用 listSpecs 得到的真实 spec 文件和 open TODO 文件，而不是在 status-recommendation.ts 中根据计数生成 active-1.md、review-1.md 这类占位文件。要求：
- [x] 保留 status JSON 的 workflowState 计数字段和 schemaVersion 契约。
- [x] status recommendation 内部使用真实 SpecItem/TodoItem 构造 workflow-next-step 的 WorkflowState。
- [x] review-only 状态下 recommendation.arguments.files 应指向真实 review spec 路径。
- [x] open TODO 状态下共享推荐仍优先 spec_context，status nextStep 保持简洁。
- [x] 去掉不必要的 placeholderSpec/placeholderTodo 逻辑。
- [x] 更新单元测试或 smoke 测试覆盖真实文件路径。
- [x] 验证 bun run build、bun test/unit.ts、bun test/smoke.ts、bun run release:check、git diff --check。

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

- at: 2026-06-20T16:48:00.419Z
- summary: 已让 specc status 使用 listSpecs 和解析出的真实 open TODO 构造工作流推荐输入，保留对外 workflowState 计数与 JSON 契约，并移除基于计数生成占位 spec/todo 文件名的逻辑。

### Summary

- 已让 specc status 使用 listSpecs 和解析出的真实 open TODO 构造工作流推荐输入，保留对外 workflowState 计数与 JSON 契约，并移除基于计数生成占位 spec/todo 文件名的逻辑。

### Completed TODOs

- 让 specc status 的工作流推荐使用 listSpecs 得到的真实 spec 文件和 open TODO 文件，而不是在 status-recommendation.ts 中根据计数生成 active-1.md、review-1.md 这类占位文件。要求：
- 保留 status JSON 的 workflowState 计数字段和 schemaVersion 契约。
- status recommendation 内部使用真实 SpecItem/TodoItem 构造 workflow-next-step 的 WorkflowState。
- review-only 状态下 recommendation.arguments.files 应指向真实 review spec 路径。
- open TODO 状态下共享推荐仍优先 spec_context，status nextStep 保持简洁。
- 去掉不必要的 placeholderSpec/placeholderTodo 逻辑。
- 更新单元测试或 smoke 测试覆盖真实文件路径。
- 验证 bun run build、bun test/unit.ts、bun test/smoke.ts、bun run release:check、git diff --check。

### Changed Files

- `src/cli/command-status.ts`
- `src/cli/status-recommendation.ts`
- `test/unit.ts`
- `test/smoke.ts`

### Verification

- passed `bun run build`：TypeScript 构建通过。
- passed `bun test/unit.ts`：status 推荐测试改为真实 SpecItem/TodoItem 输入，并验证 review-only 返回真实路径。
- passed `bun test/smoke.ts`：CLI status JSON 增加 review-only 真实 review spec 路径覆盖。
- passed `bun run release:check`：发布契约检查通过。
- passed `git diff --check`：退出码为 0，仅出现 Windows LF/CRLF 提示。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| status 推荐输入 | specc status 读取项目 specs 后生成 recommendation | command-status.ts 将真实 active/review/todo/done SpecItem 列表和真实 open TodoItem 列表传给 decideStatusRecommendation。 | 对外 workflowState 仍只暴露 active、todo、review、done、openTodos 计数。 | 未记录 | bun run build && bun test/unit.ts | `src/cli/command-status.ts`<br>`src/cli/status-recommendation.ts` |
| review-only 路径 | 项目只有 specs/review/source-inventory.md 且没有 open TODO | specc status --json 的 recommendation.arguments.files 返回 specs/review/source-inventory.md，而不是 review-1.md 这类占位值。 | 未记录 | 未记录 | bun test/unit.ts && bun test/smoke.ts | `src/cli/status-recommendation.ts`<br>`test/smoke.ts`<br>`test/unit.ts` |
| open TODO 推荐 | active/todo spec 中存在未完成 TODO | 共享 inspect 推荐仍优先 spec_context，status nextStep 保持 Call spec_context and execute open TODOs in order。 | 未记录 | 真实 openTodos 既用于计数，也用于共享推荐的优先级判断。 | bun test/unit.ts && bun test/smoke.ts | `src/cli/command-status.ts`<br>`src/cli/status-recommendation.ts` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T16:48:15.536Z
- note: status 推荐真实 spec 文件输入已完成并通过验收。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| status 推荐输入 | specc status 读取项目 specs 后生成 recommendation | command-status.ts 将真实 active/review/todo/done SpecItem 列表和真实 open TodoItem 列表传给 decideStatusRecommendation。 | 对外 workflowState 仍只暴露 active、todo、review、done、openTodos 计数。 | 未记录 | bun run build && bun test/unit.ts | `src/cli/command-status.ts`<br>`src/cli/status-recommendation.ts` |
| review-only 路径 | 项目只有 specs/review/source-inventory.md 且没有 open TODO | specc status --json 的 recommendation.arguments.files 返回 specs/review/source-inventory.md，而不是 review-1.md 这类占位值。 | 未记录 | 未记录 | bun test/unit.ts && bun test/smoke.ts | `src/cli/status-recommendation.ts`<br>`test/smoke.ts`<br>`test/unit.ts` |
| open TODO 推荐 | active/todo spec 中存在未完成 TODO | 共享 inspect 推荐仍优先 spec_context，status nextStep 保持 Call spec_context and execute open TODOs in order。 | 未记录 | 真实 openTodos 既用于计数，也用于共享推荐的优先级判断。 | bun test/unit.ts && bun test/smoke.ts | `src/cli/command-status.ts`<br>`src/cli/status-recommendation.ts` |
