# 收敛 UI UX guidance 为 skill 路由

## Meta

- status: done
- source: user-prompt

## 用户原始描述

根据用户反馈，收敛 UI/UX guidance：

- 去掉 ui-ux guidance 中内置的详细设计原则、视觉约束、官网结构规则、AI 味 checklist、文案约束、首屏 checklist 等描述。
- UI/UX 工作不要让模型自己尝试设计和约束，只需要引导模型使用指定的 `ui-ux-pro-max` skill。
- guidance 只保留如何搜索/安装/使用指定 skill 的最小工作流，以及不要把 guidance 当成设计规范的说明。
- 更新已生成的 `specs/guidance/ui-ux.md` 和模板 `src/templates/guidance.ts`。
- 更新测试断言，避免继续要求那些已移除的 UI/UX 原则文本。
- 更新相关文档中仍在展开 UI/UX 本地原则的段落。

## TODO

- [x] 去掉 ui-ux guidance 中内置的详细设计原则、视觉约束、官网结构规则、AI 味 checklist、文案约束、首屏 checklist 等描述。
- [x] UI/UX 工作不要让模型自己尝试设计和约束，只需要引导模型使用指定的 `ui-ux-pro-max` skill。
- [x] guidance 只保留如何搜索/安装/使用指定 skill 的最小工作流，以及不要把 guidance 当成设计规范的说明。
- [x] 更新已生成的 `specs/guidance/ui-ux.md` 和模板 `src/templates/guidance.ts`。
- [x] 更新测试断言，避免继续要求那些已移除的 UI/UX 原则文本。
- [x] 更新相关文档中仍在展开 UI/UX 本地原则的段落。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T16:16:58.023Z
- note: UI/UX guidance has been reduced to a designated skill router. Local UI/UX design principles/checklists were removed from guidance, docs, quality-review, and generated spec templates.

## 最终行为契约

1. UI/UX guidance 只路由到指定 skill
  - 条件：模型读取 `ui-ux` guidance 处理 UI/UX 任务
  - 触发入口：调用 `spec_guidance_read` with name `ui-ux` 或读取 `specs/guidance/ui-ux.md`
  - 输入与前置状态：当前 UI/UX 任务、当前 spec/TODO、用户要求，以及可选 skills 工具
  - 执行过程：
    1. guidance 提示默认使用 `ui-ux-pro-max` skill
    2. 提示默认来源 `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill`
    3. 未安装时调用 `spec_skills_install`，需要预览命令时传 `dryRun: true`
    4. 需要其他专项能力时调用 `spec_skills_search` 搜索 skills.sh
    5. 明确本 guidance 不维护视觉、文案、首屏、官网结构或验收 checklist
  - 输出结果：模型被引导去使用指定 skill，而不是基于本 guidance 自行套用本地 UI/UX 规则
  - 副作用：读取 guidance 无副作用；只有显式调用 install 工具才会安装 skill
  - 默认行为：默认 skill 是 `ui-ux-pro-max`，默认安装工具仍由 `spec_skills_install` 处理
  - 边界处理：若 skill 与用户要求或当前 spec 冲突，以用户要求和当前 spec 为准并说明取舍；无法安装时报告阻塞或给出 dry-run 命令
  - 结果摘要：`src/templates/guidance.ts` 和 `specs/guidance/ui-ux.md` 已收敛为 skill 路由。
  - 验证：bun test/unit.ts; bun test/smoke.ts
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/ui-ux.md`

2. Spec 模板不再生成本地 UI/UX checklist
  - 条件：创建 active spec 或 source spec，且任务可能涉及前端、页面、组件或交互
  - 触发入口：调用 `spec_create` 或相关模板生成流程
  - 输入与前置状态：用户 prompt、项目类型推断、模板函数
  - 执行过程：
    1. 模板生成 `## UI/交互 Skill 路由` 章节
    2. 章节只提示读取 `ui-ux` guidance、使用 `ui-ux-pro-max`、必要时 `spec_skills_install` 或 `spec_skills_search`
    3. 不再输出首屏真实对象、AI 味、品牌不可替换性、OSS 官网结构、Web 截图等本地 checklist
  - 输出结果：新 spec 只记录 UI/UX skill 使用路径和使用结果，不维护本地 UI 设计规则
  - 副作用：不会自动安装 skill；安装仍需显式调用 MCP 工具
  - 默认行为：UI/UX 相关 spec 默认指向 `ui-ux-pro-max` skill
  - 边界处理：非 UI/UX 任务可以忽略该章节
  - 结果摘要：`prompt-documents.ts` 和 `spec-documents.ts` 已更新，测试覆盖旧文本不再出现。
  - 验证：bun test/unit.ts; bun test/smoke.ts
  - 关联文件：
    - `src/templates/prompt-documents.ts`
    - `src/templates/spec-documents.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

3. 文档和质量审查不再展开旧 UI 规则
  - 条件：用户阅读 README、MCP tools/workflow docs 或 quality-review guidance
  - 触发入口：打开文档或读取 quality-review guidance
  - 输入与前置状态：当前仓库文档与 guidance markdown
  - 执行过程：
    1. README/docs 删除事实优先、AI 味、首屏、OSS 结构等本地 UI/UX 原则展开
    2. quality-review 的 UI 与交互质量段落改为检查是否使用 `ui-ux-pro-max`、是否安装或 dry-run、是否记录 skill 输出
    3. 搜索目标文件确认旧 checklist 文本已移除
  - 输出结果：文档层面只说明 UI/UX guidance 是 skill 路由，不再指导模型自行设计 UI/UX 规则
  - 副作用：无运行时副作用
  - 默认行为：质量审查只检查 skill 使用证据，不替代 skill 做设计审查
  - 边界处理：用户自定义项目 guidance 仍优先于内置默认文件
  - 结果摘要：文档、quality-review guidance 和测试已同步更新。
  - 验证：npm run docs:build; rg old UI/UX checklist phrases passed
  - 关联文件：
    - `README.md`
    - `docs/guide/mcp-tools.md`
    - `docs/guide/workflow.md`
    - `specs/guidance/quality-review.md`
