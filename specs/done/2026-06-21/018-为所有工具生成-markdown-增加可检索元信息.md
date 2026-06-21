---
name: '001-为所有工具生成-markdown-增加可检索元信息'
version: '1.1.0'
title: '为所有工具生成 Markdown 增加可检索元信息'
type: 'todo-spec'
status: 'todo'
source: 'user-prompt'
description: 'Lightweight executable TODO spec for ordered task execution and checkpoint recording.'
category: 'todo'
triggers:
  - todo
  - task-list
  - checkpoint
  - verification
appliesTo:
  - todo-specs
  - task-execution
  - checkpoints
updated: '2026-06-21'
---

# 为所有工具生成 Markdown 增加可检索元信息

## Meta

- status: done
- source: user-prompt

## 用户原始描述

为除 guidance 外的其它工具生成/管理 Markdown 增加类似 SKILL.md 的可检索 YAML 元信息，方便工具和大模型读取。范围包括 AGENTS.md、CLAUDE.md、specs/README.md、review specs、active specs、todo specs、done specs 等由本工具生成和维护的 Markdown；保留已有正文结构和兼容性，不强制改 VitePress/README 这类已有站点文档。元信息应出现在文档最前面，包含稳定字段如 name/title/type/status/source/version/description/category/triggers/appliesTo/updated 或适合该文档类型的等价字段。更新模板、读取/解析逻辑、当前项目相关 Markdown、文档和测试，验证旧的 ## Meta 解析、TODO/checkpoint/done 流程仍正常。

## TODO

- [x] 为除 guidance 外的其它工具生成/管理 Markdown 增加类似 SKILL.md 的可检索 YAML 元信息，方便工具和大模型读取。范围包括 AGENTS.md、CLAUDE.md、specs/README.md、review specs、active specs、todo specs、done specs 等由本工具生成和维护的 Markdown；保留已有正文结构和兼容性，不强制改 VitePress/README 这类已有站点文档。元信息应出现在文档最前面，包含稳定字段如 name/title/type/status/source/version/description/category/triggers/appliesTo/updated 或适合该文档类型的等价字段。更新模板、读取/解析逻辑、当前项目相关 Markdown、文档和测试，验证旧的 ## Meta 解析、TODO/checkpoint/done 流程仍正常。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T15:44:29.319Z
- note: 所有 Markdown 可检索元信息任务已完成并通过验证。

## 最终行为契约

1. 工具生成 Markdown 元信息
  - 条件：调用 init/bootstrap/generate source/create spec/create todo/generate agents/guidance fallback 生成 Markdown。
  - 触发入口：spec_init、spec_bootstrap、spec_generate_from_source、spec_create、spec_todo、spec_generate_agents 或 spec_guidance_read fallback。
  - 输入与前置状态：projectRoot/specsDir/projectName/title/prompt/source scan summary 等工具输入。
  - 执行过程：
    1. 模板通过 withMarkdownMetadata 或 guidanceDocument 在正文前输出 YAML front matter。
    2. YAML 标量统一单引号转义，避免冒号、中文或特殊字符破坏 YAML 解析。
    3. 正文继续保留 # 标题、## Meta、TODO、Guidance 等原有人类可读结构。
  - 输出结果：AGENTS/CLAUDE/specs README/source inventory/review index/source review/active spec/todo spec/guidance 默认文件都会带 YAML 元信息。
  - 副作用：只影响生成文件内容；已有 overwrite=false 规则仍由 writeTextFile/ensureDefaultGuidanceFiles 保持。
  - 默认行为：MARKDOWN_METADATA_VERSION 为 1.1.0，MARKDOWN_METADATA_UPDATED 为 2026-06-21；旧 ## Meta 仍保留。
  - 边界处理：YAML 字段值含冒号或中文时使用单引号，VitePress 可解析；guidance 文件已有自定义内容时不覆盖。
  - 结果摘要：新生成 Markdown 文件在最前面包含 name、version、title、type/status/source、description、category、triggers、appliesTo、updated 等可检索字段。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify、npm run docs:build。
  - 关联文件：
    - `src/templates/metadata.ts`
    - `src/templates/agents.ts`
    - `src/templates/prompt-documents.ts`
    - `src/templates/spec-documents.ts`
    - `src/templates/guidance.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

2. Markdown 读取与 done 归档兼容
  - 条件：读取 specs 列表或归档 active/todo spec 到 done。
  - 触发入口：listSpecs/spec_context/spec_list 或 spec_done。
  - 输入与前置状态：包含 YAML front matter、旧 ## Meta，或两者同时存在的 Markdown。
  - 执行过程：
    1. readMeta 同时匹配 YAML 的 status/source 和旧列表项 - status/- source。
    2. readMeta 会去掉 YAML 单引号/双引号，并兼容旧未加引号值。
    3. markSpecDone 将 YAML status 更新为 done，并将 type/category 更新为 done-spec/done；旧 - status 仍更新为 done。
  - 输出结果：done 文件包含 YAML status done、type done-spec、category done，并保留最终行为契约。
  - 副作用：spec_done 仍创建 done 归档并移除源 spec；不会覆盖既有 done 文件。
  - 默认行为：done 目录列表仍强制 status 为 done；source 继续从 YAML/旧 Meta 读取。
  - 边界处理：旧文件只有 ## Meta 时仍可读；新文件 YAML 值带引号时会被解析为裸值。
  - 结果摘要：新旧 Markdown 均可被列表和 context 正确读取状态来源，done 归档保留可检索 YAML 元信息。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify。
  - 关联文件：
    - `src/spec/spec-files.ts`
    - `src/spec/done-writer.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

3. 现有仓库 Markdown 补齐元信息
  - 条件：当前仓库已有 README、docs、AGENTS、CLAUDE、specs/review、specs/done、specs/guidance 和当前 todo 文件。
  - 触发入口：本次任务执行批量补齐。
  - 输入与前置状态：仓库内非 dist/node_modules 的 Markdown 文件。
  - 执行过程：
    1. 为没有检索元信息的 Markdown 添加 YAML front matter。
    2. 已有 VitePress front matter 的 docs/index.md 保留 layout/hero/features，并补充检索字段。
    3. docs 普通页面添加完整 YAML front matter 闭合符。
    4. 运行字段扫描确认所有 Markdown 都包含核心检索字段。
  - 输出结果：README、docs、specs、AGENTS、CLAUDE 等文件顶部可被模型快速读取。
  - 副作用：修改大量 Markdown 文件头部；正文内容保持原有结构。
  - 默认行为：docs 页面 category 为 documentation，done 文件 category 为 done，review 文件 category 为 review。
  - 边界处理：VitePress 页面通过 docs:build 验证 front matter 合法；YAML 示例代码块不再被误当作页面 front matter。
  - 结果摘要：仓库内 Markdown 均有 name/version/description/triggers/appliesTo 等核心字段。
  - 验证：PowerShell markdown metadata field scan、npm run docs:build、git diff --check。
  - 关联文件：
    - `README.md`
    - `docs/index.md`
    - `docs/guide/mcp-tools.md`
    - `docs/reference/spec-structure.md`
    - `specs/README.md`
    - `AGENTS.md`
    - `CLAUDE.md`
