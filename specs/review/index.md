---
name: 'review-index'
version: '1.1.0'
title: 'AI 源码审查任务索引'
type: 'review-index'
status: 'review'
source: 'static-source-hints'
description: 'Index of source-derived review specs for AI code reading tasks.'
category: 'review'
triggers:
  - source-review
  - review-index
  - bootstrap
  - existing-project
appliesTo:
  - review-specs
  - source-review
  - workflow-routing
updated: '2026-06-21'
---

# AI 源码审查任务索引

| Spec | 文件 | 状态 | 来源 |
|---|---|---|---|
| mcp 源码审查任务 | `specs/review/mcp-data.md` | source-review/needs-ai-summary | 静态线索，待 AI 阅读源码 |

## Checkpoint

- at: 2026-06-21T13:10:29.178Z
- summary: Published release v0.2.10 by committing package version bump and pushing tag to trigger the npm publish workflow.

### Summary

- Published release v0.2.10 by committing package version bump and pushing tag to trigger the npm publish workflow.

### Completed TODOs

- 无

### Changed Files

- `package.json`
- `package-lock.json`

### Verification

- passed `npm run verify`：build, unit, smoke, release:check all passed for 0.2.10
- passed `npm pack --dry-run`：package contents verified; prepack reran verify
- passed `git diff --check`：no whitespace errors

### 实际行为记录

1. 未提供已验证行为
  - 条件：未提供来自代码、测试或用户确认的条件
  - 结果：不可作为真实行为事实
  - 默认行为：未验证
  - 边界处理：未验证
  - 验证：未提供验证证据
  - 关联文件：未记录

### Risks

- 无

### Blockers

- 无

## Checkpoint

- at: 2026-06-21T13:30:49.197Z
- summary: Published release v0.2.11 by committing package version bump and pushing tag to trigger the npm publish workflow.

### Summary

- Published release v0.2.11 by committing package version bump and pushing tag to trigger the npm publish workflow.

### Completed TODOs

- 无

### Changed Files

- `package.json`
- `package-lock.json`

### Verification

- passed `npm run release:manual -- 0.2.11 --dry-run`：confirmed tag/npm version availability before release
- passed `npm run verify`：build, unit, smoke, release:check all passed for 0.2.11
- passed `npm pack --dry-run`：package contents verified; prepack reran verify
- passed `git diff --check`：no whitespace errors

### 实际行为记录

1. 未提供已验证行为
  - 条件：未提供来自代码、测试或用户确认的条件
  - 结果：不可作为真实行为事实
  - 默认行为：未验证
  - 边界处理：未验证
  - 验证：未提供验证证据
  - 关联文件：未记录

### Risks

- 无

### Blockers

- 无

## Checkpoint

- at: 2026-06-21T14:01:05.209Z
- summary: 优化 TODO/启动引导词中的 guidance 指向：保留 spec_guidance_list/read 双入口，并明确工程原则读取 engineering/specs/guidance/engineering.md，UI/UX 原则读取 ui-ux/specs/guidance/ui-ux.md。

### Summary

- 优化 TODO/启动引导词中的 guidance 指向：保留 spec_guidance_list/read 双入口，并明确工程原则读取 engineering/specs/guidance/engineering.md，UI/UX 原则读取 ui-ux/specs/guidance/ui-ux.md。

### Completed TODOs

- 无

### Changed Files

- `src/templates/prompt-documents.ts`
- `src/templates/agents.ts`
- `AGENTS.md`
- `CLAUDE.md`
- `test/unit.ts`
- `test/smoke.ts`

### Verification

- passed `bun test/unit.ts`：Unit tests verify TODO guidance pointers include spec_guidance_list/read and explicit engineering/ui-ux file mapping.
- passed `bun test/smoke.ts`：Smoke test verifies generated TODO spec includes explicit engineering.md/ui-ux.md guidance mapping.
- passed `npm run verify`：build, unit, smoke, release:check all passed.
- passed `git diff --check`：No whitespace errors; Git reported expected LF-to-CRLF warnings on Windows.

### 实际行为记录

1. TODO 执行要求明确 guidance 映射
  - 条件：调用 spec_todo 或 createTodoFromPrompt 生成 TODO 文件。
  - 触发入口：用户创建临时 TODO 任务。
  - 输入与前置状态：title 和 prompt。
  - 执行过程：
    1. todoSpec 生成执行要求。
    2. 执行要求先提示原则不在文件展开，需要校准时先调用 spec_guidance_list 查看索引。
    3. 随后提示用 spec_guidance_read 按 name 读取具体 guidance。
    4. 工程原则明确映射到 engineering（specs/guidance/engineering.md），UI/UX 原则明确映射到 ui-ux（specs/guidance/ui-ux.md）。
    5. spec-writing、git-commit、pr-submit 仍作为对应场景的 guidance name 保留。
  - 输出结果：生成的 TODO 文件包含清晰 guidance 入口和工程/UI 对应文件，不再需要模型猜测该读哪份原则。
  - 副作用：只改变生成模板和根启动协议文案；不改变 guidance 文件内容或工具 schema。
  - 默认行为：若没有具体 UI/UX 或工程疑问，模型无需读取 guidance；guidance 仍为按需提醒。
  - 边界处理：其它场景仍使用 spec-writing、git-commit、pr-submit name；完整原则仍不塞进 TODO 文件。
  - 结果摘要：模型在 TODO 和启动协议中能直接知道工程原则读 engineering，UI/UX 原则读 ui-ux。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify、git diff --check 均通过。
  - 关联文件：
    - `src/templates/prompt-documents.ts`
    - `src/templates/agents.ts`
    - `AGENTS.md`
    - `CLAUDE.md`
    - `test/unit.ts`
    - `test/smoke.ts`

### Risks

- 无

### Blockers

- 无
