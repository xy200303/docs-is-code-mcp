# 统一 MCP done-only 工作流建议

## Meta

- status: done
- source: user-prompt

## 用户原始描述

让 MCP 的 `spec_context` 和 `spec_list` 推荐逻辑也区分 done-only 状态，和 `specc status` 保持一致。

目标：
- 当项目只有 done specs、没有 selected/open/active/todo/review 时，不应推荐 `spec_bootstrap`。
- `spec_context` 应推荐创建新的 `spec_todo` 或 `spec_create`，说明当前没有待执行任务。
- `spec_list` inspect 阶段也应推荐创建新任务，而不是重新 bootstrap。
- 真正空项目仍推荐 `spec_bootstrap`。
- 推荐逻辑保持集中在 `workflow-next-step.ts`，不要复制散落判断。

验收：
- 更新 unit 或 smoke 覆盖 context/list 的 done-only 推荐。
- `bun run build` 通过。
- `bun test/unit.ts` 通过。
- `bun test/smoke.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

## TODO

- [x] 让 MCP 的 `spec_context` 和 `spec_list` 推荐逻辑也区分 done-only 状态，和 `specc status` 保持一致。
- [x] 目标：
- [x] 当项目只有 done specs、没有 selected/open/active/todo/review 时，不应推荐 `spec_bootstrap`。
- [x] `spec_context` 应推荐创建新的 `spec_todo` 或 `spec_create`，说明当前没有待执行任务。
- [x] `spec_list` inspect 阶段也应推荐创建新任务，而不是重新 bootstrap。
- [x] 真正空项目仍推荐 `spec_bootstrap`。
- [x] 推荐逻辑保持集中在 `workflow-next-step.ts`，不要复制散落判断。
- [x] 验收：
- [x] 更新 unit 或 smoke 覆盖 context/list 的 done-only 推荐。
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

- at: 2026-06-20T15:41:21.421Z
- summary: 统一 MCP 推荐逻辑的 done-only 状态：spec_context 和 spec_list 都通过 workflow-next-step.ts 区分空项目与只有 done 历史的项目，done-only 推荐创建新任务而不是 bootstrap。

### Summary

- 统一 MCP 推荐逻辑的 done-only 状态：spec_context 和 spec_list 都通过 workflow-next-step.ts 区分空项目与只有 done 历史的项目，done-only 推荐创建新任务而不是 bootstrap。

### Completed TODOs

- 让 MCP 的 `spec_context` 和 `spec_list` 推荐逻辑也区分 done-only 状态，和 `specc status` 保持一致。
- 目标：
- 当项目只有 done specs、没有 selected/open/active/todo/review 时，不应推荐 `spec_bootstrap`。
- `spec_context` 应推荐创建新的 `spec_todo` 或 `spec_create`，说明当前没有待执行任务。
- `spec_list` inspect 阶段也应推荐创建新任务，而不是重新 bootstrap。
- 真正空项目仍推荐 `spec_bootstrap`。
- 推荐逻辑保持集中在 `workflow-next-step.ts`，不要复制散落判断。
- 验收：
- 更新 unit 或 smoke 覆盖 context/list 的 done-only 推荐。
- `bun run build` 通过。
- `bun test/unit.ts` 通过。
- `bun test/smoke.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

### Changed Files

- `src/spec/workflow-next-step.ts`
- `src/spec/context-markdown.ts`
- `src/mcp/register-read-tools.ts`
- `test/smoke.ts`

### Verification

- passed `bun run build`：TypeScript 编译通过。
- passed `bun test/unit.ts`：既有单测通过。
- passed `bun test/smoke.ts`：新增 spec_context/spec_list done-only 推荐覆盖通过。
- passed `bun run release:check`：发布契约通过。
- passed `git diff --check`：仅出现 Windows LF/CRLF 提示，无空白错误。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| spec_context done-only 推荐 | 只有 done specs，且没有 selected spec、open TODO、active、todo 或 review | Recommended Next Step 输出 `spec_todo`，alternative 为 `spec_create`，说明当前没有待执行任务且项目已接入。 | 推荐逻辑集中在 `workflow-next-step.ts`。 | 不会把有 done 历史的项目误判为空项目。 | bun test/smoke.ts | `src/spec/workflow-next-step.ts`<br>`src/spec/context-markdown.ts`<br>`test/smoke.ts` |
| spec_list done-only 推荐 | inspect 阶段只有 done specs，没有可执行项 | Recommended Next Step 输出 `spec_todo`，alternative 为 `spec_create`，而不是 `spec_bootstrap`。 | spec_list 只读检查当前工作流状态。 | 创建新任务后仍要求再次调用 spec_context 再实现。 | bun test/smoke.ts | `src/spec/workflow-next-step.ts`<br>`src/mcp/register-read-tools.ts`<br>`test/smoke.ts` |
| 真正空项目推荐 | selected/open/active/todo/review/done 全部为空 | 继续推荐 `spec_bootstrap` 建立项目入口。 | doneSpecs 为空才进入空项目 bootstrap 分支。 | 保持已有空项目引导行为不变。 | bun test/smoke.ts | `src/spec/workflow-next-step.ts`<br>`test/smoke.ts` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T15:41:34.311Z
- note: 已完成 MCP done-only 推荐逻辑统一。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| spec_context done-only 推荐 | 只有 done specs，且没有 selected/open/active/todo/review | 推荐 `spec_todo`，备选 `spec_create`，不推荐 `spec_bootstrap`。 | 集中由 `workflow-next-step.ts` 判断。 | 已接入但暂无任务的项目不会被当成空项目。 | bun test/smoke.ts | `src/spec/workflow-next-step.ts`<br>`src/spec/context-markdown.ts` |
| spec_list done-only 推荐 | inspect 阶段只有 done specs，没有可执行项 | 推荐创建新任务或功能 spec，不推荐重新 bootstrap。 | spec_list 仍只读。 | 创建新任务后需要再次调用 spec_context。 | bun test/smoke.ts | `src/spec/workflow-next-step.ts`<br>`src/mcp/register-read-tools.ts` |
| 空项目推荐 | 没有任何 review/active/todo/done 或 selected/open TODO | 继续推荐 `spec_bootstrap`。 | 空项目初始化路径保持不变。 | doneSpecs 为空时才进入 bootstrap 分支。 | bun test/smoke.ts | `src/spec/workflow-next-step.ts` |
