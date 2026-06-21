# 加入 Aether Vector UI UX guidance 原则

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户要求将以下 UI/UX 设计原则加入默认 guidance：Act as a Senior UI/UX Designer (Linear/Vercel style). 8pt Grid, Inter font, Dark Mode (#0B0E14), CRAP principles, Gestalt grouping, 60/30/10 dark-gray-blue color ratio, loading states, undo, prevent errors, Aether Vector vibe.

任务：
- 更新内置 ui-ux guidance 默认模板。
- 同步更新当前 specs/guidance/ui-ux.md。
- 更新测试，确保默认 ui-ux guidance 包含 Aether Vector/Linear/Vercel 等关键原则。
- 运行验证并记录 checkpoint。

## TODO

- [x] 更新内置 ui-ux guidance 默认模板。
- [x] 同步更新当前 specs/guidance/ui-ux.md。
- [x] 更新测试，确保默认 ui-ux guidance 包含 Aether Vector/Linear/Vercel 等关键原则。
- [x] 运行验证并记录 checkpoint。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T12:53:53.017Z
- note: Aether Vector / Linear / Vercel UI/UX guidance 原则已加入默认提示词。

## 最终行为契约

1. 默认 UI/UX guidance 包含 Aether Vector 设计原则
  - 条件：initSpecs、spec_guidance_list 或 spec_guidance_read 需要写入或读取 ui-ux.md 默认文件。
  - 结果：ui-ux.md 默认内容新增默认角色与风格、视觉系统、交互与状态三段，包含 Senior UI/UX Designer、Linear / Vercel、8pt grid、Inter、Dark Mode #0B0E14、Aether Vector、60/30/10 色彩比例、CRAP、Gestalt、loading/pending、undo 和错误预防等原则。
  - 默认行为：用户已有自定义 ui-ux.md 不会被 ensureDefaultGuidanceFiles 覆盖；本次仓库刷新使用 initSpecs overwrite=true 明确同步默认文件。
  - 边界处理：若用户删除 ui-ux.md，下次 guidance 工具会用包含 Aether Vector 原则的新默认内容重新落盘。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run release:check、git diff --check。
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/ui-ux.md`
    - `test/unit.ts`
    - `test/smoke.ts`
