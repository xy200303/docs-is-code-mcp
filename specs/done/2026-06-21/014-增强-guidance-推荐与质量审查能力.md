---
name: '014-增强-guidance-推荐与质量审查能力'
version: '1.1.0'
title: '增强 guidance 推荐与质量审查能力'
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

# 增强 guidance 推荐与质量审查能力

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户确认继续优化：希望该项目能帮助复杂项目开发和日常项目开发，写高质量代码、高质量界面和高质量交互。

目标：
- 在 spec_context 中增加轻量 Guidance Recommendations，根据 selected specs/open TODO 内容和下一步场景推荐读取对应 guidance。
- 新增内置 quality-review guidance，用于实现后自查代码质量、测试、架构边界、UI/交互状态和交付风险。
- active spec 模板增加 UI/交互质量检查矩阵，但不展开 UI 原则正文，只保留需要读 ui-ux guidance 的指针。
- 更新当前 specs/guidance、README、AGENTS/CLAUDE 索引、工具描述和测试。
- 运行验证并提交。

## TODO

- [x] 在 spec_context 中增加轻量 Guidance Recommendations，根据 selected specs/open TODO 内容和下一步场景推荐读取对应 guidance。
- [x] 新增内置 quality-review guidance，用于实现后自查代码质量、测试、架构边界、UI/交互状态和交付风险。
- [x] active spec 模板增加 UI/交互质量检查矩阵，但不展开 UI 原则正文，只保留需要读 ui-ux guidance 的指针。
- [x] 更新当前 specs/guidance、README、AGENTS/CLAUDE 索引、工具描述和测试。
- [x] 运行验证并提交。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T14:41:43.669Z
- note: 已完成 guidance 推荐、quality-review 内置提示词、UI/交互质量检查矩阵、文档和测试更新。

## 最终行为契约

1. spec_context 输出 Guidance Recommendations
  - 条件：调用 spec_context 且存在 selected specs、open TODO 或工作流下一步。
  - 触发入口：模型在代码或文档变更前调用 spec_context。
  - 输入与前置状态：projectRoot、specsDir、可选 files/contextMode，以及当前 specs/todo/active/review/done 状态。
  - 执行过程：
    1. spec_context 读取 workflow state、selected specs 和 open TODO。
    2. buildSpecContextMarkdown 调用 workflowRecommendationLines 生成 Recommended Next Step。
    3. 渲染逻辑从推荐文本中解析 nextTool，并收集 selected spec 标题、文件、状态、来源、正文和 open TODO 文本。
    4. 根据关键词和 nextTool 匹配 engineering、ui-ux、spec-writing、git-commit、pr-submit、quality-review。
    5. 在 Guidance Index 后输出 Guidance Recommendations，只给 name、文件路径和读取理由，不展开长提示词正文。
  - 输出结果：context markdown 包含 Guidance Recommendations；例如需要记录 checkpoint/done 或出现验证/质量/交互词时推荐 quality-review，需要行为记录或最终契约时推荐 spec-writing。
  - 副作用：无文件写入；只影响 spec_context 输出内容。
  - 默认行为：如果没有命中任何关键词，默认推荐 engineering 和 quality-review，提醒实现不确定时读工程原则、完成后做轻量自查。
  - 边界处理：如果某个 guidance name 未注册，推荐构造会跳过该项，避免输出不可读 guidance。当前运行中的旧 MCP 安装版不会热加载新 guidance，但本地源码、构建产物和测试已验证新版行为。
  - 结果摘要：spec_context 现在会在 Guidance Index 后输出按任务内容和 nextTool 生成的轻量 guidance 推荐。
  - 验证：npm run verify；test/smoke.ts 断言 context 输出 Guidance Recommendations、spec-writing 和 quality-review。
  - 关联文件：
    - `src/spec/context-markdown.ts`
    - `test/smoke.ts`

2. 默认 guidance 增加 quality-review
  - 条件：调用 spec_init/spec_bootstrap/spec_guidance_list/spec_guidance_read，或 guidance 目录缺失、为空、缺少默认文件。
  - 触发入口：项目初始化、项目引导、模型列出 guidance，或按 name 读取 quality-review。
  - 输入与前置状态：projectRoot、specsDir，读取时 name 为 quality-review。
  - 执行过程：
    1. src/templates/guidance.ts 注册 quality-review 模板，文件名为 quality-review.md。
    2. ensureDefaultGuidanceFiles 遍历 guidanceTemplates，把缺失的默认 guidance 写入 specs/guidance。
    3. spec_guidance_list 输出 quality-review 的标题、用途和文件路径。
    4. spec_guidance_read 在缺失默认文件时先补齐，再读取项目中的 specs/guidance/quality-review.md。
  - 输出结果：项目默认拥有 specs/guidance/quality-review.md，内容包含代码质量自查、测试与验证、UI 与交互质量、交付前审查。
  - 副作用：缺少默认文件时写入 specs/guidance/quality-review.md；已有用户编辑文件不会覆盖。当前仓库新增 specs/guidance/quality-review.md。
  - 默认行为：guidance 目录中已有其他文件时，只补缺失的默认 guidance；用户自定义 ui-ux、engineering 等文件保持不变。
  - 边界处理：未知 guidance name 继续 fail fast，并在错误信息里列出 engineering、ui-ux、spec-writing、git-commit、pr-submit、quality-review。
  - 结果摘要：内置 guidance 集合扩展为 6 项，新增可编辑的 quality-review 默认提示词。
  - 验证：bun test/unit.ts 和 bun test/smoke.ts 验证默认数量从 5 变为 6、fallback 会写入 quality-review.md、读取内容包含质量审查关键章节。
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/quality-review.md`
    - `test/unit.ts`
    - `test/smoke.ts`

3. active spec 提醒 UI/交互质量矩阵
  - 条件：通过 spec_create/spec_bootstrap 新项目或模板生成 active spec。
  - 触发入口：用户创建 active spec，或新项目 bootstrap 使用 initialPrompt 生成起步 active spec。
  - 输入与前置状态：title、prompt、projectRoot、specsDir。
  - 执行过程：
    1. userPromptSpec 和 specTemplate 在 AI 实现计划后插入 UI/交互质量检查章节。
    2. 章节只列检查项：用户路径、状态覆盖、输入与防错、响应式与可读性、验证方式。
    3. 章节指向 ui-ux 和 quality-review guidance，避免展开完整 UI/UX 原则。
    4. 通用 Guidance 指针同步提示实现后自查读取 quality-review。
  - 输出结果：active spec 包含 UI/交互质量检查，但不包含长工程原则、Hard Rules、Recommended Practices 或业务确认正文。
  - 副作用：新生成的 active spec 文档会多一个轻量检查矩阵；done 归档清理仍会移除执行期 Guidance 噪声。
  - 默认行为：后端或非 UI 任务保留该章节作为条件性检查提示；只有前端、页面、组件或交互受影响时需要填写。
  - 边界处理：如果任务无 UI 改动，模型不需要强行展开 UI 细节，但仍可在质量审查时确认无相关影响。
  - 结果摘要：新 active spec 会稳定提示 UI/交互质量自查入口，同时保持原则正文不冗余。
  - 验证：test/unit.ts 和 test/smoke.ts 验证 active spec 含 UI/交互质量检查、loading/empty/error、undo/recovery、ui-ux 与 quality-review 指针。
  - 关联文件：
    - `src/templates/prompt-documents.ts`
    - `src/templates/spec-documents.ts`
    - `src/templates/markdown.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

4. 文档、启动协议和工具描述同步新 guidance 能力
  - 条件：用户或模型查看 README、AGENTS.md、CLAUDE.md、specs/README.md，或 MCP 注册 read tools。
  - 触发入口：项目启动、工具文档阅读、spec_guidance_list/spec_guidance_read schema/description 展示。
  - 输入与前置状态：无运行输入，或 MCP 工具注册时的描述文本。
  - 执行过程：
    1. AGENTS.md、CLAUDE.md 和 src/templates/agents.ts 的 Guidance 索引新增 quality-review。
    2. README、specs/README 和 docs guide 说明 guidance 现在覆盖工程、UI/UX、spec 写作、Git、PR 和质量审查。
    3. register-read-tools 的 spec_guidance_list 描述和 spec_guidance_read name 示例加入 quality-review。
    4. 测试同步断言列表、文件路径和 fallback 行为。
  - 输出结果：模型启动路由保持短小，通过 guidance 索引知道质量审查能力；工具描述能提示可读 quality-review。
  - 副作用：只修改文档和工具描述，无运行时数据写入。
  - 默认行为：原则正文继续不塞进 AGENTS/CLAUDE 或 spec_context，只在需要时通过 spec_guidance_read 读取。
  - 边界处理：已经安装的旧 MCP 进程不会自动获得新工具描述，需要安装/重启新版后生效。
  - 结果摘要：文档、启动协议和工具描述都能指向新的 quality-review guidance。
  - 验证：npm run verify；smoke test 检查工具描述、root 文档和 guidance list。
  - 关联文件：
    - `AGENTS.md`
    - `CLAUDE.md`
    - `src/templates/agents.ts`
    - `README.md`
    - `docs/guide/mcp-tools.md`
    - `docs/guide/workflow.md`
    - `specs/README.md`
    - `src/mcp/register-read-tools.ts`
    - `test/smoke.ts`

5. UI/UX guidance 改为事实与产品语境优先
  - 条件：模型读取 ui-ux guidance 进行页面、组件或交互设计。
  - 触发入口：模型在 UI/UX 原则不确定或需要校准界面质量时调用 spec_guidance_read，name 为 ui-ux。
  - 输入与前置状态：projectRoot、specsDir、name=ui-ux，或项目初始化后读取 specs/guidance/ui-ux.md。
  - 执行过程：
    1. 默认 ui-ux guidance 先要求确认真实产品语境、用户、内容和下一步。
    2. Linear/Vercel、暗色、蓝色 accent、8pt grid、Inter 和 Aether Vector 只作为可选参考，不再作为所有项目默认外观。
    3. guidance 要求文案、CTA 和信息结构来自用户输入、仓库、文档、源码、公开链接或确认结果。
    4. guidance 明确只有 OSS 或开源组织官网才默认优先 GitHub、featured repos、贡献路径、docs/roadmap、license/community 和项目状态。
    5. guidance 要求 Web 验收确认当前端口服务的是当前项目，并检查桌面/移动端截图无串项目、空白、错位或遮挡。
  - 输出结果：模型读取 ui-ux guidance 后会优先避免虚构内容和错套风格，并按企业官网、产品官网、作品集、开源组织或文档站等项目类型设计信息架构。
  - 副作用：specs/guidance/ui-ux.md 与内置 src/templates/guidance.ts 默认内容同步更新；已有用户自定义 guidance 在其他项目中仍不会被自动覆盖。
  - 默认行为：项目类型不明确时不猜测视觉方向或网站结构，先确认或搜索；没有现成设计系统时才建立轻量视觉规则。
  - 边界处理：非 OSS 官网不会被自动塞入 GitHub/repo/contribution/license 等开源组织结构；OSS 关键词明确时 active spec 会追加开源结构检查。
  - 结果摘要：UI/UX guidance 现在更适合复杂项目和日常项目，强调事实来源、项目身份和真实验收。
  - 验证：bun test/unit.ts 验证 generic 企业官网不包含 OSS/开源组织结构，OSS prompt 包含 GitHub 入口、Contribution guide、License/Community；bun test/smoke.ts 验证 guidance 内容。
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/ui-ux.md`
    - `test/unit.ts`
    - `test/smoke.ts`

6. active spec 记录定位与事实来源并按任务类型提示 UI 结构
  - 条件：通过 spec_create/spec_bootstrap 生成 active spec。
  - 触发入口：用户给出功能、官网、页面、组件或交互任务后创建 active spec。
  - 输入与前置状态：title 和 prompt 文本。
  - 执行过程：
    1. userPromptSpec 根据 title/prompt 判断是否是 website 任务和 OSS/open source 任务。
    2. 所有 active spec 都加入定位与事实来源章节，要求记录真实定位、真实对象、事实来源、禁止编造和真实 CTA。
    3. UI/交互质量检查固定提示设计前定位、首屏真实对象、首屏反营销检查、状态覆盖、防错、响应式和 Web 验收。
    4. website 任务额外提示官网结构由项目类型决定。
    5. OSS/open source 任务额外提示 GitHub 入口、Featured repos、Research tracks、Contribution guide、Docs/Roadmap、License/Community、项目状态和 OSS CTA。
  - 输出结果：生成的 active spec 不再只提醒通用 UI 状态，还会要求模型先确认事实来源和项目类型；OSS 检查只在相关任务中出现。
  - 副作用：新 active spec 文档内容更完整；done 归档清理仍移除执行期 Guidance 噪声。
  - 默认行为：非网站任务仍保留事实来源和 UI 质量检查作为条件性提示；网站类型不明确时要求确认而不是套模板。
  - 边界处理：企业官网 prompt 会出现官网结构由项目类型决定，但不会出现 OSS/开源组织结构；OSS prompt 会出现开源结构检查。
  - 结果摘要：active spec 模板更能推动高质量界面和交互开发，同时避免风格错套和事实编造。
  - 验证：bun test/unit.ts 覆盖 website/OSS 分支；bun test/smoke.ts 覆盖 bootstrap starter active spec 包含定位与事实来源、UI/交互质量检查和 Web 验收。
  - 关联文件：
    - `src/templates/prompt-documents.ts`
    - `src/templates/spec-documents.ts`
    - `test/unit.ts`
    - `test/smoke.ts`
