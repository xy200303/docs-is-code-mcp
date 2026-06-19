# 会话级 spec_context 强制护栏

## Meta

- status: todo
- source: user-prompt

## 用户原始描述

1. 在 MCP server 里增加会话级护栏：未调用 spec_context 前，拒绝 spec_create、spec_todo、spec_generate_agents、spec_checkpoint、spec_review_result、spec_done 等会修改文件或推进实现的工具。
2. 为护栏增加清晰的错误信息，并在工具描述和文档里说明“先 spec_context，后写操作”的硬约束。
3. 更新 smoke 测试，验证未先调用 spec_context 时写操作会被拒绝，调用后可以继续执行。
4. 运行构建和 smoke 测试并记录结果。

## TODO

- [x] 1. 在 MCP server 里增加会话级护栏：未调用 spec_context 前，拒绝 spec_create、spec_todo、spec_generate_agents、spec_checkpoint、spec_review_result、spec_done 等会修改文件或推进实现的工具。
- [x] 2. 为护栏增加清晰的错误信息，并在工具描述和文档里说明“先 spec_context，后写操作”的硬约束。
- [x] 3. 更新 smoke 测试，验证未先调用 spec_context 时写操作会被拒绝，调用后可以继续执行。
- [x] 4. 运行构建和 smoke 测试并记录结果。

## 执行要求

- AI 必须按未勾选 TODO 从上到下执行。
- 完成任务后把对应项改成 `[x]`。
- 无法完成的任务保持 `[ ]`，并在任务下方写明阻塞原因。

## 工程质量约束

这些规则是强制约束，不是建议。

- KISS + YAGNI：先做最简单可用的方案，不为尚未发生的需求预埋复杂度。
- Clean Code：命名自解释、函数短小、低嵌套、DRY、显式优于隐式、注释只解释为什么。
- Clean Architecture：领域、应用、接口、基础设施分层清晰，依赖向内，按业务能力组织模块。
- DDD：业务规则放在领域模型里，用统一语言表达实体、值对象和规则。
- SOLID + SoC + 组合优于继承：职责单一，关注点分离，依赖抽象而不是实现。
- Fail Fast：尽早校验输入、依赖和前置条件，发现无效状态就立即报错。
- 测试优先：核心逻辑必须可单测，优先写可测、确定性的代码。
- 代码必须简单、清晰、可读、可测试，围绕业务语义保持高内聚低耦合。
- 高内聚低耦合：文件和目录按业务语义拆分，避免单文件堆砌和目录平铺。
- 向后兼容：小步修改，尽量不破坏已有 API、数据和行为契约。
- 成熟库优先：能用成熟库解决的就不要手搓轮子；引入新依赖前先确认必要性。
- 风险先确认：不明确、影响面大或高风险的方案必须先问用户，不要自行拍板。
- 文件顶部必须写文件注释，复杂逻辑必须写说明性注释，但不要写废话。
- UI/交互必须符合人类直觉，状态完整、文案简洁、布局清楚。
- 遵循现有项目风格、命名、框架和目录约定；优先复用项目已有命令并记录验证结果。
- Boy Scout Rule：每次修改都顺手清理一点，但不要借机做无关的大重构。
- 禁止在一个文件里混合 UI、业务、数据访问逻辑；禁止在领域层引用 Web / DB 框架。
- 禁止为了模式而模式：不要无故引入接口、工厂、泛型、抽象层。
- 修改已有代码时：优先局部小步重构，不改无关逻辑，不重排无意义的代码结构。
- 性能与资源：避免不必要的高复杂度；必要时先说明原因并补测试，不阻塞主线程，不泄露连接、内存或文件句柄。

## Checkpoint

- at: 2026-06-19T07:12:14.434Z
- summary: 已在 MCP server 中加入会话级护栏雏形：spec_context 会解锁当前会话写操作，spec_create/spec_todo/spec_generate_agents/spec_checkpoint/spec_review_result/spec_done 等写操作会在未先调用 spec_context 时被拒绝；同时保留现有上下文和文档约束。
- note: 写操作现在会被会话级护栏拦下，先 spec_context 再推进。

### Summary

- 已在 MCP server 中加入会话级护栏雏形：spec_context 会解锁当前会话写操作，spec_create/spec_todo/spec_generate_agents/spec_checkpoint/spec_review_result/spec_done 等写操作会在未先调用 spec_context 时被拒绝；同时保留现有上下文和文档约束。

### Completed TODOs

- 1. 在 MCP server 里增加会话级护栏：未调用 spec_context 前，拒绝 spec_create、spec_todo、spec_generate_agents、spec_checkpoint、spec_review_result、spec_done 等会修改文件或推进实现的工具。
- 4. 运行构建和 smoke 测试并记录结果。

### Changed Files

- `src/server.ts`
- `src/spec/types.ts`
- `src/spec/templates.ts`
- `test/smoke.ts`
- `specs/todo/2026-06-19-spec-context.md`

### Verification

- passed `bun run build`：TypeScript build passed
- passed `bun test/smoke.ts`：Smoke test passed; extra EPERM line remains from local cleanup

### Risks

- 当前护栏仅对当前会话生效；若后续需要更严格的持久会话状态，需要再评估 MCP 侧会话管理能力。
- 模板里的 review spec 前置要求仍需要补齐到完全一致。

### Blockers

- 无

## Checkpoint

- at: 2026-06-19T13:33:37.087Z
- summary: 补强会话级 spec_context 护栏：统一写操作拒绝消息和工具描述，更新 smoke 测试验证未先调用 spec_context 时写操作会被拒绝、调用后可继续执行
- note: 当前护栏已进入工具描述、错误消息和 smoke 断言三重一致状态。

### Summary

- 补强会话级 spec_context 护栏：统一写操作拒绝消息和工具描述，更新 smoke 测试验证未先调用 spec_context 时写操作会被拒绝、调用后可继续执行

### Completed TODOs

- 2. 为护栏增加清晰的错误信息，并在工具描述和文档里说明“先 spec_context，后写操作”的硬约束。
- 3. 更新 smoke 测试，验证未先调用 spec_context 时写操作会被拒绝，调用后可以继续执行。

### Changed Files

- `src/mcp/session-guard.ts`
- `src/mcp/register-read-tools.ts`
- `src/mcp/register-write-tools.ts`
- `README.md`
- `test/smoke.ts`
- `specs/todo/2026-06-19-spec-context.md`

### Verification

- passed `bun run build`：TypeScript build passed
- passed `bun test/smoke.ts`：Smoke test passed; bun still prints a trailing EPERM warning in this environment

### Risks

- Windows 下 bun test/smoke.ts 仍会在末尾打印 EPERM 噪音，但不影响验证结果

### Blockers

- 无

## Done

- doneAt: 2026-06-19T13:35:56.136Z
- note: Session-level spec_context guard, error text, docs, and smoke coverage are complete.
