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
| `spec_guidance_list` | 列出可编辑 guidance 提示词 | 需要校准原则时 |
| `spec_guidance_read` | 读取指定 guidance，例如 engineering、ui-ux、quality-review | 需要具体原则时 |
| `spec_checkpoint` | 记录实现结果、验证、风险和阻塞 | 阶段性完成后 |
| `spec_review_result` | 记录结构化阶段结果和未完成项 | 阶段回顾/交接 |
| `spec_done` | 验证通过后归档 spec | 功能完成后 |

## spec_context 的角色

`spec_context` 是真正给 AI 写代码前使用的工具。它应该返回：

- 当前 active spec 的完整内容
- `specs/todo/` 和 active spec 中的未完成 TODO
- guidance 索引和轻量推荐
- 相关 review spec 摘要
- 可能相关的源码路径
- package scripts、测试文件、路由、导出符号、引用关系
- 建议下一步工具和验证方向
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

## Guidance 与质量约束

`spec_context` 默认保持紧凑，不展开长原则正文。它会列出 `specs/guidance/*.md` 索引，并根据当前 spec/TODO 推荐读取相关 guidance：

- `engineering`：工程边界、代码质量和业务确认规则。
- `ui-ux`：事实优先、语境驱动的 UI/UX 原则。
- `spec-writing`：TODO、checkpoint、done 和行为记录要求。
- `quality-review`：实现后自查代码、测试、架构、UI/交互和交付风险。

UI/UX guidance 会要求模型先确认真实定位、用户、核心对象、事实来源和 CTA，禁止编造指标、客户、性能数据、邮箱、商业定位或社区规模。官网类任务必须按项目类型选择结构；只有明确是 OSS 或开源组织官网时，才默认使用 GitHub、featured repos、贡献路径、docs/roadmap、license/community 等开源结构。

Web 页面验收应确认当前端口服务的是当前项目，检查页面 title/app root 内容，并用桌面和移动端截图确认首屏没有串项目、空白、遮挡或错位。

## 为什么不做复杂状态同步

复杂的文档状态同步很容易变成另一个系统。Spec Coding MCP 选择更小的边界：

- review 表示“从源码反推的当前事实”
- active 表示“接下来要实现的规格”
- todo 表示“本轮要按顺序执行的轻量任务”
- done 表示“已经实现并验证过的规格”

AI 不需要猜测所有历史变更，只需要围绕当前 spec 完成一次明确开发。
