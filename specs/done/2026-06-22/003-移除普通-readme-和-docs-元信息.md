# 移除普通 README 和 docs 元信息

## Meta

- status: done
- source: user-prompt

## 用户原始描述

根据用户反馈，修正 Markdown 元信息范围：

- 不是所有 Markdown 都需要加 SKILL/spec 风格 YAML 元信息。
- 移除普通 `README.md` 和 VitePress `docs/**/*.md` 中被批量加入的通用检索元信息，避免搞乱 README 和 docs 阅读/渲染语义。
- VitePress 首页 `docs/index.md` 如果需要 front matter，只保留原本的 `layout`、`hero`、`features` 等 VitePress 字段，不保留 `name/version/type/status/source/description/category/triggers/appliesTo/updated`。
- 普通 docs 页面如果没有 VitePress 特殊 front matter，则不保留 YAML front matter。
- 保留真正需要工具读取的 spec/guidance/SKILL 类文件元信息。
- 更新 README/docs/test 中关于“所有 Markdown 都有元信息”的描述和断言，改成只对 spec/guidance/skill 等工具文档适用。
- 运行 unit/smoke/verify/docs build/diff check。

## TODO

- [x] 不是所有 Markdown 都需要加 SKILL/spec 风格 YAML 元信息。
- [x] 移除普通 `README.md` 和 VitePress `docs/**/*.md` 中被批量加入的通用检索元信息，避免搞乱 README 和 docs 阅读/渲染语义。
- [x] VitePress 首页 `docs/index.md` 如果需要 front matter，只保留原本的 `layout`、`hero`、`features` 等 VitePress 字段，不保留 `name/version/type/status/source/description/category/triggers/appliesTo/updated`。
- [x] 普通 docs 页面如果没有 VitePress 特殊 front matter，则不保留 YAML front matter。
- [x] 保留真正需要工具读取的 spec/guidance/SKILL 类文件元信息。
- [x] 更新 README/docs/test 中关于“所有 Markdown 都有元信息”的描述和断言，改成只对 spec/guidance/skill 等工具文档适用。
- [x] 运行 unit/smoke/verify/docs build/diff check。

## 实际行为记录

- 记录来源：只能记录已阅读代码、已修改代码、测试结果或用户确认的事实。
- 功能全过程：按功能点记录触发入口、输入与前置状态、执行步骤、输出结果和副作用。
- 分支条件：完成后补充实际存在的正常、失败、边界、权限和状态分支，不只写一句结果。
- 默认参数行为：完成后补充源码里的默认值、配置来源、覆盖规则以及未传参数时的完整流程。
- 边界处理结果：完成后补充异常、空值、权限、状态等输入如何进入分支、在哪里返回、是否产生副作用。
- 验证结果：完成后记录验证命令、覆盖的流程分支和关联文件。
- 禁止事项：不要把猜测、常识或“看起来合理”的行为写成事实。

## Done

- doneAt: 2026-06-21T16:22:31.085Z
- note: Plain README and VitePress docs no longer carry generic SKILL/spec-style metadata. Tool-readable metadata remains limited to agent/spec/guidance/SKILL documents.

## 最终行为契约

1. 普通 README/docs 不再带工具元信息
  - 条件：打开根 README 或 VitePress docs 页面
  - 触发入口：读取 `README.md` 或 `docs/**/*.md`
  - 输入与前置状态：已被批量加入 SKILL/spec 风格 YAML 的普通文档
  - 执行过程：
    1. 移除 `README.md` 顶部通用 YAML
    2. 移除普通 docs 页面顶部通用 YAML
    3. 保留正文和现有文档内容
    4. 新增测试确认这些普通文档不会以 `---\nname:` 开头，也不会出现 `source: 'vitepress-docs'` 或 `type: 'documentation'`
  - 输出结果：README 和普通 docs 恢复为普通 Markdown 文档，不再混入工具检索元信息
  - 副作用：不影响 spec/guidance/SKILL 文件元信息
  - 默认行为：普通文档默认无 SKILL/spec 风格 front matter
  - 边界处理：若未来某个 VitePress 页面需要自己的 front matter，应只保留 VitePress 原生字段
  - 结果摘要：README 和 docs 普通页面已清理。
  - 验证：plain README/docs metadata clean script; bun test/unit.ts
  - 关联文件：
    - `README.md`
    - `docs/guide/getting-started.md`
    - `docs/guide/mcp-tools.md`
    - `docs/guide/workflow.md`
    - `docs/reference/deploy-site.md`
    - `docs/reference/spec-structure.md`
    - `test/unit.ts`

2. VitePress 首页只保留原生 front matter
  - 条件：打开 `docs/index.md`
  - 触发入口：VitePress build 或用户阅读 docs 首页源码
  - 输入与前置状态：首页原本需要 `layout: home`、`hero`、`features` 等 VitePress front matter
  - 执行过程：
    1. 从首页 front matter 删除 `name/version/type/status/source/description/category/triggers/appliesTo/updated`
    2. 保留 `layout: home`、`hero`、`features` 和正文内容
    3. 测试确认首页仍以 VitePress home front matter 开头，并不包含通用 searchable metadata
  - 输出结果：docs 首页保持 VitePress 正常渲染语义，不带工具检索元信息
  - 副作用：VitePress build 继续通过
  - 默认行为：VitePress 页面只保留自身渲染需要的 front matter
  - 边界处理：未记录
  - 结果摘要：`docs/index.md` 已只保留 VitePress 原生 front matter。
  - 验证：npm run docs:build; bun test/unit.ts
  - 关联文件：
    - `docs/index.md`
    - `test/unit.ts`

3. 工具文档元信息范围收窄
  - 条件：阅读 README/docs/spec-structure 或生成 specs README
  - 触发入口：用户查看文档或运行 init/bootstrap 生成 specs README
  - 输入与前置状态：旧文案声称仓库内 Markdown 默认都有同类 YAML 元信息
  - 执行过程：
    1. README 和 docs 说明改为：YAML 元信息只用于 AGENTS/CLAUDE、specs README、guidance、review/active/todo/done specs 等工具文档
    2. 普通 README 和 VitePress docs 页面明确不默认加入 SKILL/spec 风格元信息
    3. `src/templates/agents.ts` 中 specs README 生成文案同步更新
  - 输出结果：文档说明与实际行为一致，不再引导工具给所有 Markdown 加元信息
  - 副作用：保留 guidance/spec/SKILL 元信息供工具读取
  - 默认行为：闭合扫描只约束已经带 `name/version` 的 searchable metadata，不要求普通 Markdown 添加 metadata
  - 边界处理：未记录
  - 结果摘要：说明和测试已更新。
  - 验证：npm run verify; searchable metadata front matter closure scan
  - 关联文件：
    - `README.md`
    - `docs/guide/mcp-tools.md`
    - `docs/reference/spec-structure.md`
    - `src/templates/agents.ts`
