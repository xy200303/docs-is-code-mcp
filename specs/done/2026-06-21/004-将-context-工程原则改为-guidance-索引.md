---
name: '004-将-context-工程原则改为-guidance-索引'
version: '1.1.0'
title: '将 context 工程原则改为 guidance 索引'
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

# 将 context 工程原则改为 guidance 索引

## Meta

- status: done
- source: user-prompt

## 用户原始描述

用户要求：spec_context 里面的工程原则等长内容可以换成索引，告诉大模型只需要在忘记原则的时候使用 guidance 工具去查看，不需要显示完整内容。

任务：
- 定位 spec_context 渲染 Engineering Constraints、Business Confirmation Rules、Current Task Protocol 的位置。
- 将长规则内容改为 compact guidance 索引/提示，指向 spec_guidance_list 和 spec_guidance_read，避免在 spec_context 中显示完整原则正文。
- 保留关键硬约束：写操作前必须先读 spec_context、按 selected specs/open TODO 执行、业务高风险不确定时先确认。
- 更新 README/specs 文档和测试，确保契约明确：原则详情按需读取 guidance 工具。
- 运行相关验证并记录 checkpoint。

## TODO

- [x] 定位 spec_context 渲染 Engineering Constraints、Business Confirmation Rules、Current Task Protocol 的位置。
- [x] 将长规则内容改为 compact guidance 索引/提示，指向 spec_guidance_list 和 spec_guidance_read，避免在 spec_context 中显示完整原则正文。
- [x] 保留关键硬约束：写操作前必须先读 spec_context、按 selected specs/open TODO 执行、业务高风险不确定时先确认。
- [x] 更新 README/specs 文档和测试，确保契约明确：原则详情按需读取 guidance 工具。
- [x] 运行相关验证并记录 checkpoint。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支。
- 默认参数行为：完成后补充源码里的默认值、配置来源和覆盖规则。
- 边界处理结果：完成后补充异常、空值、权限、状态等处理结果。
- 验证结果：完成后记录验证命令、结果和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T11:07:49.565Z
- note: spec_context 的长工程/业务原则已改为 guidance 索引和必要执行护栏。

## 最终行为契约

1. spec_context 输出 guidance 索引
  - 条件：调用 spec_context 生成 workflow、hints 或 full context。
  - 结果：新构建中的 context 不再输出 Engineering Constraints、Business Confirmation Rules 或 Current Task Protocol 三个长规则 section；改为输出 Guidance Index，提示原则详情不在 spec_context 展开，模型忘记原则时先调用 spec_guidance_list 查看索引，再调用 spec_guidance_read 读取对应 name。索引列出 engineering、ui-ux、spec-writing 的用途和 specs/guidance/*.md 路径。
  - 默认行为：specsDir 默认仍由上游 RootSchema/specContext 使用 specs；guidance 路径随 specsDir 渲染。
  - 边界处理：full 模式仍会输出 Source Signals/Search Targets/Source Hints，但规则部分保持 guidance 索引，不因为 full 而展开长原则。当前已连接 MCP 服务未重启时仍会显示旧格式；本地 npm run build 后的 dist 输出已验证为新格式。
  - 验证：bun test/smoke.ts 断言 context 包含 Guidance Index、spec_guidance_list、spec_guidance_read、三个 guidance name 和 Required Guards，并断言不包含旧长规则 section；node --input-type=module 直接调用 dist/spec/context.js 已确认输出片段。
  - 关联文件：
    - `src/spec/context-markdown.ts`
    - `test/smoke.ts`

2. 保留必要执行护栏
  - 条件：spec_context 不再展开完整原则正文，但仍需要约束模型执行入口和高风险业务处理。
  - 结果：Required Guards 明确保留：写代码或改文档前必须读本次 spec_context；selected specs/open TODO 是唯一需求源；按 open TODO 自上而下执行；源码线索不是事实，修改前必须自行读取确认；高风险业务不确定时先问用户；阶段完成后 checkpoint，全部完成后 done。
  - 默认行为：不根据 contextMode 改变 Required Guards 内容。
  - 边界处理：contextMode=full 也不会恢复旧长规则正文。
  - 验证：bun test/smoke.ts 断言 Required Guards 中包含写操作前读取 spec_context、按 TODO 执行和 checkpoint 语句。
  - 关联文件：
    - `src/spec/context-markdown.ts`
    - `test/smoke.ts`

3. 文档说明 context 与 guidance 的关系
  - 条件：用户阅读 README.md 或 specs/README.md 了解 context 输出策略。
  - 结果：README 说明 spec_context 只输出任务流程、spec/TODO、guidance 索引和必要执行护栏；原则详情不在 context 展开，忘记原则时用 spec_guidance_list/spec_guidance_read。specs README 模板和当前 specs/README.md 也说明 context 只显示 guidance 索引和必要执行护栏。
  - 默认行为：AGENTS.md 和 spec 模板仍可保留完整规则；本次只改变 spec_context 的显示方式。
  - 边界处理：用户编辑 specs/guidance/*.md 后，context 索引仍只显示 name/用途/路径，正文由 spec_guidance_read 按需读取。
  - 验证：bun test/smoke.ts 和 npm run release:check 通过。
  - 关联文件：
    - `README.md`
    - `src/templates/agents.ts`
    - `specs/README.md`
