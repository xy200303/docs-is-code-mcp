# 让 review-only 上下文默认选中 review specs

## Meta

- status: done
- source: user-prompt

## 用户原始描述

优化 spec_context 的默认选中规则：当项目没有 active/todo specs，但存在 review specs 时，默认把 review specs 作为 selected specs 读入上下文，避免旧项目 bootstrap 后模型看不到 review 任务正文。要求：
- 保持显式 files 参数优先级不变。
- 有 active 或 todo specs 时，默认仍只选 active/todo，不混入 review。
- 只有 review specs 时，selected specs 应包含 review specs 文本。
- Open TODOs 和 Recommended Next Step 应基于新的 selected specs 状态正确渲染。
- 更新 smoke 或单元测试覆盖 review-only spec_context selected specs 行为。
- 验证 bun run build、bun test/unit.ts、bun test/smoke.ts、bun run release:check、git diff --check。

## TODO

- [x] 优化 spec_context 的默认选中规则：当项目没有 active/todo specs，但存在 review specs 时，默认把 review specs 作为 selected specs 读入上下文，避免旧项目 bootstrap 后模型看不到 review 任务正文。要求：
- [x] 保持显式 files 参数优先级不变。
- [x] 有 active 或 todo specs 时，默认仍只选 active/todo，不混入 review。
- [x] 只有 review specs 时，selected specs 应包含 review specs 文本。
- [x] Open TODOs 和 Recommended Next Step 应基于新的 selected specs 状态正确渲染。
- [x] 更新 smoke 或单元测试覆盖 review-only spec_context selected specs 行为。
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

- at: 2026-06-20T16:55:50.959Z
- summary: 优化 spec_context 默认选择：没有 active/todo 时自动选中 review specs 读取正文，同时保持 review-only 下一步推荐为 spec_create。

### Summary

- 优化 spec_context 默认选择：没有 active/todo 时自动选中 review specs 读取正文，同时保持 review-only 下一步推荐为 spec_create。

### Completed TODOs

- 优化 spec_context 的默认选中规则：当项目没有 active/todo specs，但存在 review specs 时，默认把 review specs 作为 selected specs 读入上下文，避免旧项目 bootstrap 后模型看不到 review 任务正文。要求：
- 保持显式 files 参数优先级不变。
- 有 active 或 todo specs 时，默认仍只选 active/todo，不混入 review。
- 只有 review specs 时，selected specs 应包含 review specs 文本。
- Open TODOs 和 Recommended Next Step 应基于新的 selected specs 状态正确渲染。
- 更新 smoke 或单元测试覆盖 review-only spec_context selected specs 行为。
- 验证 bun run build、bun test/unit.ts、bun test/smoke.ts、bun run release:check、git diff --check。

### Changed Files

- `src/spec/context.ts`
- `src/spec/workflow-next-step.ts`
- `test/smoke.ts`

### Verification

- passed `bun run build`：TypeScript 构建通过。
- passed `bun test/unit.ts`：单元测试通过。
- passed `bun test/smoke.ts`：review-only spec_context 现在包含 review 正文并继续推荐 spec_create。
- passed `bun run release:check`：发布契约检查通过。
- passed `git diff --check`：退出码为 0，仅出现 Windows LF/CRLF 提示。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| review-only 默认选中 | 没有 active/todo specs，但存在 review specs，且未显式传 files | spec_context 默认读取 review specs 并把它们作为 selected specs 渲染到上下文。 | 显式 files 参数仍优先；存在 active 或 todo specs 时默认只选 active/todo。 | 未记录 | bun test/smoke.ts | `src/spec/context.ts`<br>`test/smoke.ts` |
| review-only 下一步推荐 | review specs 被选中但项目仍没有 active/todo | Recommended Next Step 仍推荐 spec_create，引导 AI 阅读 review 后创建 active spec，而不是直接 checkpoint。 | 未记录 | 未记录 | bun test/smoke.ts | `src/spec/workflow-next-step.ts`<br>`test/smoke.ts` |
| 无 TODO 说明 | review spec 没有未完成 TODO | Open TODOs 区域提示按 selected specs 的目标、行为规则和验收标准执行。 | 未记录 | 未记录 | bun test/smoke.ts | `src/spec/context-markdown.ts`<br>`test/smoke.ts` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T16:56:03.822Z
- note: review-only spec_context 默认选中 review specs 已完成并通过验收。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| review-only 默认选中 | 没有 active/todo specs，但存在 review specs，且未显式传 files | spec_context 默认读取 review specs 并把它们作为 selected specs 渲染到上下文。 | 显式 files 参数仍优先；存在 active 或 todo specs 时默认只选 active/todo。 | 未记录 | bun test/smoke.ts | `src/spec/context.ts`<br>`test/smoke.ts` |
| review-only 下一步推荐 | review specs 被选中但项目仍没有 active/todo | Recommended Next Step 仍推荐 spec_create，引导 AI 阅读 review 后创建 active spec，而不是直接 checkpoint。 | 未记录 | 未记录 | bun test/smoke.ts | `src/spec/workflow-next-step.ts`<br>`test/smoke.ts` |
| 无 TODO 说明 | review spec 没有未完成 TODO | Open TODOs 区域提示按 selected specs 的目标、行为规则和验收标准执行。 | 未记录 | 未记录 | bun test/smoke.ts | `src/spec/context-markdown.ts`<br>`test/smoke.ts` |
