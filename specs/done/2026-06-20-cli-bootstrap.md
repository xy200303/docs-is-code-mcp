# 为 CLI 增加 bootstrap 命令

## Meta

- status: done
- source: user-prompt

## 用户原始描述

为 specc CLI 增加 bootstrap 命令，对齐 MCP 主入口 spec_bootstrap。命令支持 --project-root、--specs-dir、--project-name、--project-kind、--initial-prompt、--overwrite；projectKind 支持 auto/new/existing，默认 auto。执行时调用现有 bootstrapProject，不重复实现业务逻辑。CLI help 需要展示 bootstrap 用法；README 增加终端用法；smoke/release-check 增加回归覆盖。保持 KISS 和现有 CLI 风格。

## TODO

- [x] 为 specc CLI 增加 bootstrap 命令，对齐 MCP 主入口 spec_bootstrap。命令支持 --project-root、--specs-dir、--project-name、--project-kind、--initial-prompt、--overwrite；projectKind 支持 auto/new/existing，默认 auto。执行时调用现有 bootstrapProject，不重复实现业务逻辑。CLI help 需要展示 bootstrap 用法；README 增加终端用法；smoke/release-check 增加回归覆盖。保持 KISS 和现有 CLI 风格。

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

- at: 2026-06-20T14:56:34.771Z
- summary: 为 specc CLI 增加 bootstrap 命令，复用 MCP 主入口的 bootstrapProject，并补齐帮助、文档和回归测试。

### Summary

- 为 specc CLI 增加 bootstrap 命令，复用 MCP 主入口的 bootstrapProject，并补齐帮助、文档和回归测试。

### Completed TODOs

- 为 specc CLI 增加 bootstrap 命令，对齐 MCP 主入口 spec_bootstrap。命令支持 --project-root、--specs-dir、--project-name、--project-kind、--initial-prompt、--overwrite；projectKind 支持 auto/new/existing，默认 auto。执行时调用现有 bootstrapProject，不重复实现业务逻辑。CLI help 需要展示 bootstrap 用法；README 增加终端用法；smoke/release-check 增加回归覆盖。保持 KISS 和现有 CLI 风格。

### Changed Files

- `src/cli/main.ts`
- `src/cli/compatibility-contract.ts`
- `README.md`
- `scripts/release-check.mjs`
- `test/smoke.ts`
- `test/unit.ts`

### Verification

- passed `bun run build`：TypeScript 构建通过。
- passed `bun test/unit.ts`：CLI help 契约包含 bootstrap。
- passed `bun test/smoke.ts`：覆盖 CLI bootstrap 生成 AGENTS 和 starter active spec。
- passed `bun run release:check`：发布契约覆盖 README 中 specc bootstrap 和 --project-kind 说明。
- passed `node dist/index.js --help`：help 输出包含 specc bootstrap，裸 specc 文案同步为 Show help。
- passed `node dist/index.js bootstrap --project-kind legacy`：按预期 Fail Fast，提示 project-kind 只能为 auto/new/existing。
- passed `git diff --check`：无 whitespace error；仅有 Git LF/CRLF 提示。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| CLI bootstrap 默认引导 | 运行 specc bootstrap，未显式传 projectKind | CLI 调用现有 bootstrapProject，并使用 projectKind=auto 创建 AGENTS、specs 和项目入口。 | projectRoot 默认 process.cwd()；specsDir 默认 specs；projectKind 默认 auto；overwrite 默认 false。 | 不在 CLI 里重复实现新/旧项目判断，避免和 MCP spec_bootstrap 逻辑分叉。 | bun test/smoke.ts | `src/cli/main.ts`<br>`src/spec/scaffold.ts`<br>`test/smoke.ts` |
| CLI bootstrap 新项目参数 | 运行 specc bootstrap --project-kind new --initial-prompt ... | 生成 AGENTS.md 和起步 active spec，active spec 使用 initialPrompt。 | projectName 未传时沿用 inferProjectName。 | --overwrite 仅作为显式 flag，默认保留已有文件。 | bun test/smoke.ts | `src/cli/main.ts`<br>`test/smoke.ts` |
| 非法 project-kind | 运行 specc bootstrap --project-kind legacy | 立即抛出可理解错误：--project-kind must be one of: auto, new, existing。 | 不创建文件，不进入 bootstrapProject。 | 缺少 option value 时 optionValue 也会立即报 Missing value。 | node dist/index.js bootstrap --project-kind legacy | `src/cli/main.ts` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T14:56:48.586Z
- note: CLI bootstrap now mirrors the MCP spec_bootstrap entrypoint while reusing bootstrapProject.

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| CLI bootstrap 默认引导 | 运行 specc bootstrap，未显式传 projectKind | CLI 调用现有 bootstrapProject，并使用 projectKind=auto 创建 AGENTS、specs 和项目入口。 | projectRoot 默认 process.cwd()；specsDir 默认 specs；projectKind 默认 auto；overwrite 默认 false。 | 不在 CLI 里重复实现新/旧项目判断，避免和 MCP spec_bootstrap 逻辑分叉。 | bun test/smoke.ts | `src/cli/main.ts`<br>`src/spec/scaffold.ts`<br>`test/smoke.ts` |
| CLI bootstrap 新项目参数 | 运行 specc bootstrap --project-kind new --initial-prompt ... | 生成 AGENTS.md 和起步 active spec，active spec 使用 initialPrompt。 | projectName 未传时沿用 inferProjectName。 | --overwrite 仅作为显式 flag，默认保留已有文件。 | bun test/smoke.ts | `src/cli/main.ts`<br>`test/smoke.ts` |
| 非法 project-kind | 运行 specc bootstrap --project-kind legacy | 立即抛出可理解错误：--project-kind must be one of: auto, new, existing。 | 不创建文件，不进入 bootstrapProject。 | 缺少 option value 时 optionValue 也会立即报 Missing value。 | node dist/index.js bootstrap --project-kind legacy | `src/cli/main.ts` |
