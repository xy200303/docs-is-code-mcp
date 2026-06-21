# 精简 TODO 模板工程原则

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户确认：每个 todo 里不需要单独展开完整工程质量约束。TODO 文件应只保留短执行协议和 guidance 指针，避免重复 Hard Rules / Recommended Practices / Business Confirmation Rules。

目标：
- 修改 spec_todo 生成模板，移除每个 TODO 文件里的完整工程质量约束和业务不确定性强制确认正文。
- 保留短执行要求，明确开始前读 spec_context、按未勾选 TODO 顺序执行、完成后 checkpoint。
- 在短执行要求中指向 spec_guidance_list/spec_guidance_read，提示需要工程/UI/UX/Git/PR/spec-writing 原则时按需读取 guidance。
- 更新测试，确保 todoSpec 不再包含工程质量约束和 Hard Rules 正文，但包含 guidance 指针。
- 运行 build/unit/smoke/release check 等验证。

## TODO

- [x] 修改 spec_todo 生成模板，移除每个 TODO 文件里的完整工程质量约束和业务不确定性强制确认正文。
- [x] 保留短执行要求，明确开始前读 spec_context、按未勾选 TODO 顺序执行、完成后 checkpoint。
- [x] 在短执行要求中指向 spec_guidance_list/spec_guidance_read，提示需要工程/UI/UX/Git/PR/spec-writing 原则时按需读取 guidance。
- [x] 更新测试，确保 todoSpec 不再包含工程质量约束和 Hard Rules 正文，但包含 guidance 指针。
- [x] 运行 build/unit/smoke/release check 等验证。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T13:53:20.765Z
- note: TODO 模板已改为轻量执行协议，完整工程原则改由 guidance 按需读取。

## 最终行为契约

1. 生成轻量 TODO spec
  - 条件：调用 spec_todo 或 createTodoFromPrompt 生成临时 TODO 文件。
  - 触发入口：用户提出小而明确的临时任务。
  - 输入与前置状态：title 和 prompt；prompt 中可包含普通文本、Markdown bullet、checkbox、目标/验收等结构标题。
  - 执行过程：
    1. todoSpec 从 prompt 提取可执行 TODO，过滤结构标题。
    2. 生成 Meta、用户原始描述、TODO、执行要求和实际行为记录章节。
    3. 执行要求只保留短协议：先读 spec_context、按未勾选 TODO 顺序执行、完成后勾选或标阻塞、阶段完成后 spec_checkpoint。
    4. 工程、UI/UX、spec 写作、Git 提交或 PR 原则不在 TODO 文件展开，只提示用 spec_guidance_list/spec_guidance_read 按需读取。
  - 输出结果：生成的 TODO 文件更短，包含 guidance 指针和行为记录要求，不再包含完整工程质量约束、Hard Rules 或业务不确定性强制确认正文。
  - 副作用：写入 specs/todo/YYYY-MM-DD/NNN-title.md；不会改动 guidance 文件。
  - 默认行为：没有可提取任务时生成 `- [ ] 待补充任务。`；checkbox 状态按用户输入保留。
  - 边界处理：结构标题如 目标、验收、Requirements 不会被误生成为 TODO；验证命令 bullet 仍作为可执行项保留。
  - 结果摘要：TODO 文件聚焦当前任务本身，工程原则由 spec_context 的 Guidance Index 和 spec_guidance_read 提供。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify、git diff --check 均通过。
  - 关联文件：
    - `src/templates/prompt-documents.ts`
    - `test/unit.ts`
    - `test/smoke.ts`
