# 审查友好的 spec 命名和真实行为记录

## Meta

- status: done
- source: user-prompt

## 用户原始描述

优化 Spec Coding 的 spec 文档组织和行为记录，避免 AI 乱猜业务行为且让人类更容易审查。

要求：
- 新生成的 active、todo、done 文档按日期目录分类，例如 specs/active/2026-06-21/001-readable-task.md、specs/done/2026-06-21/001-readable-task.md。
- 文件名包含当天递增序号和一眼可懂的业务/任务 slug，避免大量 2026-xx-todo-9.md 这类不可读名称。
- active 模板必须更明确记录 AI 打算如何实现：改哪些能力、读哪些文件、正常/失败/边界分支、默认参数、验证命令、需要用户确认的问题。
- done 最终行为契约必须强调“来自实际代码/测试验证的行为”，不是模型猜测；缺少 behaviorRecords 时要更明显地提示不可作为最终行为事实。
- 归档 done 时尽量保留可审查的目标、行为规则、AI 实现计划、实际行为记录和最终行为契约，移除流程噪音。
- 更新 list/spec_context 对嵌套日期目录的扫描兼容性，保持工具返回仍然简洁，不展开大量 done 历史。
- 更新 unit/smoke 测试，覆盖新路径命名、归档行为和行为记录提示。
- 验证 bun run build、bun test/unit.ts、bun test/smoke.ts、bun run release:check、git diff --check。

## TODO

- [x] 新生成的 active、todo、done 文档按日期目录分类，例如 specs/active/2026-06-21/001-readable-task.md、specs/done/2026-06-21/001-readable-task.md。
- [x] 文件名包含当天递增序号和一眼可懂的业务/任务 slug，避免大量 2026-xx-todo-9.md 这类不可读名称。
- [x] active 模板必须更明确记录 AI 打算如何实现：改哪些能力、读哪些文件、正常/失败/边界分支、默认参数、验证命令、需要用户确认的问题。
- [x] done 最终行为契约必须强调“来自实际代码/测试验证的行为”，不是模型猜测；缺少 behaviorRecords 时要更明显地提示不可作为最终行为事实。
- [x] 归档 done 时尽量保留可审查的目标、行为规则、AI 实现计划、实际行为记录和最终行为契约，移除流程噪音。
- [x] 更新 list/spec_context 对嵌套日期目录的扫描兼容性，保持工具返回仍然简洁，不展开大量 done 历史。
- [x] 更新 unit/smoke 测试，覆盖新路径命名、归档行为和行为记录提示。
- [x] 验证 bun run build、bun test/unit.ts、bun test/smoke.ts、bun run release:check、git diff --check。

## 实际行为记录

- 分支条件：完成后补充已实现行为。
- 默认参数行为：完成后补充默认值和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令和结果。

## Done

- doneAt: 2026-06-20T18:19:49.760Z
- note: 实现日期目录、当天序号和可读 slug 的 spec 命名，并补强真实行为记录约束。

## 最终行为契约

| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |
|---|---|---|---|---|---|---|
| 新建 active/todo 命名 | 调用 spec_create 或 spec_todo 创建用户任务时 | 文档写入 specs/active/YYYY-MM-DD/NNN-readable-name.md 或 specs/todo/YYYY-MM-DD/NNN-readable-name.md，中文标题保留为可读 slug。 | 未传 title 时从 prompt 首行推断标题；同一天同一 bucket 按现有 NNN 文件递增。 | 标题无法生成可读 slug 时使用 spec/todo fallback；同名文件存在时继续递增序号，不覆盖旧文件。 | bun run build; bun test/unit.ts; bun test/smoke.ts; bun run release:check; git diff --check | `src/spec/spec-files.ts`<br>`src/spec/scaffold.ts`<br>`test/smoke.ts` |
| done 归档命名和最终行为事实 | 调用 spec_done 归档已完成 spec 时 | done 文件写入 specs/done/YYYY-MM-DD/NNN-readable-name.md，并根据 Markdown 标题生成可读文件名。 | 归档保留目标、行为规则、AI 实现计划、实际行为记录和最终行为契约，移除执行要求、工程约束、checkpoint 等流程噪音。 | 未提供 behaviorRecords 时，最终行为契约显示“不可作为真实行为事实”，nextSteps 给出强 warning。 | bun run build; bun test/unit.ts; bun test/smoke.ts; bun run release:check; git diff --check | `src/spec/done-writer.ts`<br>`src/spec/behavior-record.ts`<br>`test/unit.ts`<br>`test/smoke.ts` |
| active 模板审查计划 | 生成 active spec 或模板时 | AI 实现计划要求记录目标能力、阅读入口、改动文件、数据流、分支处理、默认值/配置、验证命令和待确认问题。 | 实际行为记录只允许记录已阅读代码、已修改代码、测试结果或用户确认事实。 | 业务规则不明确时模板要求写入待确认问题，禁止把猜测写成事实。 | bun run build; bun test/smoke.ts | `src/templates/prompt-documents.ts`<br>`src/templates/spec-documents.ts` |
| 嵌套目录列表兼容 | spec_list 或 spec_context 扫描 active/todo/done 时 | 递归扫描仍能发现日期目录下的 markdown；工具输出继续受列表上限控制。 | done 历史超过限制时仍只展开前 20 项并提示剩余数量。 | 旧平铺 specs 仍能被 listMarkdownFiles 递归扫描到。 | bun test/smoke.ts | `src/spec/spec-files.ts`<br>`src/mcp/render-spec.ts`<br>`test/smoke.ts` |
