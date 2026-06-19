/* Registry file update helpers for supported AI coding tools. */
import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { ensureDir, pathExists } from "../shared/utils.js";
import { MCP_DIST_ENTRY, MCP_SERVER_NAME, MCP_START_COMMAND } from "./compatibility-contract.js";
import { codexConfigPath, continueConfigPath, cursorConfigPath, opencodeConfigPath, windsurfConfigPath } from "./registry-paths.js";
import type { RegisterResult, RegistryPaths, ServerCommand } from "./registry-types.js";

const execFileAsync = promisify(execFile);

function renderTomlString(value: string): string {
  return JSON.stringify(value);
}

function upsertCodexConfig(content: string, server: ServerCommand): string {
  const normalized = content.replace(/\r\n/g, "\n").trimEnd();
  const block = [
    `[mcp_servers.${MCP_SERVER_NAME}]`,
    `command = ${renderTomlString(server.command)}`,
    `args = [${server.args.map(renderTomlString).join(", ")}]`
  ].join("\n");
  const lines = normalized ? normalized.split("\n") : [];
  const header = `[mcp_servers.${MCP_SERVER_NAME}]`;
  const start = lines.findIndex((line) => line.trim() === header);
  if (start !== -1) {
    let end = lines.length;
    for (let index = start + 1; index < lines.length; index += 1) {
      if (/^\s*\[[^\]]+\]\s*$/.test(lines[index])) {
        end = index;
        break;
      }
    }
    const next = [
      ...lines.slice(0, start),
      ...block.split("\n"),
      ...lines.slice(end)
    ].join("\n");
    return `${next.trimEnd()}\n`;
  }
  return `${normalized ? `${normalized}\n\n` : ""}${block}\n`;
}

function upsertOpenCodeConfig(content: string, server: ServerCommand): string {
  const parsed = content.trim() ? JSON.parse(content) : {};
  const root = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? { ...(parsed as Record<string, unknown>) } : {};
  const mcp = root.mcp && typeof root.mcp === "object" && !Array.isArray(root.mcp) ? { ...(root.mcp as Record<string, unknown>) } : {};
  mcp[MCP_SERVER_NAME] = {
    type: "local",
    command: [server.command, ...server.args]
  };
  root.$schema = typeof root.$schema === "string" ? root.$schema : "https://opencode.ai/config.json";
  root.mcp = mcp;
  return JSON.stringify(root, null, 2) + "\n";
}

function upsertJsonMcpServers(content: string, server: ServerCommand): string {
  const parsed = content.trim() ? JSON.parse(content) : {};
  const root = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? { ...(parsed as Record<string, unknown>) } : {};
  const mcpServers = root.mcpServers && typeof root.mcpServers === "object" && !Array.isArray(root.mcpServers)
    ? { ...(root.mcpServers as Record<string, unknown>) }
    : {};
  mcpServers[MCP_SERVER_NAME] = {
    command: server.command,
    args: server.args
  };
  root.mcpServers = mcpServers;
  return JSON.stringify(root, null, 2) + "\n";
}

function yamlString(value: string): string {
  if (!value.trim()) return '""';
  if (/^[A-Za-z0-9_./:-]+$/.test(value)) return value;
  return JSON.stringify(value);
}

function renderContinueServer(server: ServerCommand): string {
  return [
    `  - name: ${MCP_SERVER_NAME}`,
    `    command: ${yamlString(server.command)}`,
    "    args:",
    ...server.args.map((arg) => `      - ${yamlString(arg)}`)
  ].join("\n");
}

function renderContinueConfig(server: ServerCommand): string {
  return [
    `name: ${MCP_SERVER_NAME}`,
    "version: 0.0.1",
    "schema: v1",
    "mcpServers:",
    renderContinueServer(server)
  ].join("\n");
}

function upsertContinueConfig(content: string, server: ServerCommand): string {
  const normalized = content.replace(/\r\n/g, "\n").trimEnd();
  if (!normalized) return `${renderContinueConfig(server)}\n`;
  if (!/^\s*mcpServers:\s*$/m.test(normalized)) {
    return `${normalized}\n\nmcpServers:\n${renderContinueServer(server)}\n`;
  }
  const lines = normalized.split("\n");
  const sectionIndex = lines.findIndex((line) => line.trim() === "mcpServers:");
  if (sectionIndex === -1) return `${normalized}\n\n${renderContinueServer(server)}\n`;
  let end = lines.length;
  for (let index = sectionIndex + 1; index < lines.length; index += 1) {
    if (/^[^\s-]/.test(lines[index]) && lines[index].trim()) {
      end = index;
      break;
    }
  }
  const block = renderContinueServer(server).split("\n");
  const next = [...lines.slice(0, end), ...block, ...lines.slice(end)].join("\n");
  return `${next.trimEnd()}\n`;
}

function packageRootFromCurrentModule(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
}

async function defaultServerCommand(): Promise<ServerCommand> {
  const packageRoot = packageRootFromCurrentModule();
  const entry = path.join(packageRoot, MCP_DIST_ENTRY);
  if (await pathExists(entry)) {
    return { command: process.execPath, args: [entry, MCP_START_COMMAND] };
  }
  return { command: "specc", args: [MCP_START_COMMAND] };
}

async function serverCommand(input?: ServerCommand): Promise<ServerCommand> {
  const fallback = await defaultServerCommand();
  return {
    command: input?.command ?? fallback.command,
    args: input?.args ?? fallback.args
  };
}

export async function registerCodex(paths: RegistryPaths | undefined, serverInput: ServerCommand | undefined, dryRun?: boolean): Promise<RegisterResult> {
  const server = await serverCommand(serverInput);
  const configPath = codexConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertCodexConfig(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "codex", status: "registered", path: configPath, detail: `registered ${MCP_SERVER_NAME} in Codex config` };
}

export async function registerOpenCode(paths: RegistryPaths | undefined, serverInput: ServerCommand | undefined, dryRun?: boolean): Promise<RegisterResult> {
  const server = await serverCommand(serverInput);
  const configPath = opencodeConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertOpenCodeConfig(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "opencode", status: "registered", path: configPath, detail: `registered ${MCP_SERVER_NAME} in OpenCode config` };
}

export async function registerCursor(paths: RegistryPaths | undefined, serverInput: ServerCommand | undefined, dryRun?: boolean): Promise<RegisterResult> {
  const server = await serverCommand(serverInput);
  const configPath = cursorConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertJsonMcpServers(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "cursor", status: "registered", path: configPath, detail: `registered ${MCP_SERVER_NAME} in Cursor config` };
}

export async function registerContinue(paths: RegistryPaths | undefined, serverInput: ServerCommand | undefined, dryRun?: boolean): Promise<RegisterResult> {
  const server = await serverCommand(serverInput);
  const configPath = continueConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertContinueConfig(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "continue", status: "registered", path: configPath, detail: `registered ${MCP_SERVER_NAME} in Continue config` };
}

export async function registerWindsurf(paths: RegistryPaths | undefined, serverInput: ServerCommand | undefined, dryRun?: boolean): Promise<RegisterResult> {
  const server = await serverCommand(serverInput);
  const configPath = windsurfConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertJsonMcpServers(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "windsurf", status: "registered", path: configPath, detail: `registered ${MCP_SERVER_NAME} in Windsurf config` };
}

async function resolveCommandPath(command: string): Promise<string | undefined> {
  if (process.platform !== "win32") return undefined;
  try {
    const { stdout } = await execFileAsync("where.exe", [command], { windowsHide: true });
    const candidates = stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
    if (!candidates.length) return undefined;
    const preferred = candidates.find((item) => /\.(cmd|exe|bat)$/i.test(item));
    return preferred ?? candidates[0];
  } catch {
    return undefined;
  }
}

export async function registerClaude(serverInput: ServerCommand | undefined, dryRun?: boolean): Promise<RegisterResult> {
  const server = await serverCommand(serverInput);
  const args = ["mcp", "add", "--transport", "stdio", "--scope", "user", MCP_SERVER_NAME, "--", server.command, ...server.args];
  const executable = (await resolveCommandPath("claude")) ?? "claude";
  if (dryRun) {
    return { tool: "claude", status: "registered", detail: `would run: ${executable} ${args.join(" ")}` };
  }
  try {
    await execFileAsync(executable, args, { windowsHide: true });
    return { tool: "claude", status: "registered", detail: `registered ${MCP_SERVER_NAME} with claude mcp add` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { tool: "claude", status: "failed", detail: message };
  }
}

export { MCP_DIST_ENTRY as SERVER_ENTRY, MCP_SERVER_NAME as SERVER_NAME, serverCommand, upsertCodexConfig, upsertContinueConfig, upsertJsonMcpServers, upsertOpenCodeConfig };
