# MCP 工具

Spec Coding MCP 提供一组面向 AI 编程的工具。它们不要求用户手写 ID，也不要求维护 change log。

| 工具 | 作用 | 常见时机 |
| --- | --- | --- |
| `spec_init` | 初始化 specs 目录和模板 | 项目第一次接入 |
| `spec_generate_from_source` | 从现有源码反推 review specs | 旧项目审查 |
| `spec_create` | 根据用户描述创建 active spec | 新需求开始 |
| `spec_todo` | 根据用户描述创建可执行 TODO 清单 | 拆分轻量任务 |
| `spec_list` | 列出 review、active、todo、done specs | 查找当前规格 |
| `spec_context` | 返回 AI 实现代码需要的 spec 和 TODO 上下文 | 开始写代码前 |
| `spec_checkpoint` | 记录实现结果、验证、风险和阻塞 | 阶段性完成后 |
| `spec_review_result` | 记录结构化阶段结果和未完成项 | 阶段回顾/交接 |
| `spec_done` | 验证通过后归档 spec | 功能完成后 |

## spec_context 的角色

`spec_context` 是真正给 AI 写代码前使用的工具。它应该返回：

- 当前 active spec 的完整内容
- `specs/todo/` 和 active spec 中的未完成 TODO
- 全局工程质量约束
- 相关 review spec 摘要
- 可能相关的源码路径
- package scripts、测试文件、路由、导出符号、引用关系
- 建议验证命令
- 完成后调用 `spec_checkpoint` 的提醒
- 完成后需要调用 `spec_done` 的提醒

`spec_context` 会要求 AI 按未勾选 TODO 从上到下执行；完成后把任务改为 `[x]`，无法完成时保留未勾选并说明阻塞原因。

## spec_checkpoint 的角色

`spec_checkpoint` 用于在实现后把事实写回 spec 或 TODO：

- 自动勾选匹配到的 completed TODO
- 记录实现摘要和变更文件
- 记录验证命令的 passed、failed 或 not-run 状态
- 记录风险和阻塞项

复杂项目里建议每完成一组相关 TODO 就记录一次 checkpoint，再继续下一组任务。

## spec_review_result 的角色

`spec_review_result` 适合回写一轮开发的结构化结果：

- completed TODOs
- incomplete TODOs
- changed files
- verification status
- risks
- blockers

它比 checkpoint 更像一次正式交接，尤其适合复杂项目的阶段性收尾。

## 全局工程质量约束

`spec_context` 会强制要求 AI：

- 这些规则是强制约束，不是建议。
- 代码清晰、必要、可维护，避免冗余代码和废话注释。
- 强制遵守 KISS、DRY、SOLID 和 Boy Scout Rule。
- 文件顶部必须写文件注释，复杂逻辑必须写说明性注释，但不能写废话。
- 能用成熟库解决的就优先用成熟库，不要自己手搓已有轮子。
- 遇到不明确、影响面大或高风险的方案时，先向用户询问和确认，不要自己拍板。
- 遵循现有项目风格、命名、框架和目录约定。
- 保持职责边界，不把所有代码放在一个文件，也不把所有文件放在一个目录。
- 让模块、函数、组件便于人类和 AI 阅读。
- 设计 UI 时符合人类直觉，交互状态完整，信息层级清楚。
- 修改范围贴合 spec/TODO，不做无关重构。

## 为什么不做复杂状态同步

复杂的文档状态同步很容易变成另一个系统。Spec Coding MCP 选择更小的边界：

- review 表示“从源码反推的当前事实”
- active 表示“接下来要实现的规格”
- todo 表示“本轮要按顺序执行的轻量任务”
- done 表示“已经实现并验证过的规格”

AI 不需要猜测所有历史变更，只需要围绕当前 spec 完成一次明确开发。
