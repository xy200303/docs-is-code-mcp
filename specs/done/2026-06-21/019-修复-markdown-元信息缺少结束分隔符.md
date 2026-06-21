# 修复 Markdown 元信息缺少结束分隔符

## Meta

- status: done
- source: user-prompt

## 用户原始描述

修复 Markdown YAML front matter 元信息区缺少结束 `---` 的问题。要求：
- 所有生成的元信息都必须被开头 `---` 和结束 `---` 包住。
- 修复当前仓库中已经生成但缺少结束分隔符的 Markdown，尤其是 specs/guidance/*.md。
- 增加测试或检查，确保所有 Markdown front matter 成对闭合。
- 保持 VitePress docs 可构建，旧 ## Meta 解析兼容不变。
- 运行 unit/smoke/verify/docs build/diff check。

## TODO

- [x] 所有生成的元信息都必须被开头 `---` 和结束 `---` 包住。
- [x] 修复当前仓库中已经生成但缺少结束分隔符的 Markdown，尤其是 specs/guidance/*.md。
- [x] 增加测试或检查，确保所有 Markdown front matter 成对闭合。
- [x] 保持 VitePress docs 可构建，旧 ## Meta 解析兼容不变。
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

- doneAt: 2026-06-21T15:55:00.428Z
- note: Markdown searchable metadata now requires paired YAML front matter delimiters. Existing repository Markdown has been fixed; generated documents and repository files are covered by unit tests; docs build and full verify pass.

## 最终行为契约

1. 生成 Markdown 可检索元信息
  - 条件：模板生成 TODO spec、active spec 或 guidance 文档时
  - 触发入口：调用现有模板函数或 guidance 初始化流程
  - 输入与前置状态：带有 name/version/type/status/description/triggers/appliesTo 等元信息的文档模板
  - 执行过程：
    1. 模板输出 opening `---`
    2. 输出所有 YAML metadata 字段
    3. 在正文标题前输出 closing `---`
    4. 正文继续使用既有 Markdown 结构，包括旧 `## Meta` 兼容段
  - 输出结果：生成文档的 searchable YAML front matter 被成对 `---` 包住
  - 副作用：不改变旧 `## Meta` 解析兼容路径
  - 默认行为：非可检索 Markdown 或没有 name/version 的普通文档不受新增测试约束
  - 边界处理：未记录
  - 结果摘要：模板生成结果通过 unit 断言，确保正文前存在 closing `---`。
  - 验证：bun test/unit.ts; npm run verify
  - 关联文件：
    - `src/templates/metadata.ts`
    - `src/templates/guidance.ts`
    - `test/unit.ts`

2. 仓库现有 Markdown 元信息闭合检查
  - 条件：仓库内 Markdown 以 `---` 开头且包含 `name:` 与 `version:` 字段
  - 触发入口：运行新增 unit test 或手动 closure scan
  - 输入与前置状态：仓库 Markdown 文件，排除 node_modules、dist、docs/.vitepress/dist、.tmp
  - 执行过程：
    1. 递归读取 Markdown 文件
    2. 识别可检索 YAML metadata 文件
    3. 在第一个 Markdown H1 或前 120 行内查找第二个 `---`
    4. 若缺失则报告相对路径并失败
  - 输出结果：所有可检索 Markdown 都有 opening 和 closing delimiter
  - 副作用：测试只读扫描，不写文件
  - 默认行为：普通 Markdown 不要求 front matter
  - 边界处理：未记录
  - 结果摘要：当前仓库扫描结果为 `all metadata front matter closed`。
  - 验证：closure scan passed; npm run verify passed
  - 关联文件：
    - `test/unit.ts`
    - `specs/guidance/engineering.md`
    - `docs-spec-create/SKILL.md`

3. SKILL.md 元信息可检索且不重复
  - 条件：docs-spec-* skill 文件包含原始 skill metadata 与新增通用 metadata
  - 触发入口：人工清理 SKILL.md front matter
  - 输入与前置状态：docs-spec-create/edit/extract/implement 的 SKILL.md
  - 执行过程：
    1. 保留单个 opening `---` 与 closing `---`
    2. 将 name 设置为具体 skill 名称
    3. 将 type/category/triggers/appliesTo 调整为 skill/docs-is-code 语义
    4. 移除重复 name/description 字段
  - 输出结果：每个 SKILL.md 只有一段闭合 front matter，且无重复 name/description key
  - 副作用：正文内容保持不变
  - 默认行为：继续兼容 Codex skill metadata 读取
  - 边界处理：未记录
  - 结果摘要：每个 docs-spec SKILL.md 都保留单段闭合 YAML metadata。
  - 验证：rg metadata spot-check; front matter closure scan passed
  - 关联文件：
    - `docs-spec-create/SKILL.md`
    - `docs-spec-edit/SKILL.md`
    - `docs-spec-extract/SKILL.md`
    - `docs-spec-implement/SKILL.md`
