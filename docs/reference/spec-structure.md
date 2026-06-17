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

## done

`done/` 存放已经实现并验证通过的 spec。

归档时保留实现结果和验证记录，方便之后回看为什么某个功能是这样做的。

## templates

`templates/` 存放创建 spec 的模板：

- `feature.md`：新增功能
- `bugfix.md`：修复问题
- `removal.md`：删除功能

模板不是强制格式，但建议保持“一个功能点一个文档”。
