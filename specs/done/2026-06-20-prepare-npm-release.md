# 移除 Prepare npm release 工作流

## Meta

- status: done
- source: user-prompt

## 用户原始描述

移除 Prepare npm release 工作流，回到旧式手动发布：开发者本地手动修改 package.json/package-lock.json 版本并提交，然后创建并 push vX.Y.Z tag，触发现有 Publish npm workflow。删除 .github/workflows/prepare-npm-release.yml，更新 README 发布说明，更新 release-check 不再读取或检查 prepare workflow，只保留 publish workflow 契约。

## TODO

- [x] 移除 Prepare npm release 工作流，回到旧式手动发布：开发者本地手动修改 package.json/package-lock.json 版本并提交，然后创建并 push vX.Y.Z tag，触发现有 Publish npm workflow。删除 .github/workflows/prepare-npm-release.yml，更新 README 发布说明，更新 release-check 不再读取或检查 prepare workflow，只保留 publish workflow 契约。

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

- at: 2026-06-20T14:24:45.753Z
- summary: 移除 Prepare npm release workflow，恢复本地手动修改版本、提交、打 tag、push tag 触发 npm 发布的旧式流程。

### Summary

- 移除 Prepare npm release workflow，恢复本地手动修改版本、提交、打 tag、push tag 触发 npm 发布的旧式流程。

### Completed TODOs

- 移除 Prepare npm release 工作流，回到旧式手动发布：开发者本地手动修改 package.json/package-lock.json 版本并提交，然后创建并 push vX.Y.Z tag，触发现有 Publish npm workflow。删除 .github/workflows/prepare-npm-release.yml，更新 README 发布说明，更新 release-check 不再读取或检查 prepare workflow，只保留 publish workflow 契约。

### Changed Files

- `.github/workflows/prepare-npm-release.yml`
- `README.md`
- `scripts/release-check.mjs`

### Verification

- passed `bun run release:check`：发布契约检查通过；确认 prepare workflow 已移除且 publish workflow 契约保留。
- passed `bun test/smoke.ts`：smoke 测试通过；Bun 末尾输出已知 EPERM 警告但退出码为 0。
- passed `bun test/unit.ts`：unit 测试通过；Bun 末尾输出已知 EPERM 警告但退出码为 0。
- passed `git diff --check`：无 whitespace error；仅有 Git LF/CRLF 提示。
- passed `bun run build`：TypeScript 构建通过。

### 实际行为记录

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| 手动 tag 发布 | 开发者发布新版 | 开发者本地运行 npm version、npm install --package-lock-only、npm run verify、git commit、git tag、git push origin main 和 git push origin vX.Y.Z。 | Publish npm workflow 由 vX.Y.Z tag 触发，继续校验 tag 和 package.json 版本一致后发布 npm。 | 如果 tag 已存在但 npm 未发布成功，需要手动删除并重建同版本 tag。 | bun run release:check | `README.md`<br>`.github/workflows/publish-npm.yml` |
| Prepare workflow 移除 | 运行 bun run release:check | release-check 确认 .github/workflows/prepare-npm-release.yml 不存在，不再检查 prepare workflow。 | release-check 仍检查 publish workflow 使用 verify、NPM_TOKEN 和 npm publish。 | 如果 prepare workflow 被重新加入，release-check 会失败。 | bun run release:check | `scripts/release-check.mjs` |

### Risks

- 无

### Blockers

- 无

## Done

- doneAt: 2026-06-20T14:25:05.032Z
- note: Prepare npm release workflow removed; manual version/tag publishing restored.

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| 手动 tag 发布 | 开发者发布新版 | 开发者本地运行 npm version、npm install --package-lock-only、npm run verify、git commit、git tag、git push origin main 和 git push origin vX.Y.Z。 | Publish npm workflow 由 vX.Y.Z tag 触发，继续校验 tag 和 package.json 版本一致后发布 npm。 | 如果 tag 已存在但 npm 未发布成功，需要手动删除并重建同版本 tag。 | bun run release:check | `README.md`<br>`.github/workflows/publish-npm.yml` |
| Prepare workflow 移除 | 运行 bun run release:check | release-check 确认 .github/workflows/prepare-npm-release.yml 不存在，不再检查 prepare workflow。 | release-check 仍检查 publish workflow 使用 verify、NPM_TOKEN 和 npm publish。 | 如果 prepare workflow 被重新加入，release-check 会失败。 | bun run release:check | `scripts/release-check.mjs` |
