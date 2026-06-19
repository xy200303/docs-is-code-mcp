# Spec Coding MCP

这是一个面向 **spec coding** 的本地 MCP 服务。

核心思路很简单：先写或审查一份小规格，再让 AI 按规格修改代码和测试。它不再尝试把整个系统永久文档化，也不维护复杂的 CRDT 状态。

## 目标

- 从没有 spec 的旧项目中反推 `specs/` 目录，方便用户审查当前系统。
- 用户开发前先修改或新增 spec。
- 用户可以用 TODO 清单拆分任务，模型按未勾选项顺序执行。
- 工具会把全局工程质量约束注入模型上下文，强制约束代码风格、项目结构和 UI 直觉性。
- 工具强制遵守 KISS、DRY、Clean Code、Clean Architecture、DDD、Fail Fast、SOLID 和 Boy Scout Rule。
- 工具还会防止混层、过度抽象和不必要的复杂度，把代码组织成适合大型项目的结构。
- Codex 读取 active spec，按最新规格实现代码和测试。
- 验证通过后把 spec 归档到 `done/`。

## 目录结构

```text
specs/
  README.md
  review/
    source-inventory.md
    index.md
    *.md
  active/
    *.md
  todo/
    *.md
  done/
    *.md
  templates/
    feature.md
    bugfix.md
    removal.md
```

- `review/`：从源码反推的当前代码事实，状态通常是 `source-derived/current-code`，用于用户审查。
- `active/`：准备实现或正在实现的 spec。
- `todo/`：轻量可执行 TODO 清单，适合临时任务、拆分步骤或补充实现顺序。
- `done/`：已实现并验证通过的 spec。
- `templates/`：新建 spec 的模板。

## MCP 工具

| 工具 | 作用 |
|---|---|
| `spec_generate_agents` | 在项目根目录生成或更新 `AGENTS.md` |
| `spec_init` | 初始化 `specs/` 目录和模板 |
| `spec_generate_from_source` | 从现有源码反推 review specs |
| `spec_create` | 根据用户描述创建 active spec |
| `spec_todo` | 根据用户描述创建可执行 TODO 清单 |
| `spec_list` | 列出 review、active、todo、done specs |
| `spec_context` | 返回给 Codex 实现代码所需的 spec 和 TODO 上下文 |
| `spec_checkpoint` | 实现后记录完成 TODO、变更文件、验证结果、风险和阻塞 |
| `spec_review_result` | 结构化记录完成、阻塞、验证命令和关联文件 |
| `spec_done` | 验证通过后把 spec 移到 done |

## 推荐工作流

### 先生成项目手册

1. 调用 `spec_generate_agents`。
2. 检查项目根目录的 `AGENTS.md`。
3. 按 `AGENTS.md`、`specs/` 和 TODO 开始开发。

### 旧系统第一次接入

1. 调用 `spec_generate_from_source`。
2. 用户阅读 `specs/review/source-inventory.md` 和 `specs/review/*.md`。
3. 用户把源码反推内容改成真实业务规格。
4. 需要开发时，将目标 spec 放到 `specs/active/`，或让 `spec_context` 读取指定文件。
5. Codex 按 spec 修改代码和测试。
6. 验证通过后调用 `spec_done`。

### 新需求开发

1. 调用 `spec_create`，根据用户描述生成 active spec。
2. 用户审阅并修改 `specs/active/*.md`。
3. 如需拆任务，可调用 `spec_todo` 或在 spec 里写 `## TODO`。
4. 调用 `spec_context`。
5. Codex 按 spec 和未勾选 TODO 顺序实现代码和测试。
6. 阶段性完成后调用 `spec_checkpoint` 记录完成情况。
7. 验证通过后调用 `spec_done`。

### TODO 驱动任务

TODO 可以放在 `specs/todo/*.md`，也可以写在 active spec 的 `## TODO` 中：

```md
## TODO

- [ ] 定位用户详情接口和测试。
- [ ] 增加禁用态字段。
- [ ] 更新验证命令并记录结果。
```

`spec_context` 会提取所有未勾选 TODO，要求模型按顺序执行；完成后应把对应任务改成 `[x]`，无法完成时保留未勾选并说明阻塞原因。

### Checkpoint 闭环

`spec_checkpoint` 用于把实现后的事实写回 spec 或 TODO 文件：

- 完成摘要
- 已完成并自动勾选的 TODO
- 本次变更文件
- 验证命令和结果
- 已知风险
- 阻塞项

它适合复杂项目里的阶段性开发，让下一轮 AI 或人类能直接看到已经完成什么、验证过什么、还剩什么。

`spec_review_result` 则更偏“阶段结果汇报”，会记录完成和未完成 TODO、验证结果、变更文件、风险和阻塞，适合复杂项目交接。

### 全局工程质量约束

每次 `spec_context` 都会强制附带这些约束：

- 代码清晰、必要、可维护，避免冗余封装、废话注释和重复逻辑。
- 遵循现有项目风格和目录约定，不随意引入新架构、依赖或抽象层。
- 职责边界清楚，不把所有代码放在一个文件，也不把所有文件堆在一个目录。
- 模块、函数、组件要便于人类和 AI 阅读，复杂逻辑拆成有名字的步骤。
- UI 设计符合人类直觉，交互状态完整，文案简洁，信息层级清楚。
- 修改范围贴合 spec/TODO，不扩散到无关重构。
- 优先复用项目已有测试、构建和校验命令。
- 强制遵守 KISS、DRY、Clean Code、Clean Architecture、DDD、Fail Fast、SOLID 和 Boy Scout Rule。
- 避免混合 UI、业务和数据访问逻辑，避免为了模式而模式。
- 文件顶部必须写文件注释，复杂逻辑必须写说明性注释，但不能写废话。
- 能用成熟库解决的就优先用成熟库，不要自己手搓已有轮子。
- 遇到不明确、影响面大或高风险的方案时，先向用户询问和确认，不要自己拍板。

## 安装

```bash
npm install -g @dev_xiaoyun/spec-coding-mcp
specc init
```

`specc init` 会扫描本机的 Codex、Claude Code、OpenCode，并让你选择注册 MCP。

手动配置 Codex 时推荐使用 Node 直连入口：

```toml
[mcp_servers.spec-coding]
command = "C:\\nvm4w\\nodejs\\node.exe"
args = ["C:\\nvm4w\\nodejs\\node_modules\\@dev_xiaoyun\\spec-coding-mcp\\dist\\index.js"]
```

路径需要按你的 Node 全局安装目录调整。

## 本地开发

```bash
npm install
npm test
```

启动 MCP server：

```bash
specc
```

或：

```bash
node dist/index.js
```

## 设计边界

Spec Coding MCP 不做这些事：

- 不试图把整个系统永久文档化。
- 不追踪每个功能点和代码位置的强一致状态。
- 不使用用户手写 ID 或 change log。
- 不把半成品开发状态伪装成已完成。

它只做一件事：让每次开发都有一份清楚、可审查、可实现、可归档的 spec。
