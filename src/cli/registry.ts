import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { ensureDir, pathExists } from "../shared/utils.js";

const execFileAsync = promisify(execFile);
const SERVER_NAME = "spec-coding";
const SERVER_ENTRY = "dist/index.js";

export type ToolId = "codex" | "claude" | "opencode" | "cursor" | "continue" | "windsurf";

export interface ToolInfo {
  id: ToolId;
  label: string;
  detected: boolean;
  reason: string;
}

export interface RegistryPaths {
  homeDir?: string;
  codexConfig?: string;
  opencodeConfig?: string;
  cursorConfig?: string;
  continueConfig?: string;
  windsurfConfig?: string;
}

export interface ServerCommand {
  command: string;
  args: string[];
}

export interface RegisterOptions {
  tools: ToolId[];
  paths?: RegistryPaths;
  server?: ServerCommand;
  dryRun?: boolean;
}

export interface RegisterResult {
  tool: ToolId;
  status: "registered" | "skipped" | "failed";
  detail: string;
  path?: string;
}

function homeDir(paths?: RegistryPaths): string {
  return paths?.homeDir ?? os.homedir();
}

export function codexConfigPath(paths?: RegistryPaths): string {
  return paths?.codexConfig ?? path.join(homeDir(paths), ".codex", "config.toml");
}

export function opencodeConfigPath(paths?: RegistryPaths): string {
  const home = homeDir(paths);
  return paths?.opencodeConfig ?? (
    process.platform === "win32"
      ? path.join(process.env.APPDATA ?? path.join(home, "AppData", "Roaming"), "opencode", "opencode.json")
      : path.join(home, ".config", "opencode", "opencode.json")
  );
}

export function cursorConfigPath(paths?: RegistryPaths): string {
  return paths?.cursorConfig ?? path.join(homeDir(paths), ".cursor", "mcp.json");
}

export function continueConfigPath(paths?: RegistryPaths): string {
  return paths?.continueConfig ?? path.join(homeDir(paths), ".continue", "config.yaml");
}

export function windsurfConfigPath(paths?: RegistryPaths): string {
  return paths?.windsurfConfig ?? path.join(homeDir(paths), ".codeium", "mcp_config.json");
}

async function commandExists(command: string): Promise<boolean> {
  const checker = process.platform === "win32" ? "where.exe" : "sh";
  const args = process.platform === "win32" ? [command] : ["-c", `command -v ${JSON.stringify(command)}`];
  try {
    await execFileAsync(checker, args, { windowsHide: true });
    return true;
  } catch {
    return false;
  }
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

async function detectCodex(paths?: RegistryPaths): Promise<ToolInfo> {
  if (await commandExists("codex")) {
    return { id: "codex", label: "Codex", detected: true, reason: "detected codex command" };
  }
  if (await pathExists(codexConfigPath(paths))) {
    return { id: "codex", label: "Codex", detected: true, reason: "found ~/.codex/config.toml" };
  }
  return { id: "codex", label: "Codex", detected: false, reason: "codex command/config not found" };
}

async function detectClaude(): Promise<ToolInfo> {
  return (await commandExists("claude"))
    ? { id: "claude", label: "Claude Code", detected: true, reason: "detected claude command" }
    : { id: "claude", label: "Claude Code", detected: false, reason: "claude command not found" };
}

async function detectOpenCode(paths?: RegistryPaths): Promise<ToolInfo> {
  if ((await commandExists("opencode")) || (await commandExists("opencode-ai"))) {
    return { id: "opencode", label: "OpenCode", detected: true, reason: "detected opencode command" };
  }
  if (await pathExists(opencodeConfigPath(paths))) {
    return { id: "opencode", label: "OpenCode", detected: true, reason: "found opencode config" };
  }
  return { id: "opencode", label: "OpenCode", detected: false, reason: "opencode command/config not found" };
}

async function detectCursor(paths?: RegistryPaths): Promise<ToolInfo> {
  if (await commandExists("cursor")) {
    return { id: "cursor", label: "Cursor", detected: true, reason: "detected cursor command" };
  }
  if (await pathExists(cursorConfigPath(paths))) {
    return { id: "cursor", label: "Cursor", detected: true, reason: "found cursor mcp config" };
  }
  return { id: "cursor", label: "Cursor", detected: false, reason: "cursor command/config not found" };
}

async function detectContinue(paths?: RegistryPaths): Promise<ToolInfo> {
  if ((await commandExists("cn")) || (await commandExists("continue"))) {
    return { id: "continue", label: "Continue", detected: true, reason: "detected Continue CLI command" };
  }
  if (await pathExists(continueConfigPath(paths))) {
    return { id: "continue", label: "Continue", detected: true, reason: "found Continue config" };
  }
  return { id: "continue", label: "Continue", detected: false, reason: "Continue command/config not found" };
}

async function detectWindsurf(paths?: RegistryPaths): Promise<ToolInfo> {
  if ((await commandExists("windsurf")) || (await commandExists("devin"))) {
    return { id: "windsurf", label: "Windsurf", detected: true, reason: "detected Windsurf/Devin command" };
  }
  if (await pathExists(windsurfConfigPath(paths))) {
    return { id: "windsurf", label: "Windsurf", detected: true, reason: "found Windsurf mcp config" };
  }
  return { id: "windsurf", label: "Windsurf", detected: false, reason: "Windsurf command/config not found" };
}

export async function detectProgrammingTools(paths?: RegistryPaths): Promise<ToolInfo[]> {
  return Promise.all([
    detectCodex(paths),
    detectClaude(),
    detectOpenCode(paths),
    detectCursor(paths),
    detectContinue(paths),
    detectWindsurf(paths)
  ]);
}

function packageRootFromCurrentModule(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
}

async function defaultServerCommand(): Promise<ServerCommand> {
  const packageRoot = packageRootFromCurrentModule();
  const entry = path.join(packageRoot, SERVER_ENTRY);
  if (await pathExists(entry)) {
    return {
      command: process.execPath,
      args: [entry, "serve"]
    };
  }
  return {
    command: "specc",
    args: ["serve"]
  };
}

async function serverCommand(input?: ServerCommand): Promise<ServerCommand> {
  const fallback = await defaultServerCommand();
  return {
    command: input?.command ?? fallback.command,
    args: input?.args ?? fallback.args
  };
}

function renderTomlString(value: string): string {
  return JSON.stringify(value);
}

export function upsertCodexConfig(content: string, server: ServerCommand): string {
  const normalized = content.replace(/\r\n/g, "\n").trimEnd();
  const block = [
    `[mcp_servers.${SERVER_NAME}]`,
    `command = ${renderTomlString(server.command)}`,
    `args = [${server.args.map(renderTomlString).join(", ")}]`
  ].join("\n");
  const lines = normalized ? normalized.split("\n") : [];
  const header = `[mcp_servers.${SERVER_NAME}]`;
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

async function registerCodex(paths: RegistryPaths | undefined, server: ServerCommand, dryRun?: boolean): Promise<RegisterResult> {
  const configPath = codexConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertCodexConfig(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "codex", status: "registered", path: configPath, detail: `registered ${SERVER_NAME} in Codex config` };
}

function upsertOpenCodeConfigObject(value: unknown, server: ServerCommand): Record<string, unknown> {
  const root = value && typeof value === "object" && !Array.isArray(value) ? { ...(value as Record<string, unknown>) } : {};
  const mcp = root.mcp && typeof root.mcp === "object" && !Array.isArray(root.mcp) ? { ...(root.mcp as Record<string, unknown>) } : {};
  mcp[SERVER_NAME] = {
    type: "local",
    command: [server.command, ...server.args]
  };
  root.$schema = typeof root.$schema === "string" ? root.$schema : "https://opencode.ai/config.json";
  root.mcp = mcp;
  return root;
}

export function upsertOpenCodeConfig(content: string, server: ServerCommand): string {
  const parsed = content.trim() ? JSON.parse(content) : {};
  return JSON.stringify(upsertOpenCodeConfigObject(parsed, server), null, 2) + "\n";
}

async function registerOpenCode(paths: RegistryPaths | undefined, server: ServerCommand, dryRun?: boolean): Promise<RegisterResult> {
  const configPath = opencodeConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertOpenCodeConfig(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "opencode", status: "registered", path: configPath, detail: `registered ${SERVER_NAME} in OpenCode config` };
}

function upsertJsonMcpServers(content: string, server: ServerCommand): string {
  const parsed = content.trim() ? JSON.parse(content) : {};
  const root = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? { ...(parsed as Record<string, unknown>) } : {};
  const mcpServers = root.mcpServers && typeof root.mcpServers === "object" && !Array.isArray(root.mcpServers)
    ? { ...(root.mcpServers as Record<string, unknown>) }
    : {};
  mcpServers[SERVER_NAME] = {
    command: server.command,
    args: server.args
  };
  root.mcpServers = mcpServers;
  return JSON.stringify(root, null, 2) + "\n";
}

async function registerCursor(paths: RegistryPaths | undefined, server: ServerCommand, dryRun?: boolean): Promise<RegisterResult> {
  const configPath = cursorConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertJsonMcpServers(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "cursor", status: "registered", path: configPath, detail: `registered ${SERVER_NAME} in Cursor config` };
}

function yamlString(value: string): string {
  if (!value.trim()) return '""';
  if (/^[A-Za-z0-9_./:-]+$/.test(value)) return value;
  return JSON.stringify(value);
}

function renderContinueServer(server: ServerCommand): string {
  return [
    "  - name: spec-coding",
    `    command: ${yamlString(server.command)}`,
    "    args:",
    ...server.args.map((arg) => `      - ${yamlString(arg)}`)
  ].join("\n");
}

function renderContinueConfig(server: ServerCommand): string {
  return [
    "name: spec-coding",
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

async function registerContinue(paths: RegistryPaths | undefined, server: ServerCommand, dryRun?: boolean): Promise<RegisterResult> {
  const configPath = continueConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertContinueConfig(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "continue", status: "registered", path: configPath, detail: `registered ${SERVER_NAME} in Continue config` };
}

async function registerWindsurf(paths: RegistryPaths | undefined, server: ServerCommand, dryRun?: boolean): Promise<RegisterResult> {
  const configPath = windsurfConfigPath(paths);
  const existing = await pathExists(configPath) ? await fs.readFile(configPath, "utf8") : "";
  const next = upsertJsonMcpServers(existing, server);
  if (!dryRun) {
    await ensureDir(path.dirname(configPath));
    await fs.writeFile(configPath, next, "utf8");
  }
  return { tool: "windsurf", status: "registered", path: configPath, detail: `registered ${SERVER_NAME} in Windsurf config` };
}

async function registerClaude(server: ServerCommand, dryRun?: boolean): Promise<RegisterResult> {
  const args = ["mcp", "add", "--transport", "stdio", "--scope", "user", SERVER_NAME, "--", server.command, ...server.args];
  const executable = (await resolveCommandPath("claude")) ?? "claude";
  if (dryRun) {
    return { tool: "claude", status: "registered", detail: `would run: ${executable} ${args.join(" ")}` };
  }
  try {
    await execFileAsync(executable, args, { windowsHide: true });
    return { tool: "claude", status: "registered", detail: `registered ${SERVER_NAME} with claude mcp add` };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { tool: "claude", status: "failed", detail: message };
  }
}

export async function registerTools(options: RegisterOptions): Promise<RegisterResult[]> {
  const server = await serverCommand(options.server);
  const results: RegisterResult[] = [];
  for (const tool of options.tools) {
    if (tool === "codex") {
      results.push(await registerCodex(options.paths, server, options.dryRun));
    } else if (tool === "cursor") {
      results.push(await registerCursor(options.paths, server, options.dryRun));
    } else if (tool === "continue") {
      results.push(await registerContinue(options.paths, server, options.dryRun));
    } else if (tool === "opencode") {
      results.push(await registerOpenCode(options.paths, server, options.dryRun));
    } else if (tool === "windsurf") {
      results.push(await registerWindsurf(options.paths, server, options.dryRun));
    } else {
      results.push(await registerClaude(server, options.dryRun));
    }
  }
  return results;
}
