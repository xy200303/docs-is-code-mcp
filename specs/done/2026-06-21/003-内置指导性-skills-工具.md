---
name: '003-内置指导性-skills-工具'
version: '1.1.0'
title: '内置指导性 skills 工具'
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

# 内置指导性 skills 工具

## Meta

- status: done
- source: user-prompt

## 用户原始描述

- [x] 梳理 MCP 工具注册、specs 初始化和测试结构
- [x] 设计可编辑的 specs guidance 提示词文件与读取工具契约
- [x] 实现内置指导性 tools、默认提示词生成和测试覆盖
- [x] 更新 README/specs 文档并运行验证
- [x] 记录 checkpoint 并归档任务

## TODO

- [x] 梳理 MCP 工具注册、specs 初始化和测试结构
- [x] 设计可编辑的 specs guidance 提示词文件与读取工具契约
- [x] 实现内置指导性 tools、默认提示词生成和测试覆盖
- [x] 更新 README/specs 文档并运行验证
- [x] 记录 checkpoint 并归档任务

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T10:59:25.663Z
- note: 内置 guidance 提示词工具已实现、测试、文档化并归档。

## 最终行为契约

1. 列出可用 guidance 提示词
  - 条件：模型需要找回工程、UI/UX 或 spec 写作原则时调用 spec_guidance_list，并提供 projectRoot/specsDir。
  - 结果：工具读取内置 guidance 模板索引，输出 engineering、ui-ux、spec-writing 三个 name、标题、用途和对应 specs/guidance/*.md 路径；输出明确说明这些内容只是指导性原则，不替代当前 spec、TODO、用户要求或代码事实；下一步提示用 spec_guidance_read 按 name 读取具体内容。
  - 默认行为：specsDir 未传时沿用 RootSchema 默认值 specs；list 工具不读取长正文，只展示索引和路径，避免把提示词塞进 spec_context。
  - 边界处理：list 是只读工具，不受 spec_context 写入护栏限制；输出的路径随 specsDir 参数变化。
  - 验证：bun test/smoke.ts 覆盖 spec_guidance_list 输出名称、路径和指导性声明。
  - 关联文件：
    - `src/mcp/register-read-tools.ts`
    - `src/spec/guidance.ts`
    - `src/templates/guidance.ts`
    - `test/smoke.ts`

2. 读取单份 guidance 提示词
  - 条件：模型调用 spec_guidance_read，并传入 engineering、ui-ux 或 spec-writing 之一作为 name。
  - 结果：工具先校验 name 是否属于内置模板；随后定位 projectRoot/specsDir/guidance/<file>.md。若项目文件存在，读取用户当前编辑后的 Markdown，并在输出中标记 source: project、file: specs/guidance/<file>.md；若项目文件缺失，返回内置默认 content，并标记 source: builtin。输出包含标题、name、source、file、purpose 和 prompt 正文。
  - 默认行为：specsDir 未传时使用 specs；项目内 Markdown 优先于内置默认值；initSpecs/bootstrap 会预生成 engineering.md、ui-ux.md、spec-writing.md 作为用户可编辑默认文件。
  - 边界处理：未知 name 会 fail fast，错误消息列出 Available: engineering, ui-ux, spec-writing；项目文件缺失不会失败，而是回退到内置默认提示词。
  - 验证：bun test/unit.ts 覆盖项目覆盖、内置兜底和未知名称错误；bun test/smoke.ts 覆盖 MCP read 工具读取项目文件、编辑后内容和缺失文件兜底。
  - 关联文件：
    - `src/mcp/register-read-tools.ts`
    - `src/spec/guidance.ts`
    - `src/templates/guidance.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

3. 初始化 specs guidance 默认文件
  - 条件：调用 spec_init、spec_bootstrap、spec_generate_from_source、spec_create 或 spec_todo 等会走 initSpecs 的流程。
  - 结果：initSpecs 在写入 specs/README.md 和 templates 后调用 writeDefaultGuidanceFiles，生成或刷新 specs/guidance/engineering.md、specs/guidance/ui-ux.md、specs/guidance/spec-writing.md。overwrite=false 且文件已存在时不覆盖用户编辑；overwrite=true 时按内置默认模板刷新。
  - 默认行为：writeTextFile 统一处理目录创建、内容归一化、文件已存在跳过和 overwrite=true 更新；本次使用本地 dist 的 initSpecs overwrite=true 为当前仓库生成默认 guidance 文件。
  - 边界处理：已有项目中用户编辑过 guidance 时，普通 init/bootstrap 默认 overwrite=false，会保留用户内容；缺失单个文件时会补建该文件。
  - 验证：npm run build 后执行 dist/initSpecs 生成当前仓库 guidance 文件；bun test/smoke.ts 校验 initSpecs 会创建 engineering.md。
  - 关联文件：
    - `src/spec/scaffold.ts`
    - `src/spec/guidance.ts`
    - `src/spec/file-writers.ts`
    - `specs/guidance/engineering.md`
    - `specs/guidance/ui-ux.md`
    - `specs/guidance/spec-writing.md`

4. 文档化 guidance 工具和目录契约
  - 条件：用户或模型阅读 README.md 或 specs/README.md 了解工具能力和目录结构。
  - 结果：README.md 的目录结构和 MCP 工具表新增 guidance/、spec_guidance_list、spec_guidance_read；工作流说明新增项目文件优先、缺失回退内置默认值、不塞进 spec_context、不替代 spec/TODO/用户要求/源码事实。specsReadme 模板同步说明 guidance/*.md、读取工具和用户可编辑规则；当前仓库 specs/README.md 已按模板刷新。
  - 默认行为：specsReadme 由 src/templates/agents.ts 统一生成，initSpecs 会写入 specs/README.md；README.md 是包级说明，需手动维护与工具契约一致。
  - 边界处理：guidance 是补充原则工具，不改变写工具必须先 spec_context 的硬约束，也不改变 selected specs 和 open TODO 的需求优先级。
  - 验证：bun test/smoke.ts 校验 README 包含 guidance 工具和默认路径，release:check 通过。
  - 关联文件：
    - `README.md`
    - `src/templates/agents.ts`
    - `specs/README.md`
    - `test/smoke.ts`
