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
