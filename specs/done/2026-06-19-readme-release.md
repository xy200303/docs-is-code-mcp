# 发布 README 门面更新

## Meta

- status: todo
- source: user-prompt

## 用户原始描述

发布 README 门面更新。
将 package 版本从 0.2.1 升级到新的 patch 版本。
运行发布前验证。
提交并推送 main。
创建并推送对应 tag，触发 npm 发布。
验证 npm 最新版本和 GitHub README 更新结果，并回写 TODO。

## TODO

- [x] 发布 README 门面更新。
- [x] 将 package 版本从 0.2.1 升级到新的 patch 版本。
- [x] 运行发布前验证。
- [x] 提交并推送 main。
- [x] 创建并推送对应 tag，触发 npm 发布。
- [x] 验证 npm 最新版本和 GitHub README 更新结果，并回写 TODO。

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

- at: 2026-06-19T17:33:49.199Z
- summary: 发布 README 门面更新为 0.2.2：版本从 0.2.1 升到 0.2.2；修正 APP_VERSION 为从 package.json 读取，避免两个地方维护版本号；release-check 和 unit test 增加防回归检查；提交 ce2abef 已推送 main，tag v0.2.2 已推送并触发 npm 发布。

### Summary

- 发布 README 门面更新为 0.2.2：版本从 0.2.1 升到 0.2.2；修正 APP_VERSION 为从 package.json 读取，避免两个地方维护版本号；release-check 和 unit test 增加防回归检查；提交 ce2abef 已推送 main，tag v0.2.2 已推送并触发 npm 发布。

### Completed TODOs

- 发布 README 门面更新。
- 将 package 版本从 0.2.1 升级到新的 patch 版本。
- 运行发布前验证。
- 提交并推送 main。
- 创建并推送对应 tag，触发 npm 发布。
- 验证 npm 最新版本和 GitHub README 更新结果，并回写 TODO。

### Changed Files

- `README.md`
- `package.json`
- `package-lock.json`
- `src/shared/meta.ts`
- `scripts/release-check.mjs`
- `test/unit.ts`
- `specs/todo/2026-06-19-readme.md`

### Verification

- passed `npm run verify`：build、unit、smoke、release:check 全部通过。
- passed `npm run docs:build`：VitePress 构建通过。
- passed `npm audit --omit=dev --audit-level=high`：生产依赖无 high 漏洞。
- passed `git diff --check`：补丁空白检查通过，仅有 Windows 换行提示。
- passed `npm view @dev_xiaoyun/spec-coding-mcp version --json`：返回 0.2.2。
- passed `Invoke-WebRequest https://raw.githubusercontent.com/xy200303/spec-coding-mcp/main/README.md`：返回 200，包含 npm version badge 和安装命令。

### Risks

- GitHub Actions 状态未通过 gh/API 读取；已通过 npm registry 和 GitHub raw README 验证发布结果。

### Blockers

- 无

## Done

- doneAt: 2026-06-19T17:33:57.435Z
- note: README 门面更新已作为 0.2.2 发布到 npm，并确认 GitHub README 已更新。
