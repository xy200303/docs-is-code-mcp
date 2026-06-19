# Spec 目录结构

默认目录如下：

```text
specs/
  README.md
  review/
    source-inventory.md
    index.md
    *.md
  active/
    *.md
  todo/
    *.md
  done/
    *.md
  templates/
    feature.md
    bugfix.md
    removal.md
```

## review

`review/` 存放从源码反推的当前代码事实。

它适合回答：

- 系统现在有哪些入口
- 哪些模块可能对应业务功能
- 当前代码暴露了哪些 API、命令或页面
- 哪些行为需要用户确认

`review/` 不等于最终需求。用户审查后，可以把确认过的内容改写成 active spec。

## active

`active/` 存放准备实现或正在实现的 spec。

一个 active spec 通常包含：

- 背景
- 用户目标
- 范围
- 非目标
- 行为规则
- 接口或命令
- UI 与交互
- 数据影响
- 验证方式
- 完成标准

## todo

`todo/` 存放轻量可执行任务清单，适合把一个需求拆成按顺序执行的小任务。

TODO 使用 Markdown 任务列表：

```md
- [ ] 定位相关代码。
- [ ] 更新实现。
- [ ] 运行测试。
```

`spec_context` 会提取未勾选项，并要求 AI 按顺序执行。完成后应把对应任务改成 `[x]`；如果无法完成，保留 `[ ]` 并写清阻塞原因。

## checkpoint

`spec_checkpoint` 会向 spec 或 TODO 文件追加 `## Checkpoint`，记录：

- 完成摘要
- completed TODO
- 变更文件
- 验证命令和结果
- 风险
- 阻塞项

它会自动把匹配到的未完成 TODO 改成 `[x]`。

## 工程质量约束

新建 spec 和 TODO 会包含工程质量约束，`spec_context` 也会在每次调用时强制输出这些约束。核心要求是：

- 这些规则是强制约束，不是建议。
- 代码结构清晰，避免冗余、重复和无意义注释。
- 强制遵守 KISS、DRY、SOLID 和 Boy Scout Rule。
- 文件顶部必须写文件注释，复杂逻辑必须写说明性注释，但不能写废话。
- 能用成熟库解决的就优先用成熟库，不要自己手搓已有轮子。
- 遇到不明确、影响面大或高风险的方案时，先向用户询问和确认，不要自己拍板。
- 遵循现有项目风格和目录约定。
- 不把所有代码放在一个文件，也不把所有文件放在一个目录。
- 按功能、层次或领域拆分模块，职责边界分明。
- UI 交互符合人类直觉，状态和信息层级清楚。

## done

`done/` 存放已经实现并验证通过的 spec。

归档时保留实现结果和验证记录，方便之后回看为什么某个功能是这样做的。

## templates

`templates/` 存放创建 spec 的模板：

- `feature.md`：新增功能
- `bugfix.md`：修复问题
- `removal.md`：删除功能

模板不是强制格式，但建议保持“一个功能点一个文档”。
