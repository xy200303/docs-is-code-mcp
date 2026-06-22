---
name: 'todo-spec'
version: '1.1.0'
title: '优化 guidance 文档结构并内置 skills CLI 依赖'
type: done-spec
status: done
source: 'user-prompt'
description: 'Lightweight executable TODO spec for ordered task execution and checkpoint recording.'
category: done
triggers:
  - 'todo'
  - 'task-list'
  - 'checkpoint'
  - 'verification'
appliesTo:
  - 'todo-specs'
  - 'task-execution'
  - 'checkpoints'
updated: '2026-06-21'
---

# 优化 guidance 文档结构并内置 skills CLI 依赖

## 任务说明

优化 specs/guidance 文档结构，并让安装 spec-coding-mcp 时同时带上 skills CLI 能力。要求：
- specs/guidance/*.md 和内置 guidance 模板正文结构更清晰，减少 YAML 元信息后的重复说明。
- guidance 正文标题使用统一的人读结构，例如“使用场景”“执行方式”“核心规则/工作流”“输出要求”等，避免机械的“用途/模型行为”等旧标题堆叠。
- spec_guidance_list/read 仍能读取 metadata、description、triggers、appliesTo。
- 将官方 skills CLI 作为 package dependency 或等价随包安装能力接入，使用户安装 @dev_xiaoyun/spec-coding-mcp 后无需每次依赖 npx 临时拉取 skills 包。
- spec_skills_search/spec_skills_install 优先使用随包安装的 skills CLI，找不到时再回退到 npx。
- 更新测试和文档说明。
- npm run verify 通过。
- npm run docs:build 通过。
- git diff --check 通过。

## 执行清单

- [x] specs/guidance/*.md 和内置 guidance 模板正文结构更清晰，减少 YAML 元信息后的重复说明。
- [x] guidance 正文标题使用统一的人读结构，例如“使用场景”“执行方式”“核心规则/工作流”“输出要求”等，避免机械的“用途/模型行为”等旧标题堆叠。
- [x] spec_guidance_list/read 仍能读取 metadata、description、triggers、appliesTo。
- [x] 将官方 skills CLI 作为 package dependency 或等价随包安装能力接入，使用户安装 @dev_xiaoyun/spec-coding-mcp 后无需每次依赖 npx 临时拉取 skills 包。
- [x] spec_skills_search/spec_skills_install 优先使用随包安装的 skills CLI，找不到时再回退到 npx。
- [x] 更新测试和文档说明。
- [x] npm run verify 通过。
- [x] npm run docs:build 通过。
- [x] git diff --check 通过。

## 执行协议

- 开始前必须先调用 `spec_context`，确认当前 TODO 上下文。
- AI 必须按未勾选 TODO 从上到下执行。
- 完成任务后把对应项改成 `[x]`。
- 无法完成的任务保持 `[ ]`，并在任务下方写明阻塞原因。
- 阶段完成后调用 `spec_checkpoint`，记录实际行为、验证结果、风险和阻塞。

## 执行记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-22T05:21:57.377Z
- note: 完成 guidance 结构优化与 bundled skills CLI 接入。

## 最终行为契约

本节用于给用户审查功能完整行为；必须覆盖所有已知正常、失败、边界、权限、状态、异常、空值和默认行为。模型自行采用的默认策略也必须写清楚。

1. Guidance 默认文档结构
  - 条件：新建或补齐 specs/guidance/*.md，或读取内置 guidance 模板
  - 触发入口：ensureDefaultGuidanceFiles/readGuidance 读取模板，或当前仓库同步 specs/guidance 文件
  - 输入与前置状态：guidance name 为 engineering、ui-ux、spec-writing、git-commit、pr-submit 或 quality-review
  - 执行过程：
    1. 读取 src/templates/guidance.ts 中对应 metadata
    2. 渲染 YAML front matter
    3. 渲染统一的人读正文结构
    4. 按具体 guidance 输出核心规则、Skill 路由、工作流或审查章节
  - 输出结果：spec_guidance_read 仍返回 title、version、description、triggers、appliesTo 和完整 Prompt 内容
  - 副作用：补齐缺失 guidance 文件时写入 specs/guidance/*.md；读取已有项目文件时不覆盖用户编辑
  - 默认行为：项目 guidance 文件存在时继续优先读取项目文件；缺失默认文件时补齐内置模板。
  - 边界处理：未记录
  - 结果摘要：生成的 guidance 保留 YAML front matter 元信息，正文改为“使用场景”“执行方式”加领域章节，避免重复的“用途/使用方式/模型行为”等旧结构。
  - 验证：bun test/unit.ts; bun test/smoke.ts; npm run verify
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/ui-ux.md`
    - `test/unit.ts`
    - `test/smoke.ts`

2. Skills CLI 搜索与安装
  - 条件：调用 spec_skills_search 或 spec_skills_install
  - 触发入口：MCP 工具 spec_skills_search/spec_skills_install
  - 输入与前置状态：搜索 query，或 install 的 source、skills、agents、global、listOnly、copy、dryRun 参数
  - 执行过程：
    1. 构造 direct skills CLI 参数，如 find 或 add
    2. resolveBundledSkillsCli 尝试解析 skills/package.json
    3. 解析成功时用 process.execPath + bin/cli.mjs 执行
    4. 解析失败或 bundled 执行失败时用 npx.cmd/npx --yes skills 回退
    5. 渲染 command、source、dryRun、stdout/stderr 和下一步提示
  - 输出结果：dryRun 输出会显示实际 command 和 source；安装默认目标仍是 ui-ux-pro-max 到 Codex 全局 skills 目录
  - 副作用：非 dryRun 安装会写入所选编程工具的全局 skills 目录；dryRun 无写入。
  - 默认行为：source 默认 ui-ux-pro-max skill repo；skills 默认 ui-ux-pro-max；agents 默认 codex；global 默认 true；listOnly 默认 false；copy 默认 false。
  - 边界处理：未记录
  - 结果摘要：工具先尝试通过 package dependency 解析 skills/bin/cli.mjs 并用当前 Node 执行；解析不到时使用 npx skills；随包 CLI 执行失败时自动回退 npx。
  - 验证：bun test/unit.ts; bun test/smoke.ts; npm run verify
  - 关联文件：
    - `src/skills/skills-cli.ts`
    - `src/mcp/register-write-tools.ts`
    - `package.json`
    - `package-lock.json`
