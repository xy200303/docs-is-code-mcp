---
name: 'active-spec'
version: '1.1.0'
title: '按新 UIUX 原则重设官网'
type: done-spec
status: done
source: 'user-prompt'
description: 'User-requested implementation spec with goals, behavior rules, TODOs, and verification requirements.'
category: done
triggers:
  - 'implementation'
  - 'feature'
  - 'bugfix'
  - 'todo'
  - 'verification'
appliesTo:
  - 'active-specs'
  - 'coding-tasks'
  - 'tests'
  - 'behavior-records'
updated: '2026-06-21'
---

# 按新 UIUX 原则重设官网

## Meta

- status: done
- source: user-prompt

## 用户原始描述

按照新的 UI/UX 原则重新设计 Spec Coding MCP 官网。必须使用 ui-ux guidance 指定的 ui-ux-pro-max skill 做设计判断；官网需要基于本项目真实对象和真实内容，不使用泛 SaaS/泛 AI 营销套路，不编造指标、客户、性能数据或虚构 dashboard。优先展示 Spec Coding MCP 的真实能力、工作流、MCP 工具、guidance、skills 集成、安装和文档入口。更新 VitePress 官网页面和样式，保持内容可信、结构清晰、移动端可用，并完成构建验证。

## 目标

- 根据用户描述实现对应行为。

## 定位与事实来源

- 项目真实定位：待 Codex 根据用户描述、仓库、文档或确认结果补充；不明确时先确认或搜索。
- 真实对象：列出首屏/核心流程必须出现的 repo、截图、demo、项目矩阵、核心交互、组件或数据。
- 事实来源：列出可用于文案和结构的用户输入、README、源码、配置、公开链接或明确确认。
- 禁止编造：指标、客户、性能数据、邮箱、融资、商业定位、社区规模和路线图承诺都必须有来源。
- CTA：只使用真实下一步，例如 GitHub、Docs、Demo、Install、Contribute、Roadmap、Issue 或用户确认的业务入口。

## 影响范围

- 后端/API：待 Codex 根据代码定位
- 前端/客户端：待 Codex 根据代码定位
- 数据/迁移：待 Codex 根据代码定位
- 测试：必须新增或更新

## 行为规则

| 场景 | 条件 | 预期结果 |
|---|---|---|
| 正常 | 满足业务前置条件 | 完成目标行为 |
| 失败 | 参数、权限、状态或依赖异常 | 返回可理解错误，不产生未声明副作用 |

## AI 实现计划

- 目标能力：待 Codex 阅读代码后补充要新增、修改或移除的业务能力。
- 阅读入口：列出已读取或必须读取的源码、测试、配置和文档。
- 改动文件：列出计划修改的文件和每个文件承担的职责。
- 数据流：描述触发入口、输入与前置状态、执行步骤、输出结果、副作用和持久化边界。
- 分支处理：列出正常、失败、边界、权限、状态和异常分支。
- 默认值/配置：列出默认参数、配置来源、覆盖规则和环境差异。
- 验证命令：列出计划运行的测试、构建、lint 或人工验证命令。
- 待确认问题：列出业务规则不明确、影响面大或高风险的点；未确认前不要实现。

## UI/交互 Skill 路由

- 仅当前端、页面、组件或交互受影响时填写。
- UI/UX 工作不要在 spec 中展开本地设计原则或 checklist；读取 `ui-ux` guidance 后使用指定的 `ui-ux-pro-max` skill。
- 如果 `ui-ux-pro-max` 未安装，先调用 `spec_skills_install`；需要预览命令时使用 `dryRun: true`。
- 如果需要其他专项 UI/UX skill，先调用 `spec_skills_search` 搜索 skills.sh，再按任务需要安装。
- 记录实际使用的 skill、安装或 dry-run 结果，以及该 skill 产出的关键设计/验收建议。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## 验收标准

- 代码行为符合本 spec。
- 测试覆盖正常流程和关键失败分支。

## 开发前置要求

在修改任何代码或文档之前，必须先调用 `spec_context` 并读取输出。
如果当前任务还没有 `spec_context` 输出，就不要开始实现、重构或改写文档。

## TODO

- [x] 定位相关实现和测试。
- [x] 按本 spec 修改代码。
- [x] 新增或更新测试。
- [x] 运行验证命令并记录结果。

## Done

- doneAt: 2026-06-22T06:04:29.660Z
- note: 按新 UI/UX 原则完成官网重设。

## 最终行为契约

本节用于给用户审查功能完整行为；必须覆盖所有已知正常、失败、边界、权限、状态、异常、空值和默认行为。模型自行采用的默认策略也必须写清楚。

1. 官网首页首屏
  - 条件：用户访问 VitePress 首页 `/`
  - 触发入口：浏览器请求 docs site root path `/`
  - 输入与前置状态：VitePress 渲染 docs/index.md，加载 docs/public/site.css
  - 执行过程：
    1. VitePress 使用 layout: page 渲染自定义 HTML 首页
    2. CSS 将首屏分为 hero-copy 和 spec-console 两块
    3. 用户可以点击开始接入、GitHub、npm、MCP tools、specs/、workflow 等真实入口
  - 输出结果：首屏直接呈现真实 MCP 工具、spec 文件结构和安装命令，而不是抽象营销 hero 或虚构 dashboard。
  - 副作用：无运行时数据写入；仅静态页面渲染。
  - 默认行为：浅色主题默认使用克制的开发者工具配色；VitePress dark class 下有对应暗色 token。
  - 边界处理：移动端 390px 截图中首屏改为单列堆叠，命令和文件名允许换行，避免长命令撑破布局。
  - 结果摘要：页面显示自定义 Spec Coding MCP 工作台首屏，左侧是项目定位、真实安装命令和 GitHub/npm/开始接入入口，右侧是 spec_context 状态、specs 文件树和常用工具标签。
  - 验证：npm run docs:build; Edge headless desktop/mobile screenshots
  - 关联文件：
    - `docs/index.md`
    - `docs/public/site.css`

2. 普通 docs metadata 契约
  - 条件：单元测试检查 README 和 VitePress docs front matter
  - 触发入口：运行 bun test/unit.ts 或 npm run verify
  - 输入与前置状态：README.md、docs/**/*.md、docs/index.md
  - 执行过程：
    1. testPlainDocsAvoidSearchableMetadata 读取普通文档
    2. 检查普通 docs 不以 searchable metadata 开头
    3. 检查 docs/index.md 使用 VitePress page front matter 且不包含 generic searchable metadata
  - 输出结果：测试通过，确认官网布局变化没有重新引入普通 docs YAML 元信息问题。
  - 副作用：无。
  - 默认行为：普通 docs 页面只保留自身需要的 VitePress front matter，不加入 name/version/source/type 等 spec 元信息。
  - 边界处理：未记录
  - 结果摘要：普通 README/docs 仍不加入 SKILL/spec-style searchable metadata；docs/index.md 改为 VitePress `layout: page` 以支持自定义首页。
  - 验证：npm run verify
  - 关联文件：
    - `test/unit.ts`
    - `docs/index.md`
