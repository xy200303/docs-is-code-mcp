# 增加 Skills 搜索安装工具与 UI UX 默认 Skill

## Meta

- status: done
- source: user-prompt

## 用户原始描述

增加一个 skills 搜索和安装能力：

1. Spec Coding MCP 增加 skills 搜索和安装工具。
2. 模型可以去 skills.sh 搜索自己需要的 skills 来完成复杂任务。
3. 安装默认使用 `npx skills add`。
4. 安装默认目标是对应编程工具的全局 skills 目录。
5. 将 `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill` 作为内置/推荐 skills，自动安装到 skills 全局目录。
6. UI/UX 设计任务默认使用这个 `ui-ux-pro-max` skill。
7. 注意不要把 OSS 官网入口默认强加给企业官网等非 OSS 场景；UI/UX guidance 应保持基于项目语境生成文案和结构。

## 目标

- 根据用户描述实现对应行为。

## 影响范围

- 后端/API：待 Codex 根据代码定位
- 前端/客户端：待 Codex 根据代码定位
- 数据/迁移：待 Codex 根据代码定位
- 测试：必须新增或更新

## 行为规则

| 场景 | 条件 | 预期结果 |
|---|---|---|
| 正常 | 满足业务前置条件 | 完成目标行为 |
| 失败 | 参数、权限、状态或依赖异常 | 返回可理解错误，不产生未声明副作用 |

## AI 实现计划

- 目标能力：待 Codex 阅读代码后补充要新增、修改或移除的业务能力。
- 阅读入口：列出已读取或必须读取的源码、测试、配置和文档。
- 改动文件：列出计划修改的文件和每个文件承担的职责。
- 数据流：描述触发入口、输入与前置状态、执行步骤、输出结果、副作用和持久化边界。
- 分支处理：列出正常、失败、边界、权限、状态和异常分支。
- 默认值/配置：列出默认参数、配置来源、覆盖规则和环境差异。
- 验证命令：列出计划运行的测试、构建、lint 或人工验证命令。
- 待确认问题：列出业务规则不明确、影响面大或高风险的点；未确认前不要实现。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## 验收标准

- 代码行为符合本 spec。
- 测试覆盖正常流程和关键失败分支。

## 开发前置要求

在修改任何代码或文档之前，必须先调用 `spec_context` 并读取输出。
如果当前任务还没有 `spec_context` 输出，就不要开始实现、重构或改写文档。

## TODO

- [x] 定位相关实现和测试。
- [x] 按本 spec 修改代码。
- [x] 新增或更新测试。
- [x] 运行验证命令并记录结果。

## Done

- doneAt: 2026-06-21T16:06:16.880Z
- note: Skills search/install tools implemented. UI/UX guidance defaults to ui-ux-pro-max skill while keeping project-context and non-template design constraints. Verification passed.

## 最终行为契约

1. 搜索 skills.sh 专项 skill
  - 条件：模型遇到复杂任务，需要寻找更合适的 skill
  - 触发入口：调用 MCP read 工具 `spec_skills_search`
  - 输入与前置状态：projectRoot/specsDir/query/maxChars；query 必填
  - 执行过程：
    1. 工具构造 `npx --yes skills find <query>` 参数
    2. 执行官方 skills CLI
    3. 清理 ANSI 控制字符
    4. 按 maxChars 截断返回文本
    5. 输出后续建议：可用 `spec_skills_install` 安装选中的 skill
  - 输出结果：返回 skills.sh 搜索结果文本、实际命令和 dryRun=false
  - 副作用：联网搜索；不写项目文件或全局 skills 目录
  - 默认行为：maxChars 默认 6000
  - 边界处理：query 为空时抛出 `skills search query is required.`；CLI 失败时返回包含命令、stdout/stderr 的错误
  - 结果摘要：新增 `spec_skills_search` 工具并通过 smoke 描述断言。
  - 验证：bun test/smoke.ts; npx --yes skills find ui-ux --help 手动验证
  - 关联文件：
    - `src/skills/skills-cli.ts`
    - `src/mcp/register-read-tools.ts`
    - `test/smoke.ts`

2. 安装默认 UI/UX skill 到全局 skills
  - 条件：模型或用户需要安装 UI/UX 默认 skill，且当前会话已经调用过 `spec_context`
  - 触发入口：调用 MCP write 工具 `spec_skills_install`，不传 source/skills/agents
  - 输入与前置状态：projectRoot/specsDir；可选 dryRun/global/listOnly/copy/source/skills/agents
  - 执行过程：
    1. write 工具先执行 spec_context guard
    2. 默认 source 为 `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
    3. 默认 skills 为 `ui-ux-pro-max`
    4. 默认 agents 为 `codex`
    5. 默认 global 为 true
    6. 构造 `npx --yes skills add <source> --global --agent codex --skill ui-ux-pro-max --yes`
    7. dryRun=true 时只返回命令；dryRun=false 时执行官方 CLI
  - 输出结果：返回安装命令、dryRun 状态和 CLI 输出；安装成功后提示重启或 reload 目标编程工具
  - 副作用：dryRun=false 会通过 skills CLI 写入对应编程工具的全局 skills 目录；dryRun=true 无写入副作用
  - 默认行为：默认安装到 Codex 全局 skills；`claude` agent 输入会映射为 skills CLI 的 `claude-code`
  - 边界处理：listOnly=true 时只执行 `npx --yes skills add <source> --list`，不带安装 flag；CLI 失败时错误包含命令和输出
  - 结果摘要：新增 `spec_skills_install` 工具，默认命令和自定义命令均由 unit/smoke 覆盖。
  - 验证：npm run verify; node dry-run command check
  - 关联文件：
    - `src/skills/skills-cli.ts`
    - `src/mcp/register-write-tools.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

3. UI/UX 默认使用 ui-ux-pro-max 但不替代项目语境
  - 条件：任务涉及 UI/UX 设计、实现、评审或修复
  - 触发入口：模型读取 `ui-ux` guidance 或 AGENTS/specs README
  - 输入与前置状态：当前 spec、项目文档、用户要求、源码事实和 guidance
  - 执行过程：
    1. guidance 提醒先确保 `ui-ux-pro-max` skill 已安装，未安装时用 `spec_skills_install`
    2. 复杂专项任务可先用 `spec_skills_search` 搜索 skills.sh
    3. 继续执行事实优先、语境优先和去模板化检查
    4. 官网结构按项目类型选择，只有明确 OSS/开源组织时才默认 GitHub/repo/contribution/license 等结构
  - 输出结果：UI/UX 工作优先借助外部 skill，但设计内容仍来自真实项目定位、用户任务和当前 spec
  - 副作用：读取 guidance 无全局写入；安装只在显式调用安装工具时发生
  - 默认行为：UI/UX guidance 默认推荐 `ui-ux-pro-max`，不强制企业官网走 OSS 信息架构
  - 边界处理：如果用户编辑项目 `specs/guidance/ui-ux.md`，项目文件优先，工具不会覆盖用户改动
  - 结果摘要：AGENTS/specs README/UI-UX guidance/docs 已更新，测试断言包含 `ui-ux-pro-max`、`spec_skills_install`、`spec_skills_search` 和 `npx skills add`。
  - 验证：bun test/unit.ts; bun test/smoke.ts; npm run docs:build
  - 关联文件：
    - `src/templates/guidance.ts`
    - `src/templates/agents.ts`
    - `README.md`
    - `docs/guide/mcp-tools.md`
    - `docs/guide/workflow.md`
