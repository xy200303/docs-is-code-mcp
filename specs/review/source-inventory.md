# 源码审查线索清单

生成时间：2026-06-21T10:41:29.818Z

扫描源码和配置文件 56 个。以下只是静态启发式线索，用于帮助 AI 选择阅读入口，不代表业务事实或最终 spec。

## Manifest

- `.tmp/bunx-449650498-vitepress@1.6.4/package.json`
- `package-lock.json`
- `package.json`

## API 文件

- `src/server.ts`

## UI 文件

- 未识别到明显线索

## 数据文件

- `src/mcp/tool-schema.ts`
- `src/mcp/write-schemas.ts`

## 测试文件

- `src/spec/behavior-record.ts`
- `src/spec/checkpoint-writer.ts`
- `src/spec/context-markdown.ts`
- `src/spec/context-source.ts`
- `src/spec/context.ts`
- `src/spec/done-writer.ts`
- `src/spec/file-writers.ts`
- `src/spec/review-result-writer.ts`
- `src/spec/scaffold.ts`
- `src/spec/source-scan.ts`
- `src/spec/spec-files.ts`
- `src/spec/spec-reader.ts`
- `src/spec/todo-files.ts`
- `src/spec/types.ts`
- `src/spec/workflow-next-step.ts`
- `test/smoke.ts`
- `test/unit.ts`

## 路由线索

- 未识别到明显线索

## 组件线索

- `docs-spec-implement/scripts/detect_doc_changes.py DocObject`

## 模型线索

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
- `src/cli/status-recommendation.ts WorkflowRecommendation`
- `src/cli/status-recommendation.ts WorkflowState`
- `src/cli/status-recommendation.ts RecommendationArguments`
- `src/cli/status-recommendation.ts StatusRecommendation`
- `src/cli/status-recommendation.ts StatusDecision`
- `src/cli/status-recommendation.ts StatusRecommendationInput`
- `src/shared/utils.ts ListTextFilesOptions`
- `src/templates/prompt-documents.ts PromptTodoTask`
