# 移除 behaviorNotes 兼容入口

## Meta

- status: done
- source: user-prompt

## 用户原始描述

项目处于大开发期，不需要兼容旧接口。移除 behaviorNotes 兼容入口，只保留结构化 behaviorRecords。更新类型、MCP schema、checkpoint/review/done writer、行为记录渲染、README 和测试。spec_done 的 warning 仅根据 behaviorRecords 是否为空判断。

## TODO

- [x] 项目处于大开发期，不需要兼容旧接口。移除 behaviorNotes 兼容入口，只保留结构化 behaviorRecords。更新类型、MCP schema、checkpoint/review/done writer、行为记录渲染、README 和测试。spec_done 的 warning 仅根据 behaviorRecords 是否为空判断。

## 执行要求

- 开始前必须先调用 `spec_context`，确认当前 TODO 上下文和工程约束。
- AI 必须按未勾选 TODO 从上到下执行。
- 完成任务后把对应项改成 `[x]`。
- 无法完成的任务保持 `[ ]`，并在任务下方写明阻塞原因。

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

- at: 2026-06-19T18:35:44.642Z
- summary: 移除 behaviorNotes 兼容入口，只保留结构化 behaviorRecords；同步更新 writer、MCP schema、测试和 README 文案。

### Summary

- 移除 behaviorNotes 兼容入口，只保留结构化 behaviorRecords；同步更新 writer、MCP schema、测试和 README 文案。

### Completed TODOs

- 项目处于大开发期，不需要兼容旧接口。移除 behaviorNotes 兼容入口，只保留结构化 behaviorRecords。更新类型、MCP schema、checkpoint/review/done writer、行为记录渲染、README 和测试。spec_done 的 warning 仅根据 behaviorRecords 是否为空判断。

### Changed Files

- `src/spec/behavior-record.ts`
- `src/spec/checkpoint-writer.ts`
- `src/spec/review-result-writer.ts`
- `src/spec/done-writer.ts`
- `src/spec/types.ts`
- `src/mcp/write-schemas.ts`
- `src/mcp/register-write-tools.ts`
- `README.md`
- `test/unit.ts`
- `test/smoke.ts`

### Verification

- passed `bun run build`：TypeScript build passed.
- passed `bun test/unit.ts`：Tests passed; Bun printed sandbox EPERM warning after success.
- passed `bun test/smoke.ts`：Smoke test passed; Bun printed sandbox EPERM warning after success.
- passed `bun run release:check`：Release checks passed; Bun printed sandbox EPERM warning after success.
- passed `git diff --check`：No whitespace errors; Git reported LF-to-CRLF warnings only.

### Risks

- 历史 specs/done 文档中可能仍保留 behaviorNotes 字样，作为旧记录未迁移。

### Blockers

- 无

## Done

- doneAt: 2026-06-19T18:35:54.482Z
- note: 移除 behaviorNotes 兼容入口，仅保留结构化 behaviorRecords。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| 结构化行为记录 API | checkpoint、review result、done 写入实际行为或最终行为契约 | 只接受 behaviorRecords 并渲染中文结构化行为表格 | 字段缺失时显示“未记录”；behaviorRecords 为空时仍渲染占位行，done 返回补充 warning | behaviorNotes 不再作为入参、返回值或转换来源存在 | bun run build; bun test/unit.ts; bun test/smoke.ts; bun run release:check; git diff --check | `src/spec/behavior-record.ts`<br>`src/spec/checkpoint-writer.ts`<br>`src/spec/review-result-writer.ts`<br>`src/spec/done-writer.ts`<br>`src/spec/types.ts`<br>`src/mcp/write-schemas.ts`<br>`src/mcp/register-write-tools.ts`<br>`test/unit.ts`<br>`test/smoke.ts` |
