# 快速开始

Spec Coding MCP 是一个本地 MCP server。安装后可以注册到 Codex、Claude Code、OpenCode，让 AI 编程工具通过 MCP 读取和生成 specs。

## 安装

```bash
npm install -g @dev_xiaoyun/spec-coding-mcp
specc init
```

`specc init` 会扫描本机已安装的 AI 编程工具，并用交互式选择把 MCP server 注册进去。

## 手动配置 Codex

如果需要手动配置，可以使用 Node 直连入口：

```toml
[mcp_servers.spec-coding]
command = "C:\\nvm4w\\nodejs\\node.exe"
args = ["C:\\nvm4w\\nodejs\\node_modules\\@dev_xiaoyun\\spec-coding-mcp\\dist\\index.js"]
```

路径需要按本机 Node 全局安装目录调整。

## 初始化项目 specs

在目标项目里调用 MCP 工具：

```text
spec_init
```

它会创建：

```text
specs/
  README.md
  review/
  active/
  done/
  templates/
```

## 旧项目接入

旧项目第一次接入时，先让 MCP 从源码反推规格：

```text
spec_generate_from_source
```

然后阅读 `specs/review/source-inventory.md` 和 `specs/review/*.md`，把源码事实修正成真实业务规格。

## 新需求开发

新需求可以先创建 active spec：

```text
spec_create
```

用户审阅并修改 `specs/active/*.md` 后，让 AI 调用：

```text
spec_context
```

AI 读取上下文后实现代码和测试。验证通过后调用：

```text
spec_done
```
