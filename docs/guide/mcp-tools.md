# MCP 工具

Spec Coding MCP 提供一组面向 AI 编程的工具。它们不要求用户手写 ID，也不要求维护 change log。

| 工具 | 作用 | 常见时机 |
| --- | --- | --- |
| `spec_init` | 初始化 specs 目录和模板 | 项目第一次接入 |
| `spec_generate_from_source` | 从现有源码反推 review specs | 旧项目审查 |
| `spec_create` | 根据用户描述创建 active spec | 新需求开始 |
| `spec_list` | 列出 review、active、done specs | 查找当前规格 |
| `spec_context` | 返回 AI 实现代码需要的 spec 上下文 | 开始写代码前 |
| `spec_done` | 验证通过后归档 spec | 功能完成后 |

## spec_context 的角色

`spec_context` 是真正给 AI 写代码前使用的工具。它应该返回：

- 当前 active spec 的完整内容
- 相关 review spec 摘要
- 可能相关的源码路径
- 建议验证命令
- 完成后需要调用 `spec_done` 的提醒

## 为什么不做复杂状态同步

复杂的文档状态同步很容易变成另一个系统。Spec Coding MCP 选择更小的边界：

- review 表示“从源码反推的当前事实”
- active 表示“接下来要实现的规格”
- done 表示“已经实现并验证过的规格”

AI 不需要猜测所有历史变更，只需要围绕当前 spec 完成一次明确开发。
