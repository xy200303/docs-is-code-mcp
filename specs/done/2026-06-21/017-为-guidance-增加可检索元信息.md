---
name: '017-为-guidance-增加可检索元信息'
version: '1.1.0'
title: '为 guidance 增加可检索元信息'
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

# 为 guidance 增加可检索元信息

## Meta

- status: done
- source: user-prompt

## 用户原始描述

为 specs/guidance/*.md 内置提示词增加类似 SKILL.md 的可检索元信息，方便工具和大模型按名称、版本、描述、适用场景检索。

- 默认 guidance 文档应包含稳定的元信息区，例如 name、version、description、category、triggers、appliesTo、lastUpdated 或 equivalent 字段。
- 元信息应出现在正文前部，方便模型和工具快速读取，不替代原有用途/使用方式正文。
- spec_guidance_list / guidanceItems 应尽量暴露 description/version 等摘要信息，保持向后兼容。
- 当前项目 specs/guidance/*.md 需要同步更新，已有自定义内容不应被工具覆盖。
- 更新 README/docs 和测试，验证默认 guidance、fallback 生成、project guidance 读取仍正常。

## TODO

- [x] 默认 guidance 文档应包含稳定的元信息区，例如 name、version、description、category、triggers、appliesTo、lastUpdated 或 equivalent 字段。
- [x] 元信息应出现在正文前部，方便模型和工具快速读取，不替代原有用途/使用方式正文。
- [x] spec_guidance_list / guidanceItems 应尽量暴露 description/version 等摘要信息，保持向后兼容。
- [x] 当前项目 specs/guidance/*.md 需要同步更新，已有自定义内容不应被工具覆盖。
- [x] 更新 README/docs 和测试，验证默认 guidance、fallback 生成、project guidance 读取仍正常。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T15:23:48.004Z
- note: guidance 元信息任务已完成并通过验证。

## 最终行为契约

1. 默认 guidance 模板生成
  - 条件：项目初始化或 fallback 需要写入缺失 guidance 文件。
  - 触发入口：spec_init/spec_bootstrap 或 spec_guidance_read 读取缺失默认 guidance。
  - 输入与前置状态：projectRoot/specsDir 指向缺少一个或多个默认 guidance 文件的项目。
  - 执行过程：
    1. ensureDefaultGuidanceFiles 遍历内置 guidanceTemplates。
    2. 缺失文件按模板 content 写入 specs/guidance/*.md。
    3. 模板 content 在正文标题前写入 YAML front matter。
  - 输出结果：生成的 guidance 文件顶部包含 name、version、title、description、category、triggers、appliesTo、updated，随后保留 # 标题、用途、使用方式和原有正文。
  - 副作用：只创建缺失的默认 guidance Markdown；已有 guidance 文件保持不覆盖。
  - 默认行为：当前内置 guidance metadata 使用 version 1.1.0 和 updated 2026-06-21；默认 guidance 名称保持 engineering、ui-ux、spec-writing、git-commit、pr-submit、quality-review。
  - 边界处理：如果项目已有自定义 guidance 文件，读取 source 为 project 的现有内容，工具不会用新模板覆盖该文件。
  - 结果摘要：生成的 guidance 文件顶部出现稳定 YAML 元信息，正文用途和使用方式仍保留。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify。
  - 关联文件：
    - `src/templates/guidance.ts`
    - `src/spec/guidance.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

2. guidance 列表与读取输出
  - 条件：模型或工具需要按名称、版本、描述、适用场景检索 guidance。
  - 触发入口：调用 spec_guidance_list、spec_guidance_read 或 spec_context。
  - 输入与前置状态：projectRoot、specsDir；spec_guidance_read 额外传入 guidance name。
  - 执行过程：
    1. guidanceItems 从 guidanceTemplates 映射稳定的元信息字段。
    2. spec_guidance_list 渲染 name、version、category、description、triggers、appliesTo 和文件路径。
    3. spec_guidance_read 在正文前显示 version、category、description、triggers、appliesTo，并读取项目里的 guidance 内容。
    4. spec_context Guidance Index 展示 name、version、category、purpose、description 和文件路径。
  - 输出结果：工具输出保留原有 guidance 名称和文件路径，同时新增可检索摘要字段。
  - 副作用：spec_guidance_list 和 spec_context 无文件副作用；spec_guidance_read 仅在默认 guidance 缺失时补齐缺失文件。
  - 默认行为：未知 guidance name 仍 fail fast，并列出可用 guidance 名称；已有 project guidance 优先于内置默认正文。
  - 边界处理：未记录
  - 结果摘要：工具输出保留原有 guidance 名称和文件路径，同时新增可检索摘要字段。
  - 验证：bun test/smoke.ts、npm run verify。
  - 关联文件：
    - `src/mcp/register-read-tools.ts`
    - `src/spec/context-markdown.ts`
    - `src/spec/guidance.ts`
    - `test/smoke.ts`
