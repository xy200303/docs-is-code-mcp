# 完善 specc init 命令体验

## Meta

- status: done
- source: user-prompt

## 用户原始描述

为 specc init 增加命令级帮助和参数校验，提升 CLI 一致性。

目标：
- 运行 `specc init --help` 或 `specc init -h` 时，只输出 init 命令用法，不进入交互选择。
- 未知长参数必须 Fail Fast，例如 `specc init --unknown` 应明确报错。
- 保持现有 init 初始化行为不变。
- 如有必要，更新 smoke 测试、README 或 release-check，确保 CLI 文档和验证覆盖该行为。

验收：
- `bun run build` 通过。
- `bun test/smoke.ts` 通过。
- `bun test/unit.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。

实际行为记录要求：
- done 文档需要中文记录 init help 分支、未知参数分支和普通 init 分支的实际行为。

## TODO

- [x] 为 specc init 增加命令级帮助和参数校验，提升 CLI 一致性。
- [x] 目标：
- [x] 运行 `specc init --help` 或 `specc init -h` 时，只输出 init 命令用法，不进入交互选择。
- [x] 未知长参数必须 Fail Fast，例如 `specc init --unknown` 应明确报错。
- [x] 保持现有 init 初始化行为不变。
- [x] 如有必要，更新 smoke 测试、README 或 release-check，确保 CLI 文档和验证覆盖该行为。
- [x] 验收：
- [x] `bun run build` 通过。
- [x] `bun test/smoke.ts` 通过。
- [x] `bun test/unit.ts` 通过。
- [x] `bun run release:check` 通过。
- [x] `git diff --check` 通过。
- [x] 实际行为记录要求：
- [x] done 文档需要中文记录 init help 分支、未知参数分支和普通 init 分支的实际行为。

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

- at: 2026-06-20T15:28:08.557Z
- summary: 完成 specc init 命令级帮助和未知长参数校验，保持普通 init 注册流程不变，并补齐 CLI 契约、README、smoke/unit/release-check 覆盖。

### Summary

- 完成 specc init 命令级帮助和未知长参数校验，保持普通 init 注册流程不变，并补齐 CLI 契约、README、smoke/unit/release-check 覆盖。

### Completed TODOs

- 为 specc init 增加命令级帮助和参数校验，提升 CLI 一致性。
- 目标：
- 运行 `specc init --help` 或 `specc init -h` 时，只输出 init 命令用法，不进入交互选择。
- 未知长参数必须 Fail Fast，例如 `specc init --unknown` 应明确报错。
- 保持现有 init 初始化行为不变。
- 如有必要，更新 smoke 测试、README 或 release-check，确保 CLI 文档和验证覆盖该行为。
- 验收：
- `bun run build` 通过。
- `bun test/smoke.ts` 通过。
- `bun test/unit.ts` 通过。
- `bun run release:check` 通过。
- `git diff --check` 通过。
- 实际行为记录要求：
- done 文档需要中文记录 init help 分支、未知参数分支和普通 init 分支的实际行为。

### Changed Files

- `src/cli/command-init.ts`
- `src/cli/main.ts`
- `src/cli/compatibility-contract.ts`
- `test/smoke.ts`
- `test/unit.ts`
- `scripts/release-check.mjs`
- `README.md`

### Verification

- passed `bun run build`：TypeScript 编译通过。
- passed `bun test/unit.ts`：CLI help 契约新增 init help 断言通过。
- passed `bun test/smoke.ts`：覆盖 init --help、help 优先级和未知长参数 Fail Fast。
- passed `bun run release:check`：README 和发布契约包含 specc init --help。
- passed `git diff --check`：仅出现 Windows LF/CRLF 提示，无空白错误。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| init help 分支 | 命令参数包含 `--help` 或 `-h` | 只输出 `specc init [options]` 用法和 `-h, --help` 说明，不扫描工具、不进入交互注册。 | help 参数优先于未知参数校验。 | 当 `--unknown-option --help` 同时存在时仍输出 help，和 bootstrap/status 的帮助优先行为一致。 | bun test/smoke.ts | `src/cli/command-init.ts`<br>`test/smoke.ts` |
| init 未知长参数分支 | 命令参数包含未知 `--xxx` 且没有 help 参数 | 立即抛出 `Unknown option: --xxx`，不进入交互流程。 | 当前 init 只接受 `--help` 作为已知长参数。 | 短参数只定义 `-h` 为 help；未知长参数按 Fail Fast 处理。 | bun test/smoke.ts | `src/cli/command-init.ts`<br>`src/cli/cli-options.ts`<br>`test/smoke.ts` |
| 普通 init 注册分支 | 运行 `specc init` 且没有 help 或未知长参数 | 继续扫描本机支持的 AI 编程工具，并通过交互选择注册 MCP。 | 不传参数时保持原有注册流程。 | 本次没有修改 detect/register 逻辑，避免影响已有 Codex、Claude、OpenCode、Cursor、Continue、Windsurf 注册行为。 | bun run build; bun test/smoke.ts | `src/cli/command-init.ts`<br>`src/cli/main.ts` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T15:28:23.316Z
- note: 已完成 specc init 命令帮助、未知参数校验、测试和文档契约更新。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| init help 分支 | 命令参数包含 `--help` 或 `-h` | 只输出 init 命令帮助，不扫描工具、不进入交互注册。 | help 参数优先处理。 | `specc init --unknown-option --help` 仍输出 help，保持与其他子命令一致。 | bun test/smoke.ts | `src/cli/command-init.ts`<br>`test/smoke.ts` |
| init 未知长参数分支 | 命令参数包含未知 `--xxx` 且没有 help 参数 | 立即报错 `Unknown option: --xxx`，不进入交互流程。 | 只允许 `--help` 长参数。 | 用于提前暴露拼写错误，符合 Fail Fast。 | bun test/smoke.ts | `src/cli/command-init.ts`<br>`src/cli/cli-options.ts` |
| 普通 init 注册分支 | 运行 `specc init` 且不传额外参数 | 保持原行为：扫描支持的 AI 编程工具并让用户选择注册 MCP。 | 无参数时进入交互注册流程。 | 本次未改动 detect/register 实现，避免影响已有工具注册。 | bun run build; bun test/smoke.ts | `src/cli/command-init.ts`<br>`src/cli/main.ts` |
