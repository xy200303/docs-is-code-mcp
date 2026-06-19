/* Tool detection helpers for AI coding CLI registries. */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { SUPPORTED_TOOL_IDS } from "./compatibility-contract.js";
import { codexConfigPath, continueConfigPath, cursorConfigPath, opencodeConfigPath, windsurfConfigPath } from "./registry-paths.js";
import type { RegistryPaths, ToolInfo } from "./registry-types.js";
import { pathExists } from "../shared/utils.js";

const execFileAsync = promisify(execFile);

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
  const detectors = {
    codex: () => detectCodex(paths),
    claude: () => detectClaude(),
    opencode: () => detectOpenCode(paths),
    cursor: () => detectCursor(paths),
    continue: () => detectContinue(paths),
    windsurf: () => detectWindsurf(paths)
  };
  return Promise.all(SUPPORTED_TOOL_IDS.map((tool) => detectors[tool]()));
}
