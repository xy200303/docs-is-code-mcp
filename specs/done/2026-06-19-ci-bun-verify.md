# CI 安装 Bun 运行 verify

## Meta

- status: todo
- source: user-prompt

## 用户原始描述

更新 CI workflow，在 npm run verify 前安装 Bun，确保 unit/smoke/release:check 可执行。
更新 npm publish workflow，在 npm run verify 前安装 Bun，确保发布前验证可执行。
扩展 release-check，检查 CI 和 publish workflow 都包含 Bun 安装步骤。
运行验证并归档 TODO。

## TODO

- [x] 更新 CI workflow，在 npm run verify 前安装 Bun，确保 unit/smoke/release:check 可执行。
- [x] 更新 npm publish workflow，在 npm run verify 前安装 Bun，确保发布前验证可执行。
- [x] 扩展 release-check，检查 CI 和 publish workflow 都包含 Bun 安装步骤。
- [x] 运行验证并归档 TODO。

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

- at: 2026-06-19T16:48:56.385Z
- summary: CI 和 npm publish workflow 已在 npm run verify 前安装 Bun，release-check 已增加对应 workflow 契约检查。

### Summary

- CI 和 npm publish workflow 已在 npm run verify 前安装 Bun，release-check 已增加对应 workflow 契约检查。

### Completed TODOs

- 更新 CI workflow，在 npm run verify 前安装 Bun，确保 unit/smoke/release:check 可执行。
- 更新 npm publish workflow，在 npm run verify 前安装 Bun，确保发布前验证可执行。
- 扩展 release-check，检查 CI 和 publish workflow 都包含 Bun 安装步骤。
- 运行验证并归档 TODO。

### Changed Files

- `.github/workflows/ci.yml`
- `.github/workflows/publish-npm.yml`
- `scripts/release-check.mjs`

### Verification

- passed `bun run release:check`：Workflow Bun setup contract passed.
- passed `bun run build`：TypeScript build passed.
- passed `bun run unit`：Focused unit tests passed; trailing Windows/Bun EPERM noise did not affect exit code.
- passed `bun run smoke`：End-to-end smoke passed; trailing Windows/Bun EPERM noise did not affect exit code.

### Risks

- Workflow uses oven-sh/setup-bun@v2 so GitHub Actions must be able to fetch external marketplace actions.

### Blockers

- 无

## Done

- doneAt: 2026-06-19T16:49:05.164Z
- note: CI 和 npm publish 已安装 Bun 后运行 npm run verify；release-check 已保护该契约。
