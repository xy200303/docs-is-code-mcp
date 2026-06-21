---
name: '009-生成短-agents-与-claude-启动协议'
version: '1.1.0'
title: '生成短 AGENTS 与 CLAUDE 启动协议'
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

# 生成短 AGENTS 与 CLAUDE 启动协议

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户确认将 Codex/Claude 默认读取的 AGENTS.md/CLAUDE.md 与 spec workflow 结合：保留短启动协议，指向 spec_context 和 guidance 工具，不承载完整原则正文。

任务：
- 将 AGENTS.md 生成内容改为短启动协议，强调先调用 spec_context、按 selected specs/open TODO 执行、忘记原则时读取 guidance、完成后 checkpoint/done。
- 新增 CLAUDE.md 生成，内容与 AGENTS.md 同步或等价。
- 更新 bootstrap/generate agents 流程、README/docs/tests，确保 AGENTS.md 和 CLAUDE.md 都生成且不包含完整长规则正文。
- 运行验证并记录 checkpoint。

## TODO

- [x] 将 AGENTS.md 生成内容改为短启动协议，强调先调用 spec_context、按 selected specs/open TODO 执行、忘记原则时读取 guidance、完成后 checkpoint/done。
- [x] 新增 CLAUDE.md 生成，内容与 AGENTS.md 同步或等价。
- [x] 更新 bootstrap/generate agents 流程、README/docs/tests，确保 AGENTS.md 和 CLAUDE.md 都生成且不包含完整长规则正文。
- [x] 运行验证并记录 checkpoint。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T13:06:02.579Z
- note: AGENTS.md 与 CLAUDE.md 已作为短启动协议生成，完整原则改由 guidance 按需读取。

## 最终行为契约

1. 生成短 AGENTS/CLAUDE 启动协议
  - 条件：调用 generateAgentsFile，或 spec_bootstrap 间接调用 generateAgentsFile。
  - 结果：工具写入 AGENTS.md 和 CLAUDE.md 两个根协议文件。两者内容等价，只作为模型启动路由：先调用 spec_context，selected specs/open TODO 是任务源，忘记原则时使用 spec_guidance_list/read，完成后 checkpoint/done。文件不包含完整 Hard Rules、Recommended Practices 或 Business Confirmation Rules 正文。
  - 默认行为：generateAgentsFile 返回 file 仍为 AGENTS.md 保持兼容，files 列表包含两份文件。
  - 边界处理：完整原则不在启动文件展开；模型需要细节时读取 specs/guidance/*.md。
  - 验证：bun test/smoke.ts 覆盖 generateAgentsFile、bootstrap 和 CLI bootstrap；release:check 断言启动协议关键字和不含 ### Hard Rules。
  - 关联文件：
    - `src/templates/agents.ts`
    - `src/spec/scaffold.ts`
    - `src/mcp/register-write-tools.ts`
    - `AGENTS.md`
    - `CLAUDE.md`
    - `test/smoke.ts`
    - `scripts/release-check.mjs`

2. 文档化 AGENTS/CLAUDE 与 guidance 分工
  - 条件：用户阅读 README 了解根协议文件与 guidance 的关系。
  - 结果：README 说明 AGENTS.md 和 CLAUDE.md 只保留短启动协议，完整工程、UI/UX、spec 写作原则放在 specs/guidance/*.md，不塞进启动文件。工具表和 bootstrap 流程说明同时生成 AGENTS.md 与 CLAUDE.md。
  - 默认行为：spec_context 仍是本轮任务控制入口；AGENTS/CLAUDE 只防止模型第一步跑偏。
  - 边界处理：不同 AI 工具读取不同根协议文件时仍得到一致启动规则。
  - 验证：npm run release:check 通过。
  - 关联文件：
    - `README.md`
    - `scripts/release-check.mjs`
