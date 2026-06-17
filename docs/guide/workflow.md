# 工作流

Spec Coding MCP 的核心约束是：开发前先有一份明确的 spec，开发后把已完成的 spec 归档。

## 旧系统审查

1. 调用 `spec_generate_from_source`。
2. 阅读 `specs/review/source-inventory.md`。
3. 逐个审查 `specs/review/*.md`。
4. 把反推出来的源码事实修正成真实业务规则。
5. 把要开发的内容移动或复制到 `specs/active/`。

`review/` 里的内容不是最终需求，它只是帮助用户看清当前代码。

## 新功能开发

1. 调用 `spec_create`，根据用户描述创建 active spec。
2. 用户修改 `specs/active/*.md`。
3. 调用 `spec_context`，让 AI 获取实现上下文。
4. AI 按 spec 修改代码和测试。
5. 验证通过后调用 `spec_done`。

## 修改已有功能

修改已有功能时，不需要维护 change log。直接修改对应 spec：

```text
用户编辑 spec -> AI 调用 spec_context -> AI 更新代码和测试
```

如果当前代码还没有完全实现旧 spec，AI 应以最新 spec 为准继续实现。

## 删除功能

删除功能同样用 spec 表达：

```text
specs/active/remove-legacy-login.md
```

删除 spec 需要写清楚：

- 删除哪些用户入口
- 删除哪些接口或命令
- 哪些数据需要保留或迁移
- 哪些测试应该被移除或改写

## 完成定义

一个 spec 进入 `done/` 前，至少应满足：

- 代码实现符合 spec
- 相关测试已更新或补充
- 本地验证命令通过
- 用户确认需求没有继续变化
