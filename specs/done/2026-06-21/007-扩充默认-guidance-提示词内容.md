# 扩充默认 guidance 提示词内容

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户要求：默认提示词需要修改，以前那种很全的提示词需要移动到 guidance 里面。截图指出现在工程 guidance 的原则太短，需要迁入更完整的工程原则。

任务：
- 定位默认 guidance 模板和当前 specs/guidance 文件。
- 将完整工程原则、业务确认规则、当前任务协议/行为记录要求迁入默认 guidance Markdown，避免只保留短版原则。
- 同步更新当前仓库 specs/guidance 默认文件，保持用户可编辑 Markdown 与内置默认一致。
- 更新测试，确保默认 guidance 包含完整规则关键内容。
- 运行验证并记录 checkpoint。

## TODO

- [x] 定位默认 guidance 模板和当前 specs/guidance 文件。
- [x] 将完整工程原则、业务确认规则、当前任务协议/行为记录要求迁入默认 guidance Markdown，避免只保留短版原则。
- [x] 同步更新当前仓库 specs/guidance 默认文件，保持用户可编辑 Markdown 与内置默认一致。
- [x] 更新测试，确保默认 guidance 包含完整规则关键内容。
- [x] 运行验证并记录 checkpoint。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T12:45:49.901Z
- note: 默认 guidance 已扩充为完整工程、业务确认、任务协议和行为记录提示词。

## 最终行为契约

1. 生成完整默认工程 guidance
  - 条件：initSpecs、spec_guidance_list 或 spec_guidance_read 需要写入缺失的 engineering.md 默认文件。
  - 结果：engineering.md 不再只包含短版八条原则；默认内容包含工程原则下的 Hard Rules、Recommended Practices，以及业务确认规则。内容由 src/templates/guidance.ts 复用 src/templates/markdown.ts 的 engineeringRuleSections 和 businessConfirmationBullets 生成，避免与 AGENTS/spec 模板规则漂移。
  - 默认行为：用户已有自定义文件不会被 ensureDefaultGuidanceFiles 覆盖；本次仓库刷新使用 initSpecs overwrite=true 明确同步默认文件。
  - 边界处理：未来约束源更新时，默认 guidance 会通过共享 helper 自动跟随，而不是维护短版副本。
  - 验证：bun test/unit.ts 与 bun test/smoke.ts 均断言 Hard Rules、Recommended Practices、业务不确定性强制确认存在。
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/engineering.md`
    - `test/unit.ts`
    - `test/smoke.ts`

2. 生成完整默认 spec-writing guidance
  - 条件：initSpecs、spec_guidance_list 或 spec_guidance_read 需要写入缺失的 spec-writing.md 默认文件。
  - 结果：spec-writing.md 默认内容包含完整当前任务协议，以及更详细的行为记录要求：触发入口、输入与前置状态、执行步骤、输出结果、副作用、分支条件、默认行为、验证结果和禁止猜测。
  - 默认行为：用户已有自定义文件不会被 ensureDefaultGuidanceFiles 覆盖；本次仓库刷新使用 initSpecs overwrite=true 明确同步默认文件。
  - 边界处理：如果用户删除 spec-writing.md，下次 guidance 工具会用完整默认内容重新落盘。
  - 验证：bun test/unit.ts 和 bun test/smoke.ts 断言当前任务协议、行为记录要求和“行为记录必须描述功能全过程”存在。
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/spec-writing.md`
    - `test/unit.ts`
    - `test/smoke.ts`
