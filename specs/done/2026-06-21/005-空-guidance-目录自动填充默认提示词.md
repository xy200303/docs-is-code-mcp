---
name: '005-空-guidance-目录自动填充默认提示词'
version: '1.1.0'
title: '空 guidance 目录自动填充默认提示词'
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

# 空 guidance 目录自动填充默认提示词

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户要求：如果 guidance 目录没有数据，就需要工具自己使用默认内容填充进去。

任务：
- 定位 spec_guidance_list/spec_guidance_read 和 specs guidance 默认文件写入逻辑。
- 当 specs/guidance 目录不存在或没有 guidance Markdown 数据时，自动写入内置默认提示词文件。
- 保留用户已有编辑：已有 guidance 文件不能被无条件覆盖。
- 更新文档和测试，覆盖空目录/缺失目录自动填充默认内容。
- 运行验证并记录 checkpoint。

## TODO

- [x] 定位 spec_guidance_list/spec_guidance_read 和 specs guidance 默认文件写入逻辑。
- [x] 当 specs/guidance 目录不存在或没有 guidance Markdown 数据时，自动写入内置默认提示词文件。
- [x] 保留用户已有编辑：已有 guidance 文件不能被无条件覆盖。
- [x] 更新文档和测试，覆盖空目录/缺失目录自动填充默认内容。
- [x] 运行验证并记录 checkpoint。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T11:14:47.157Z
- note: guidance 缺失时自动补齐默认 Markdown 的行为已实现、测试并文档化。

## 最终行为契约

1. 列出 guidance 前自动补齐默认文件
  - 条件：调用 spec_guidance_list，且 specs/guidance 目录不存在、为空或缺少一个或多个默认 guidance Markdown。
  - 结果：工具先调用 ensureDefaultGuidanceFiles(projectRoot, specsDir)，用内置模板补齐 engineering.md、ui-ux.md、spec-writing.md 中缺失的文件，然后输出 guidance 索引和可编辑路径说明。已有文件不会被覆盖。
  - 默认行为：specsDir 未传时沿用 RootSchema 默认 specs；默认文件内容来自 src/templates/guidance.ts。
  - 边界处理：已有用户编辑文件内容不同也会被 skipped，因为 overwrite=false；空目录会创建全部三个默认文件；只缺一个文件时只创建缺失文件。
  - 验证：bun test/unit.ts 覆盖 ensureDefaultGuidanceFiles 创建与跳过；bun test/smoke.ts 覆盖工具路径。
  - 关联文件：
    - `src/mcp/register-read-tools.ts`
    - `src/spec/guidance.ts`
    - `src/templates/guidance.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

2. 读取 guidance 前自动补齐并读取项目文件
  - 条件：调用 spec_guidance_read，且请求的默认 guidance 文件不存在。
  - 结果：readGuidance 校验 name 后调用 ensureDefaultGuidanceFiles，先把缺失默认 Markdown 写入项目，再读取项目文件并返回 source: project。之前的 builtin fallback 成为极端兜底路径，正常缺失文件会被写入并按项目文件读取。
  - 默认行为：读取后 source 为 project，因为默认文件会先写入项目。
  - 边界处理：未知 name 仍 fail fast 并列出 available names；已有用户文件保持原内容。
  - 验证：bun test/unit.ts 断言 readGuidance 缺失时读到生成的 project 文件；bun test/smoke.ts 断言缺失 root 下生成 spec-writing.md 并返回 source: project。
  - 关联文件：
    - `src/spec/guidance.ts`
    - `src/mcp/register-read-tools.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

3. 文档化 guidance 自动填充契约
  - 条件：用户阅读 README 或 specs README 了解 guidance 文件行为。
  - 结果：文档说明 guidance 目录缺失、为空或缺少默认文件时，工具会先写入内置默认 Markdown，再读取项目内容；已有文件不会被覆盖。specs README 模板同步说明相同行为。
  - 默认行为：用户仍可直接编辑 specs/guidance/*.md；工具只补缺失，不覆盖已有。
  - 边界处理：用户删除某个默认文件后，下次 list/read 会重新生成该文件。
  - 验证：npm run release:check 与 smoke 测试通过。
  - 关联文件：
    - `README.md`
    - `src/templates/agents.ts`
    - `specs/README.md`
