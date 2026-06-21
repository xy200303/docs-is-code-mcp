---
name: '006-移除默认-specs-templates-目录'
version: '1.1.0'
title: '移除默认 specs templates 目录'
type: 'done-spec'
status: 'done'
source: 'archived-spec'
description: 'Archived completed spec with implementation record and verification history.'
category: 'done'
triggers:
  - done
  - archive
  - behavior-record
  - verification
appliesTo:
  - done-specs
  - implementation-history
  - audit
updated: '2026-06-21'
---

# 移除默认 specs templates 目录

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户确认 specs/templates 目录很多余，可以移除。

任务：
- 定位 initSpecs/bootstrap 中 specs/templates 的生成逻辑和 README/specs README 的目录说明。
- 停止默认生成 specs/templates/*.md，模板只保留在源码 src/templates 中。
- 删除当前仓库 specs/templates 目录中的模板文件。
- 更新文档和测试，确保 specs/templates 不再作为默认目录出现。
- 运行验证并记录 checkpoint。

## TODO

- [x] 定位 initSpecs/bootstrap 中 specs/templates 的生成逻辑和 README/specs README 的目录说明。
- [x] 停止默认生成 specs/templates/*.md，模板只保留在源码 src/templates 中。
- [x] 删除当前仓库 specs/templates 目录中的模板文件。
- [x] 更新文档和测试，确保 specs/templates 不再作为默认目录出现。
- [x] 运行验证并记录 checkpoint。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T12:33:19.264Z
- note: 默认 specs/templates 目录已移除，模板仅保留在源码内供工具生成。

## 最终行为契约

1. 初始化 specs 不再生成 templates 目录
  - 条件：调用 initSpecs，或调用依赖 initSpecs 的 spec_bootstrap、spec_generate_from_source、spec_create、spec_todo。
  - 结果：initSpecs 只写入 specs/README.md 和 specs/guidance 默认文件，不再写入 specs/templates/feature.md、bugfix.md、removal.md。工具创建 active/todo/review spec 仍使用源码内 src/templates 的模板函数，不依赖项目内 specs/templates 副本。
  - 默认行为：源码模板仍位于 src/templates/spec-documents.ts 和 src/templates/prompt-documents.ts；用户通过 MCP 工具创建 spec/todo 时仍生成完整文档。
  - 边界处理：已有用户项目如果已经有 specs/templates，新版本不会主动删除用户项目里的旧目录；只是未来 init/bootstrap 不再创建或刷新这些文件。
  - 验证：bun test/smoke.ts 断言 initSpecs 不创建 specs/templates；npm run build 通过。
  - 关联文件：
    - `src/spec/scaffold.ts`
    - `test/smoke.ts`
    - `specs/templates/feature.md`
    - `specs/templates/bugfix.md`
    - `specs/templates/removal.md`

2. 默认目录文档去除 templates
  - 条件：用户阅读 README、docs 快速开始、spec 结构参考或 specs/README.md。
  - 结果：默认目录结构不再列出 templates/；spec 结构参考新增 guidance 说明，明确 guidance 是可编辑提示词目录，并删除 templates 章节。
  - 默认行为：模板说明从用户项目目录中移除；源码模板仍作为实现内部细节存在。
  - 边界处理：历史 done/review 文档中提到 src/templates 的记录保持不变，因为那是历史事实或源码模块引用。
  - 验证：rg 搜索确认 README/docs/specs README 不再把 specs/templates 当默认目录；release:check 通过。
  - 关联文件：
    - `README.md`
    - `docs/guide/getting-started.md`
    - `docs/reference/spec-structure.md`
    - `src/templates/agents.ts`
    - `specs/README.md`
