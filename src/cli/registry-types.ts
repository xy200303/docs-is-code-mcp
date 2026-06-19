/* Shared types for CLI registry detection and registration. */
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
