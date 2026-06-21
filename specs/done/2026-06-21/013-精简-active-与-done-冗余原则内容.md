# 精简 active 与 done 冗余原则内容

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户反馈：active 和 done 里面还是会有冗余内容，例如完整工程质量约束、Hard Rules、Recommended Practices 等。现在完整原则应该只在 guidance 中按需读取。

目标：
- 精简 active spec 生成模板，移除完整工程质量约束和业务不确定性强制确认正文。
- active spec 只保留短执行/guidance 指针，明确工程原则读 engineering/specs/guidance/engineering.md，UI/UX 原则读 ui-ux/specs/guidance/ui-ux.md。
- 确保 done 归档不会带入 active 中的长工程原则或业务规则冗余内容。
- 更新测试，覆盖 createSpecFromPrompt / userPromptSpec / bootstrap active spec 不再包含 Hard Rules、Recommended Practices 或业务规则全文。
- 运行验证并提交。

## TODO

- [x] 精简 active spec 生成模板，移除完整工程质量约束和业务不确定性强制确认正文。
- [x] active spec 只保留短执行/guidance 指针，明确工程原则读 engineering/specs/guidance/engineering.md，UI/UX 原则读 ui-ux/specs/guidance/ui-ux.md。
- [x] 确保 done 归档不会带入 active 中的长工程原则或业务规则冗余内容。
- [x] 更新测试，覆盖 createSpecFromPrompt / userPromptSpec / bootstrap active spec 不再包含 Hard Rules、Recommended Practices 或业务规则全文。
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

- doneAt: 2026-06-21T14:24:00.920Z
- note: active/done 中的冗余工程原则已改为 guidance 指针与归档清理。

## 最终行为契约

1. 生成 active spec 时使用 Guidance 指针
  - 条件：调用 spec_create/createSpecFromPrompt 或新项目 bootstrap 生成 active spec。
  - 触发入口：用户提出需要设计、验收标准或实现计划的功能任务，或新项目 bootstrap 创建起步 active spec。
  - 输入与前置状态：title、prompt、projectRoot、specsDir。
  - 执行过程：
    1. userPromptSpec 生成 active spec 的目标、影响范围、行为规则、AI 实现计划、实际行为记录、验收标准和 TODO。
    2. 开发前置要求仍要求先调用 spec_context。
    3. 完整工程原则和业务确认规则不再嵌入 active 文件。
    4. active 文件新增 ## Guidance，提示用 spec_guidance_list/spec_guidance_read 按需读取，并明确 engineering 对应 specs/guidance/engineering.md、ui-ux 对应 specs/guidance/ui-ux.md。
  - 输出结果：active spec 更短，只保留任务事实、实现计划和 guidance 指针，不再出现 ## 工程质量约束、### Hard Rules、### Recommended Practices 或 ## 业务不确定性强制确认。
  - 副作用：写入 specs/active/YYYY-MM-DD/NNN-title.md。
  - 默认行为：spec 写作、Git 提交或 PR 工作流仍通过 spec-writing、git-commit、pr-submit guidance name 按需读取。
  - 边界处理：用户手写旧 active 中若已有长规则，done 归档仍会剔除旧的工程/业务规则章节。
  - 结果摘要：active spec 聚焦需求和实现计划，完整原则由 guidance 按需提供。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify、git diff --check 均通过。
  - 关联文件：
    - `src/templates/prompt-documents.ts`
    - `src/templates/markdown.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

2. 归档 done 时剔除模板指导噪音
  - 条件：调用 spec_done 归档 active 或 todo spec。
  - 触发入口：实现、TODO、验证和最终行为契约完成后归档。
  - 输入与前置状态：file、behaviorRecords、note。
  - 执行过程：
    1. markSpecDone 读取源 spec。
    2. cleanDoneArchiveText 删除执行要求、Guidance、工程质量约束、业务不确定性强制确认、Checkpoint、Done 和旧最终行为契约章节。
    3. done 文件追加新的 Done 元数据和最终行为契约。
  - 输出结果：done 文件不再包含 active 中的 Guidance 指针或旧长工程原则，只保留可审查的需求事实和最终行为契约。
  - 副作用：源 spec 移动到 specs/done/YYYY-MM-DD/NNN-title.md。
  - 默认行为：历史旧 spec 中的 ## 工程质量约束 和 ## 业务不确定性强制确认 仍会被归档清理逻辑排除。
  - 边界处理：若源文档含 ## Guidance，也会被归档清理逻辑排除，避免 done 中出现执行期提示。
  - 结果摘要：done 归档内容更干净，不重复展示工程原则。
  - 验证：test/unit.ts 和 test/smoke.ts 验证 done archive 不含 Guidance 和长规则章节。
  - 关联文件：
    - `src/spec/done-writer.ts`
    - `test/unit.ts`
    - `test/smoke.ts`
