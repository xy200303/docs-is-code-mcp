# mcp 源码审查任务

## Meta

- status: source-review/needs-ai-summary
- source: static-source-hints
- review: required

## 使用边界

本文件由 MCP 基于 `Spec Coding MCP` 的源码路径、命名、路由、导出和测试线索生成。它不是业务结论，只是交给 AI 阅读源码的任务单。

- 禁止把下面的静态线索当成业务事实。
- AI 必须打开并阅读相关源码、测试和配置后，再填写业务目标、行为规则和验收标准。
- 金额、状态机、并发、权限等规则来源不明时，必须向用户确认。

## 优先阅读入口

- `src/mcp/tool-schema.ts`
- `src/mcp/write-schemas.ts`

## 路由/接口搜索线索

- 未识别到明显路由

## UI/客户端搜索线索

- 未识别到明显组件

## 数据模型搜索线索

- `docs-spec-implement/scripts/detect_doc_changes.py DocObject`
- `src/cli/command-status.ts StatusRecommendation`
- `src/cli/command-status.ts WorkflowState`
- `src/cli/command-status.ts ListedSpecs`
- `src/cli/command-status.ts OpenTodo`
- `src/cli/command-status.ts StatusReport`
- `src/cli/registry-types.ts ToolId`
- `src/cli/registry-types.ts ToolInfo`
- `src/cli/registry-types.ts RegistryPaths`
- `src/cli/registry-types.ts ServerCommand`
- `src/cli/registry-types.ts RegisterOptions`
- `src/cli/registry-types.ts RegisterResult`

## 测试搜索线索

- `package.json`
- `package.json`
- `package.json`
- `package.json`

## AI 阅读任务

- 读取优先入口、相关导入导出、调用方和测试，确认真实业务目标。
- 总结正常流程、失败分支、默认参数、边界条件、权限和数据约束。
- 标明哪些行为来自源码证据，哪些规则仍需用户确认。
- 若要继续开发，把本文件补全后移动到 `active/`，再调用 `spec_context`。

## 待确认问题

- 这个模块对应的真实业务名称是什么？
- 当前可观察行为中哪些必须保持，哪些可以调整？
- 是否存在未在测试中覆盖的权限、状态、并发、幂等或错误处理规则？
- 默认参数、配置来源和环境差异是否明确？

## AI 总结输出模板

- 业务目标：AI 阅读源码后填写。
- 关键入口：列出已阅读的文件、函数、路由、组件或测试。
- 数据流：描述输入、处理、输出和副作用。
- 未确认规则：列出必须向用户确认的问题。

## 行为规则

| 场景 | 条件 | 当前源码行为 | 目标行为 | 证据文件 |
|---|---|---|---|
| 正常 | AI 阅读源码后填写 | AI 阅读源码后填写 | 待用户确认 | 待读取 |
| 失败 | AI 阅读源码后填写 | AI 阅读源码后填写 | 待用户确认 | 待读取 |
| 边界 | AI 阅读源码后填写 | AI 阅读源码后填写 | 待用户确认 | 待读取 |

## 实际行为记录

- 记录来源：只能记录已阅读代码、测试结果或用户确认的事实。
- 分支条件：AI 阅读源码后补充真实正常、失败、边界、权限和状态分支。
- 默认参数行为：AI 阅读源码后补充默认值、配置来源和覆盖规则。
- 边界处理结果：AI 阅读源码后补充异常、空值、权限、状态等处理结果。
- 验证结果：AI 运行或确认验证命令后记录。
- 禁止事项：不要把静态线索、猜测或“看起来合理”的行为写成事实。

## 验收标准

- AI 已阅读相关源码和测试，而不是只依据本文件的静态线索。
- 行为规则、默认参数、边界处理和风险问题已用中文补全。
- 若本 spec 仅用于审查且不需要改动，可保持 `source-review/needs-ai-summary` 状态。
- 若当前功能需要移除，把状态改为 `active/removal` 并写清移除范围。
