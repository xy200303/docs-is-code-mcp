---
name: '015-降低-ai-味-ui-ux-原则'
version: '1.1.0'
title: '降低 AI 味 UI UX 原则'
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

# 降低 AI 味 UI UX 原则

## Meta

- status: done
- source: user-prompt

## 用户原始描述

优化 UI/UX guidance 和相关模板，补入高优先级“降低 AI 味”原则。

- 增加“降低 AI 味”设计原则：生成 UI 应避免模板化、泛科技、泛 SaaS、泛营销页的视觉套路。
- 禁止默认使用 AI 常见套路：大渐变标题、抽象光效、粒子背景、悬浮卡片堆叠、虚构仪表盘、空泛 badge、无来源指标。
- UI 设计前应先提取项目自身的视觉语言，而不是套用通用高级感模板。
- 要求每个视觉元素都有语义：图形、动效、图标、背景、卡片必须服务项目内容或用户任务。
- 官网类 UI 应优先展示真实内容：仓库、代码片段、项目状态、文档入口、贡献路径、实际截图、真实 demo。
- 文案应减少 AI 式空泛表达，例如“赋能”“下一代”“智能底座”“无缝连接”“重塑体验”“高性能平台”等。
- 增加“AI 味自检” checklist：页面换个品牌名是否还能成立、是否存在无意义科技装饰、是否有编造指标或假 dashboard、是否使用过多抽象名词、是否缺少真实项目内容、是否像模板站而不是项目自己的网站。
- 设计验收中加入“品牌不可替换性”标准：页面应让人看出这是当前项目/品牌，而不是任意 AI 公司/开源组织。
- 要求生成 UI 时至少引入一个项目特定的结构或交互，而不是只换色、换文案、换 logo。
- 对开源组织官网，优先使用开发者熟悉的真实界面语言：repo 列表、commit/activity、issue 标签、release 状态、README 摘要、terminal/code preview。
- 限制“装饰性卡片密度”：不要为了显得丰富而堆大量没有真实信息的卡片。
- 增加“删除测试”：如果删除某个视觉模块后页面信息没有损失，说明它可能只是 AI 装饰，应重做或删除。
- UI 生成后要求进行一次“去模板化 pass”：替换通用文案、删除假数据、补充真实对象、减少套路装饰。
- 默认不要使用过度圆角、玻璃拟态、霓虹渐变、漂浮面板，除非项目语境明确需要。
- 对“高级科技感”的解释应改为：信息可信、结构清晰、细节克制、交互真实、内容具体，而不是炫光和抽象背景。

## TODO

- [x] 增加“降低 AI 味”设计原则：生成 UI 应避免模板化、泛科技、泛 SaaS、泛营销页的视觉套路。
- [x] 禁止默认使用 AI 常见套路：大渐变标题、抽象光效、粒子背景、悬浮卡片堆叠、虚构仪表盘、空泛 badge、无来源指标。
- [x] UI 设计前应先提取项目自身的视觉语言，而不是套用通用高级感模板。
- [x] 要求每个视觉元素都有语义：图形、动效、图标、背景、卡片必须服务项目内容或用户任务。
- [x] 官网类 UI 应优先展示真实内容：仓库、代码片段、项目状态、文档入口、贡献路径、实际截图、真实 demo。
- [x] 文案应减少 AI 式空泛表达，例如“赋能”“下一代”“智能底座”“无缝连接”“重塑体验”“高性能平台”等。
- [x] 增加“AI 味自检” checklist：页面换个品牌名是否还能成立、是否存在无意义科技装饰、是否有编造指标或假 dashboard、是否使用过多抽象名词、是否缺少真实项目内容、是否像模板站而不是项目自己的网站。
- [x] 设计验收中加入“品牌不可替换性”标准：页面应让人看出这是当前项目/品牌，而不是任意 AI 公司/开源组织。
- [x] 要求生成 UI 时至少引入一个项目特定的结构或交互，而不是只换色、换文案、换 logo。
- [x] 对开源组织官网，优先使用开发者熟悉的真实界面语言：repo 列表、commit/activity、issue 标签、release 状态、README 摘要、terminal/code preview。
- [x] 限制“装饰性卡片密度”：不要为了显得丰富而堆大量没有真实信息的卡片。
- [x] 增加“删除测试”：如果删除某个视觉模块后页面信息没有损失，说明它可能只是 AI 装饰，应重做或删除。
- [x] UI 生成后要求进行一次“去模板化 pass”：替换通用文案、删除假数据、补充真实对象、减少套路装饰。
- [x] 默认不要使用过度圆角、玻璃拟态、霓虹渐变、漂浮面板，除非项目语境明确需要。
- [x] 对“高级科技感”的解释应改为：信息可信、结构清晰、细节克制、交互真实、内容具体，而不是炫光和抽象背景。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T14:57:27.588Z
- note: 已补入降低 AI 味 UI/UX 高优先级原则，并通过完整验证。

## 最终行为契约

1. UI/UX guidance 增加降低 AI 味高优先级原则
  - 条件：模型读取 ui-ux guidance 准备生成页面、官网、组件或交互 UI
  - 触发入口：spec_guidance_read 读取 name=ui-ux，或项目初始化/引导生成默认 specs/guidance/ui-ux.md 后由模型打开阅读
  - 输入与前置状态：projectRoot、specsDir、name=ui-ux；项目未覆盖时由 src/templates/guidance.ts 的默认模板生成
  - 执行过程：
    1. 在视觉系统中要求先提取项目自身视觉语言，而不是套用通用高级感模板
    2. 禁止默认使用过度圆角、玻璃拟态、霓虹渐变、漂浮面板、粒子背景、抽象光效和大渐变标题
    3. 新增降低 AI 味章节，列出泛科技/泛 SaaS/泛营销页套路、AI 常见视觉套路、视觉语义、空泛文案、品牌不可替换性、项目特定结构或交互、删除测试和去模板化 pass
    4. 把高级科技感定义为信息可信、结构清晰、细节克制、交互真实、内容具体
    5. 官网和 OSS 规则继续强调真实内容和开发者熟悉界面语言
  - 输出结果：模型读取 ui-ux guidance 后会优先基于项目内容和任务设计，减少模板站和 AI 味视觉套路。
  - 副作用：更新内置 guidance 模板和当前项目 specs/guidance/ui-ux.md；已有其他项目自定义 guidance 不会被覆盖
  - 默认行为：除非项目语境明确需要，否则不默认使用大渐变、玻璃拟态、霓虹、漂浮面板、粒子或抽象光效
  - 边界处理：如果某个视觉模块删除后不损失信息，guidance 要求重做或删除；如果页面换品牌名仍成立，应补充项目特定结构或交互
  - 结果摘要：ui-ux guidance 会要求避免模板化、泛科技、泛 SaaS、泛营销页套路，并做 AI 味自检、品牌不可替换性检查和去模板化 pass。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/ui-ux.md`
    - `test/unit.ts`
    - `test/smoke.ts`

2. active spec 模板加入去模板化 UI 检查
  - 条件：通过 spec_create 或 spec_bootstrap 生成 active spec
  - 触发入口：createSpecFromPrompt 调用 userPromptSpec，或 specTemplate 生成用户可编辑模板
  - 输入与前置状态：title、prompt、projectRoot、specsDir；prompt 可为 UI、官网、组件、交互或普通功能任务
  - 执行过程：
    1. 在 UI/交互质量检查中加入降低 AI 味检查
    2. 要求视觉元素服务项目内容或用户任务，不堆无真实信息卡片
    3. 要求页面具有品牌不可替换性
    4. 要求至少引入一个项目特定结构或交互
    5. 要求执行删除测试和去模板化 pass
    6. OSS prompt 额外加入 repo 列表、commit/activity、issue 标签、release 状态、README 摘要、terminal/code preview
  - 输出结果：生成的 active spec 会把降低 AI 味作为实现和验收清单的一部分。
  - 副作用：新生成的 active spec 文档更具体；已归档 done spec 不会被模板改动自动重写
  - 默认行为：非 UI 任务保留该章节作为条件性检查；UI 受影响时必须按项目语境执行
  - 边界处理：普通官网仍只提示项目类型决定结构；OSS/open source 关键词明确时才追加开发者真实界面语言
  - 结果摘要：新 active spec 的 UI/交互质量检查会要求降低 AI 味、视觉语义、品牌不可替换性、项目特定结构或交互、删除测试和去模板化 pass。
  - 验证：bun test/unit.ts 覆盖 active spec 和 OSS 分支；bun test/smoke.ts 覆盖 bootstrap/spec_create 输出
  - 关联文件：
    - `src/templates/prompt-documents.ts`
    - `src/templates/spec-documents.ts`
    - `test/unit.ts`
    - `test/smoke.ts`

3. quality-review 增加 AI 味自检
  - 条件：模型完成 UI/网页实现后读取 quality-review 或准备 checkpoint/done
  - 触发入口：spec_guidance_read 读取 name=quality-review，或模型在实现后按 Guidance Recommendations 自查
  - 输入与前置状态：projectRoot、specsDir、name=quality-review；当前实现包含 UI/交互/网页风险时适用
  - 执行过程：
    1. 在 UI 与交互质量章节加入 AI 味自检
    2. 检查是否完成去模板化 pass
    3. 检查是否至少引入项目特定结构或交互
    4. 检查每个视觉元素是否有语义
    5. 要求删除无信息损失的装饰模块或重做
  - 输出结果：quality-review 可在交付前发现模板化、假数据、泛科技装饰和品牌不可替换性不足。
  - 副作用：更新内置 quality-review 模板和当前项目 specs/guidance/quality-review.md
  - 默认行为：无 UI 改动时可记录无影响；有 UI 改动时应结合截图/手工检查执行
  - 边界处理：未做去模板化 pass 或截图验收时，最终报告必须说明未运行原因，不能编造验收结果
  - 结果摘要：quality-review 会检查 AI 味、自检去模板化、项目特定结构或交互、视觉语义和删除测试。
  - 验证：bun test/unit.ts、bun test/smoke.ts、npm run verify
  - 关联文件：
    - `src/templates/guidance.ts`
    - `specs/guidance/quality-review.md`
    - `test/unit.ts`
    - `test/smoke.ts`
