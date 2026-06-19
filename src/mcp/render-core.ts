/* Core presentation helpers for MCP tool responses. */
import type { GeneratedFile } from "../spec/types.js";

export function code(value: string | undefined): string {
  return value ? `\`${value}\`` : "`无`";
}

export function fileStatus(file: GeneratedFile): string {
  const label = file.status === "created" ? "创建" : file.status === "updated" ? "更新" : "跳过";
  return `- ${label} ${code(file.path)}${file.reason ? `（${file.reason}）` : ""}`;
}

export function textResult(markdown: string) {
  return {
    content: [
      {
        type: "text" as const,
        text: `${markdown.trimEnd()}\n`
      }
    ]
  };
}
