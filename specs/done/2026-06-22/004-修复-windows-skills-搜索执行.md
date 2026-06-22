---
name: 'todo-spec'
version: '1.1.0'
title: '修复 Windows skills 搜索执行'
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

# 修复 Windows skills 搜索执行

## Meta

- status: done
- source: user-prompt

## 用户原始描述

修复 spec_skills_search 在 Windows 环境下调用 npx skills find 时出现 spawn EINVAL 的问题。要求：
- 保持 spec_skills_install dryRun 输出不变。
- skills 搜索在 Windows 下能真实执行 npx skills find 查询。
- 新增或调整测试覆盖 Windows npx 执行方式，避免只验证参数构造。
- npm run verify 通过。
- git diff --check 通过。

## TODO

- [x] 保持 spec_skills_install dryRun 输出不变。
- [x] skills 搜索在 Windows 下能真实执行 npx skills find 查询。
- [x] 新增或调整测试覆盖 Windows npx 执行方式，避免只验证参数构造。
- [x] npm run verify 通过。
- [x] git diff --check 通过。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-22T03:10:06.754Z
- note: Windows skills 搜索执行修复已验证。

## 最终行为契约

本节用于给用户审查功能完整行为；必须覆盖所有已知正常、失败、边界、权限、状态、异常、空值和默认行为。模型自行采用的默认策略也必须写清楚。

1. Windows skills 搜索执行
  - 条件：Windows 环境中通过 spec_skills_search/searchSkills 查询多词关键词
  - 触发入口：用户调用 skills 搜索工具或本地 searchSkills({ query: 'ui ux' })
  - 输入与前置状态：query 为 ui ux，maxChars 限制输出长度
  - 执行过程：
    1. 构造 npx skills find 参数，查询文本作为单个 CLI 参数保留
    2. Windows 下使用 shell 执行 npx.cmd，并隐藏进程窗口
    3. 固定 utf8 encoding 清理 ANSI 和 CRLF 输出
    4. 返回渲染后的 Skills Search 结果
  - 输出结果：stdout 包含 skills.sh 搜索结果，例如 frontend-design-ui-ux、ui-designer、ux-ui-design
  - 副作用：只执行网络搜索，不写项目文件；dryRun 安装路径仍不安装 skill
  - 默认行为：非 Windows 仍使用 npx 直接 execFile；timeout 默认 120000ms，maxBuffer 1MB
  - 边界处理：搜索查询为空时仍由 buildSkillsSearchArgs 抛出 required 错误
  - 结果摘要：本地 dist 验证通过，不再出现 spawn EINVAL
  - 验证：bun test/unit.ts、npm run build、npm run verify、git diff --check、本地 dist searchSkills 验证
  - 关联文件：
    - `src/skills/skills-cli.ts`
    - `test/unit.ts`
