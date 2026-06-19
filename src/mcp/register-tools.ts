/* MCP tool registration entrypoint for the spec-coding server. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerReadTools } from "./register-read-tools.js";
import { registerWriteTools } from "./register-write-tools.js";
import { createSessionGuard } from "./session-guard.js";

export function registerSpecCodingTools(server: McpServer): void {
  const guard = createSessionGuard();
  registerReadTools(server, guard);
  registerWriteTools(server, guard);
}
