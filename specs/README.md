# docs_is_code Specs

本目录用于 spec coding：先写清楚规格，再让 AI 按规格修改代码和测试。

## 工作流

1. 没有 spec 的旧系统，先用 MCP 从源码反推 `review/` specs。
2. 用户审查 `review/*.md`，把源码事实改成真实业务规格。
3. 要开发时，把 spec 放到 `active/`，或直接让 MCP 读取指定 spec。
4. Codex 按 spec 修改代码和测试。
5. 验证通过后，把 spec 移到 `done/`。

## 状态

- `source-derived/current-code`：从现有源码反推，表示当前代码大概率已有对应实现，待用户审查。
- `draft`：用户正在描述需求，尚未实现。
- `active`：准备实现或正在实现。
- `todo`：轻量任务清单，AI 应按未勾选项顺序执行。
- `done`：代码和测试已按该 spec 完成。

## 目录

- `review/`：从源码反推的待审查 specs。
- `active/YYYY-MM-DD/NNN-readable-name.md`：当前要实现的 specs，按日期和当天顺序归档。
- `todo/YYYY-MM-DD/NNN-readable-name.md`：可执行 TODO 清单，适合拆分小任务或补充实现步骤。
- `done/YYYY-MM-DD/NNN-readable-name.md`：已经完成的 specs，必须保留来自代码和测试验证的最终行为契约。
- `templates/`：新建 feature、bugfix、removal spec 的模板。

## 命名要求

- 文件名使用当天递增序号和可读业务名，避免 `todo-9.md` 这类无法审查的名称。
- `done/` 只记录实际代码行为、测试结果或用户确认事实；禁止把猜测写成最终行为。
