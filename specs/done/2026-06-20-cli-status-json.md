# 为 CLI status 增加 JSON 输出

## Meta

- status: done
- source: user-prompt

## 用户原始描述

为 specc status 增加 --json 参数，输出机器可读 JSON，字段包含 name、version、projectRoot、specsDir、workflowState(active/todo/review/done) 和 nextStep。JSON 模式必须保持只读，不启动 MCP server、不写文件；--help 优先于 --json。更新 specc status --help、README、release-check、smoke/unit 测试。保持 KISS，不引入新依赖。

## TODO

- [x] 为 specc status 增加 --json 参数，输出机器可读 JSON，字段包含 name、version、projectRoot、specsDir、workflowState(active/todo/review/done) 和 nextStep。JSON 模式必须保持只读，不启动 MCP server、不写文件；--help 优先于 --json。更新 specc status --help、README、release-check、smoke/unit 测试。保持 KISS，不引入新依赖。

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

- at: 2026-06-20T15:07:53.759Z
- summary: 为 specc status 增加 --json 机器可读输出，普通文本和 JSON 共用同一份只读状态报告。

### Summary

- 为 specc status 增加 --json 机器可读输出，普通文本和 JSON 共用同一份只读状态报告。

### Completed TODOs

- 为 specc status 增加 --json 参数，输出机器可读 JSON，字段包含 name、version、projectRoot、specsDir、workflowState(active/todo/review/done) 和 nextStep。JSON 模式必须保持只读，不启动 MCP server、不写文件；--help 优先于 --json。更新 specc status --help、README、release-check、smoke/unit 测试。保持 KISS，不引入新依赖。

### Changed Files

- `src/cli/main.ts`
- `README.md`
- `scripts/release-check.mjs`
- `test/smoke.ts`

### Verification

- passed `bun run build`：TypeScript 构建通过。
- passed `bun test/unit.ts`：CLI 契约测试保持通过。
- passed `bun test/smoke.ts`：覆盖 status --json、active/empty 状态和 --help 优先级。
- passed `bun run release:check`：发布契约覆盖 README 中 status --json 说明。
- passed `node dist/index.js status --project-root . --json`：真实 dist 输出 JSON，包含 name/version/projectRoot/specsDir/workflowState/nextStep。
- passed `node dist/index.js status --json --help`：--help 优先于 --json，输出帮助文本。
- passed `git diff --check`：无 whitespace error；仅有 Git LF/CRLF 提示。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| status JSON 输出 | 运行 specc status --json | 输出机器可读 JSON，包含 name、version、projectRoot、specsDir、workflowState(active/todo/review/done) 和 nextStep。 | JSON 和文本输出共用同一个 statusReport，避免状态计算分叉。 | JSON 模式仍只调用 listSpecs，不启动 MCP server、不写文件。 | bun test/smoke.ts; node dist/index.js status --project-root . --json | `src/cli/main.ts`<br>`test/smoke.ts` |
| help 优先级 | 运行 specc status --json --help | 输出 status 帮助文本，不输出 JSON。 | --help/-h 在 runStatus 开头优先返回。 | 同时传入 --json 时仍以帮助为准。 | node dist/index.js status --json --help | `src/cli/main.ts` |
| 文档和发布契约 | 运行 bun run release:check | README 必须说明 specc status --project-root . --json。 | release-check 继续做静态契约检查。 | 删除 JSON 用法说明时发布检查失败。 | bun run release:check | `README.md`<br>`scripts/release-check.mjs` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T15:08:09.538Z
- note: specc status now supports machine-readable JSON diagnostics.

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| status JSON 输出 | 运行 specc status --json | 输出机器可读 JSON，包含 name、version、projectRoot、specsDir、workflowState(active/todo/review/done) 和 nextStep。 | JSON 和文本输出共用同一个 statusReport，避免状态计算分叉。 | JSON 模式仍只调用 listSpecs，不启动 MCP server、不写文件。 | bun test/smoke.ts; node dist/index.js status --project-root . --json | `src/cli/main.ts`<br>`test/smoke.ts` |
| help 优先级 | 运行 specc status --json --help | 输出 status 帮助文本，不输出 JSON。 | --help/-h 在 runStatus 开头优先返回。 | 同时传入 --json 时仍以帮助为准。 | node dist/index.js status --json --help | `src/cli/main.ts` |
| 文档和发布契约 | 运行 bun run release:check | README 必须说明 specc status --project-root . --json。 | release-check 继续做静态契约检查。 | 删除 JSON 用法说明时发布检查失败。 | bun run release:check | `README.md`<br>`scripts/release-check.mjs` |
