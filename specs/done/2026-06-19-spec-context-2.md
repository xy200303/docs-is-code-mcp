# 弱化 spec_context 源码结论

## Meta

- status: done
- source: user-prompt

## 用户原始描述

调整 spec_context 的定位：MCP 负责任务流程、约束和搜索线索，不替模型理解源码。默认上下文应避免把候选文件/源码扫描结果表达成事实结论；将 Candidate Files 改成 Suggested Search Targets，并明确这些只是搜索线索，修改前模型必须自行读取文件确认。支持可选 contextMode：workflow 默认只输出流程、spec/TODO、约束和协议；hints 输出轻量源码线索；full 输出完整 source hints。更新 MCP schema、类型、渲染和测试。

## TODO

- [x] 调整 spec_context 的定位：MCP 负责任务流程、约束和搜索线索，不替模型理解源码。默认上下文应避免把候选文件/源码扫描结果表达成事实结论；将 Candidate Files 改成 Suggested Search Targets，并明确这些只是搜索线索，修改前模型必须自行读取文件确认。支持可选 contextMode：workflow 默认只输出流程、spec/TODO、约束和协议；hints 输出轻量源码线索；full 输出完整 source hints。更新 MCP schema、类型、渲染和测试。

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

- at: 2026-06-19T18:12:39.400Z
- summary: 将 spec_context 调整为流程优先：默认 contextMode=workflow 不扫描源码；hints/full 才输出非权威搜索线索；Candidate Files 改为 Suggested Search Targets，并要求模型修改前自行读取文件确认。同步更新 MCP schema、类型、README/AGENTS 和测试。

### Summary

- 将 spec_context 调整为流程优先：默认 contextMode=workflow 不扫描源码；hints/full 才输出非权威搜索线索；Candidate Files 改为 Suggested Search Targets，并要求模型修改前自行读取文件确认。同步更新 MCP schema、类型、README/AGENTS 和测试。

### Completed TODOs

- 调整 spec_context 的定位：MCP 负责任务流程、约束和搜索线索，不替模型理解源码。默认上下文应避免把候选文件/源码扫描结果表达成事实结论；将 Candidate Files 改成 Suggested Search Targets，并明确这些只是搜索线索，修改前模型必须自行读取文件确认。支持可选 contextMode：workflow 默认只输出流程、spec/TODO、约束和协议；hints 输出轻量源码线索；full 输出完整 source hints。更新 MCP schema、类型、渲染和测试。

### Changed Files

- `src/spec/types.ts`
- `src/spec/context.ts`
- `src/spec/context-markdown.ts`
- `src/mcp/register-read-tools.ts`
- `src/templates/prompt-protocol.ts`
- `test/smoke.ts`
- `README.md`
- `AGENTS.md`

### Verification

- passed `bun run build`
- passed `bun test/unit.ts`：测试主体通过；当前沙箱在结束后输出 EPERM 读取用户目录噪声但退出码为 0。
- passed `bun test/smoke.ts`：测试主体通过；当前沙箱在结束后输出 EPERM 读取用户目录噪声但退出码为 0。
- passed `bun run release:check`：契约检查通过；当前沙箱在结束后输出 EPERM 读取用户目录噪声但退出码为 0。
- passed `git diff --check`

### Risks

- 当前运行中的 MCP 进程不会热加载本次源码改动，安装/发布后需要重启会话才会看到 contextMode 新行为。

### Blockers

- 无

## Done

- doneAt: 2026-06-19T18:12:47.889Z
- note: 已将 spec_context 调整为 workflow 默认、hints/full 可选源码线索。
