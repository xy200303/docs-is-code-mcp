# 补充 status JSON schemaVersion

## Meta

- status: done
- source: user-prompt

## 用户原始描述

为 `specc status --json` 增加稳定的 `schemaVersion` 字段，帮助脚本、CI 和编辑器插件判断机器可读输出契约版本。

目标：
- JSON 输出顶层新增 `schemaVersion`，当前值为 `1`。
- 文本输出不显示 schemaVersion，保持简洁。
- README 说明 `schemaVersion` 用于机器可读契约兼容判断。
- release-check 校验 README 包含 `schemaVersion`。
- 保持现有 `nextStep`、`workflowState`、`recommendation` 字段兼容。

验收：
- smoke 覆盖 `specc status --json` 输出 `schemaVersion: 1`。
- `bun run build` 通过。
- `bun test/unit.ts` 通过。
- `bun test/smoke.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

## TODO

- [x] 为 `specc status --json` 增加稳定的 `schemaVersion` 字段，帮助脚本、CI 和编辑器插件判断机器可读输出契约版本。
- [x] 目标：
- [x] JSON 输出顶层新增 `schemaVersion`，当前值为 `1`。
- [x] 文本输出不显示 schemaVersion，保持简洁。
- [x] README 说明 `schemaVersion` 用于机器可读契约兼容判断。
- [x] release-check 校验 README 包含 `schemaVersion`。
- [x] 保持现有 `nextStep`、`workflowState`、`recommendation` 字段兼容。
- [x] 验收：
- [x] smoke 覆盖 `specc status --json` 输出 `schemaVersion: 1`。
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

- at: 2026-06-20T16:17:16.247Z
- summary: 为 specc status --json 增加顶层 schemaVersion=1，并在 README/release-check 中固定机器可读契约版本说明。

### Summary

- 为 specc status --json 增加顶层 schemaVersion=1，并在 README/release-check 中固定机器可读契约版本说明。

### Completed TODOs

- 为 `specc status --json` 增加稳定的 `schemaVersion` 字段，帮助脚本、CI 和编辑器插件判断机器可读输出契约版本。
- 目标：
- JSON 输出顶层新增 `schemaVersion`，当前值为 `1`。
- 文本输出不显示 schemaVersion，保持简洁。
- README 说明 `schemaVersion` 用于机器可读契约兼容判断。
- release-check 校验 README 包含 `schemaVersion`。
- 保持现有 `nextStep`、`workflowState`、`recommendation` 字段兼容。
- 验收：
- smoke 覆盖 `specc status --json` 输出 `schemaVersion: 1`。
- `bun run build` 通过。
- `bun test/unit.ts` 通过。
- `bun test/smoke.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

### Changed Files

- `src/cli/command-status.ts`
- `test/smoke.ts`
- `README.md`
- `scripts/release-check.mjs`

### Verification

- passed `bun run build`：TypeScript 编译通过。
- passed `bun test/unit.ts`：既有单测通过。
- passed `bun test/smoke.ts`：覆盖三类 status JSON 输出 schemaVersion=1。
- passed `bun run release:check`：README schemaVersion 契约通过。
- passed `git diff --check`：仅出现 Windows LF/CRLF 提示，无空白错误。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| status JSON schemaVersion | 运行 `specc status --json` | JSON 顶层输出 `schemaVersion: 1`。 | 文本 `specc status` 不显示 schemaVersion。 | empty、done-only、active/open TODO 三类 JSON 输出都包含同一版本号。 | bun test/smoke.ts | `src/cli/command-status.ts`<br>`test/smoke.ts` |
| 兼容旧字段 | 消费 status JSON 的旧脚本继续读取 nextStep/workflowState/recommendation | 已有字段保持不变，新增 schemaVersion 不替换旧字段。 | schemaVersion 用于机器可读契约兼容判断。 | 后续 schema 演进可提升版本号。 | bun test/smoke.ts | `src/cli/command-status.ts` |
| 文档发布契约 | 运行 `bun run release:check` | README 必须包含 schemaVersion 说明。 | 文档漂移会导致发布检查失败。 | README 说明当前 schemaVersion 为 1。 | bun run release:check | `README.md`<br>`scripts/release-check.mjs` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T16:17:32.892Z
- note: 已完成 status JSON schemaVersion 契约。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| JSON schemaVersion | 运行 `specc status --json` | 输出顶层 `schemaVersion: 1`。 | 文本输出不显示 schemaVersion。 | 所有 workflow 状态使用同一 schemaVersion。 | bun test/smoke.ts | `src/cli/command-status.ts` |
| 字段兼容 | 旧脚本继续读取 nextStep/workflowState/recommendation | 旧字段保持存在，schemaVersion 只是新增字段。 | 当前机器可读契约版本为 1。 | 后续破坏性 schema 变更可提升版本。 | bun test/smoke.ts | `src/cli/command-status.ts` |
| README 契约 | 运行 release-check | README 必须包含 schemaVersion 说明。 | release-check 防止文档漂移。 | 文档说明 schemaVersion 用于脚本、CI 和编辑器插件判断兼容性。 | bun run release:check | `README.md`<br>`scripts/release-check.mjs` |
