/* MCP server entrypoint that assembles tool registration and transport. */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerSpecCodingTools } from "./mcp/register-tools.js";
import { APP_NAME, APP_VERSION } from "./shared/meta.js";

export function createSpecCodingServer(): McpServer {
  const server = new McpServer({
    name: APP_NAME,
    version: APP_VERSION
  });
  registerSpecCodingTools(server);
  return server;
}

export async function serveStdio(): Promise<void> {
  const server = createSpecCodingServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
