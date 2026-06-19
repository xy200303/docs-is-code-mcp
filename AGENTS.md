# AGENTS.md

Project: Spec Coding MCP

## Operating Rules

1. Before any code or documentation change, call `spec_context` and read its output first.
2. Treat specs and open TODOs as the source of truth.
3. Make small, focused, reversible changes.
4. Follow the engineering and business confirmation rules below.
5. Preserve compatibility unless the spec says otherwise.
6. Prefer mature libraries over hand-rolled implementations.
7. Ask before unclear, risky, or high-impact decisions.
8. Update TODOs, checkpoints, and verification results after each completed item.
9. Keep code organized by business meaning and clear boundaries.
10. Avoid unrelated reshuffles, clever code, and abstraction without benefit.

## Engineering Principles

These rules are mandatory, not suggestions.

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

## Business Confirmation Rules

These rules are mandatory, not suggestions.

- 业务不确定性强制确认：金额、费率、结算、退款、折扣、税费、状态机、并发、幂等、重试、回滚、规则来源不明或角色差异，必须先问清楚。
- 禁止猜业务：不要用常识补规则，不要自行假设边界。
- 澄清格式：说明不清楚之处，给出 2 到 3 种可能解释，等待用户确认。
- 金钱与合规：涉及钱、合规、审计的实现必须有明确来源或产品确认注释。

## Current Task Protocol

- 先读本次 `spec_context`；没有上下文不得实现或改文档。
- selected specs 和 open TODOs 是唯一需求源，不按旧对话扩范围。
- 按 open TODOs 自上而下执行；无 TODO 但有 selected specs 时，按 spec 目标、行为规则和验收标准执行。
- 每完成一个 TODO，必须勾选 `[x]`；无法完成则保留 `[ ]` 并写明阻塞。
- 先读目标、规则、验收标准和代码线索，再搜索代码。
- 源码线索只是搜索入口，不是事实来源；修改前必须自行读取相关文件确认。
- 遵守 Hard Rules、Recommended Practices 和 Business Confirmation Rules；冲突或高风险时先问用户。
- 高风险业务描述不完整时，停止实现，说明疑点并给出 2 到 3 种解释。
- 阶段完成后调用 `spec_checkpoint` 记录 TODO、文件、验证、风险和阻塞。
- 全部完成且验证通过后，再调用 `spec_done` 或按用户要求归档。

## Project Notes

- Configuration should be centralized.
- Example code and production code should stay separate.
- Readme and decision notes should stay up to date.
- Tests live in `test/` and core logic should remain easy to unit test.
