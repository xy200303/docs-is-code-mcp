# 优化 status done-only 下一步建议

## Meta

- status: done
- source: user-prompt

## 用户原始描述

优化 `specc status` 在只有 done specs、没有 active/todo/review/open TODO 时的下一步建议。

目标：
- 当项目存在 done specs，但当前没有 active/todo/review/open TODO 时，不应推荐重新 `specc bootstrap`。
- 这种状态应提示“当前没有待执行任务，需要新工作时创建 spec_todo 或 spec_create”。
- JSON 输出的 `nextStep` 与文本输出保持一致。
- 空项目仍继续推荐 `specc bootstrap`。
- 保持 status 只读，不写文件。

验收：
- 更新 smoke 或 unit 覆盖 done-only 状态。
- `bun run build` 通过。
- `bun test/unit.ts` 通过。
- `bun test/smoke.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

## TODO

- [x] 优化 `specc status` 在只有 done specs、没有 active/todo/review/open TODO 时的下一步建议。
- [x] 目标：
- [x] 当项目存在 done specs，但当前没有 active/todo/review/open TODO 时，不应推荐重新 `specc bootstrap`。
- [x] 这种状态应提示“当前没有待执行任务，需要新工作时创建 spec_todo 或 spec_create”。
- [x] JSON 输出的 `nextStep` 与文本输出保持一致。
- [x] 空项目仍继续推荐 `specc bootstrap`。
- [x] 保持 status 只读，不写文件。
- [x] 验收：
- [x] 更新 smoke 或 unit 覆盖 done-only 状态。
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

- at: 2026-06-20T15:37:14.169Z
- summary: 优化 specc status 的 done-only 状态建议：只有 done specs 且没有可执行项时提示创建新任务，而不是重新 bootstrap；文本和 JSON 使用同一个 nextStep。

### Summary

- 优化 specc status 的 done-only 状态建议：只有 done specs 且没有可执行项时提示创建新任务，而不是重新 bootstrap；文本和 JSON 使用同一个 nextStep。

### Completed TODOs

- 优化 `specc status` 在只有 done specs、没有 active/todo/review/open TODO 时的下一步建议。
- 目标：
- 当项目存在 done specs，但当前没有 active/todo/review/open TODO 时，不应推荐重新 `specc bootstrap`。
- 这种状态应提示“当前没有待执行任务，需要新工作时创建 spec_todo 或 spec_create”。
- JSON 输出的 `nextStep` 与文本输出保持一致。
- 空项目仍继续推荐 `specc bootstrap`。
- 保持 status 只读，不写文件。
- 验收：
- 更新 smoke 或 unit 覆盖 done-only 状态。
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
- passed `bun test/smoke.ts`：新增 done-only status 文本和 JSON 场景通过。
- passed `bun run release:check`：发布契约通过。
- passed `git diff --check`：仅出现 Windows LF/CRLF 提示，无空白错误。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| done-only 状态 | 项目存在 done specs，且 active/todo/review/open TODO 都为 0 | `specc status` 文本和 JSON 的 nextStep 提示没有待执行任务，需要新工作时创建 spec_todo 或 spec_create。 | status 保持只读，只读取 specs 计数和 TODO 状态。 | 不会误推荐重新 bootstrap，避免已接入项目被当成空项目。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
| 空项目状态 | active/todo/review/done/open TODO 全部为 0 | 继续推荐 `specc bootstrap --project-root <path> --project-kind auto`。 | 空项目保持原有初始化建议。 | done-only 和真正空项目通过 done 计数区分。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
| 文本和 JSON 一致 | 同一项目分别运行 `specc status` 和 `specc status --json` | 两种输出共享同一个 nextStep 判定逻辑。 | JSON 仍保留 workflowState.done 和 nextStep 字段。 | 机器解析不会拿到与文本不同的下一步建议。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T15:37:27.306Z
- note: 已完成 done-only 状态下的 status 下一步建议优化。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| done-only 状态 | done specs 大于 0，active/todo/review/open TODO 全为 0 | nextStep 提示创建新的 spec_todo 或 spec_create，不推荐 bootstrap。 | status 只读，不写文件。 | 已接入但暂时无任务的项目不会被误判为空项目。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
| 空项目状态 | active/todo/review/done/open TODO 全为 0 | nextStep 继续推荐运行 specc bootstrap。 | 未初始化项目仍走 bootstrap 引导。 | done 计数用于区分空项目和历史任务已完成项目。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
| JSON 与文本一致 | 同一个项目分别请求文本和 JSON status | 两种输出使用同一个 nextStep 判定。 | JSON 保留 workflowState.done 和 nextStep。 | 脚本消费 JSON 时不会拿到与人类文本不同的建议。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
