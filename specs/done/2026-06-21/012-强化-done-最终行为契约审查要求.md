# 强化 done 最终行为契约审查要求

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户要求：done 里面的最终行为契约需要交代整个功能的所有情况给用户审查，即便是模型自己使用的默认行为也需要交代清楚。

目标：
- 强化 spec-writing guidance 和默认 specs/guidance/spec-writing.md，明确最终行为契约是给用户审查的完整功能全景。
- 明确 behaviorRecords/defaultBehavior 需要覆盖所有已知正常、失败、边界、权限、状态、异常、空值和默认行为；模型自己采用的默认策略也必须写清。
- 更新 spec_done / behaviorRecords 工具描述和缺失行为提示，避免只记录局部结果。
- 更新 README 或相关模板说明，让用户能理解 done 的最终行为契约审查用途。
- 更新测试并运行验证。

## TODO

- [x] 强化 spec-writing guidance 和默认 specs/guidance/spec-writing.md，明确最终行为契约是给用户审查的完整功能全景。
- [x] 明确 behaviorRecords/defaultBehavior 需要覆盖所有已知正常、失败、边界、权限、状态、异常、空值和默认行为；模型自己采用的默认策略也必须写清。
- [x] 更新 spec_done / behaviorRecords 工具描述和缺失行为提示，避免只记录局部结果。
- [x] 更新 README 或相关模板说明，让用户能理解 done 的最终行为契约审查用途。
- [x] 更新测试并运行验证。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T14:15:13.635Z
- note: done 最终行为契约已强化为给用户审查的完整功能全景。

## 最终行为契约

1. 归档 done 时生成可审查最终行为契约
  - 条件：调用 spec_done 并提供 behaviorRecords。
  - 触发入口：实现完成、TODO 更新、验证通过后归档 spec。
  - 输入与前置状态：file、note、behaviorRecords；每条 behaviorRecord 可包含 scenario、condition、trigger、input、steps、output、sideEffects、defaultBehavior、edgeCase、verification、relatedFiles。
  - 执行过程：
    1. markSpecDone 读取源 spec 并清理执行模板噪音。
    2. behaviorRecordLines 渲染 ## 最终行为契约。
    3. 最终行为契约标题下新增审查说明，要求覆盖所有已知正常、失败、边界、权限、状态、异常、空值和默认行为。
    4. 每条 behaviorRecord 继续渲染触发入口、输入、执行过程、输出、副作用、默认行为、边界处理、结果摘要、验证和关联文件。
  - 输出结果：done 文件包含给用户审查的完整行为契约说明和逐场景行为记录。
  - 副作用：源 spec 从 active/todo 移到 done/YYYY-MM-DD/NNN-title.md。
  - 默认行为：若 behaviorRecords 为空，仍渲染未提供已验证行为占位，并在 nextSteps 中警告必须补充完整最终行为契约。
  - 边界处理：模型自己采用的默认策略、缺字段回退、未传参数处理、未改变的旧行为都应写入 defaultBehavior 或相关场景记录。
  - 结果摘要：用户审查 done 文件时能看到功能整体行为、分支和默认策略，而不只是模型摘要。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify、git diff --check 均通过。
  - 关联文件：
    - `src/spec/behavior-record.ts`
    - `src/spec/done-writer.ts`
    - `src/mcp/write-schemas.ts`
    - `src/mcp/register-write-tools.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

2. 读取 spec-writing guidance 获取最终行为契约要求
  - 条件：调用 spec_guidance_read，name 为 spec-writing。
  - 触发入口：模型需要记录 checkpoint、done 或最终行为契约时。
  - 输入与前置状态：projectRoot/specsDir/name=spec-writing。
  - 执行过程：
    1. 默认 spec-writing guidance 模板包含最终行为契约审查规则。
    2. 当前项目 specs/guidance/spec-writing.md 同步包含相同规则。
    3. guidance 明确最终行为契约是给用户审查的完整功能全景，不是模型内部摘要。
  - 输出结果：模型读取 guidance 后能知道必须交代所有已知情况和模型采用的默认行为。
  - 副作用：缺失 spec-writing.md 时 guidance 工具会写入包含新要求的默认文件；已有文件不覆盖。
  - 默认行为：已有项目中用户编辑过 guidance 时不会被自动覆盖；当前仓库已同步默认内容。
  - 边界处理：如果用户自定义 guidance 缺少新要求，需要用户手动合并或通过未来刷新机制处理。
  - 结果摘要：done 归档前的行为记录要求更清晰，减少只记录局部结果的风险。
  - 验证：test/unit.ts 与 test/smoke.ts 验证默认 guidance 包含审查全景和模型默认行为要求。
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/spec-writing.md`
    - `test/unit.ts`
    - `test/smoke.ts`
