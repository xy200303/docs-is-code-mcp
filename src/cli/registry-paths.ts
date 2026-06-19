/* Registry path resolution helpers for supported AI coding tools. */
import os from "node:os";
import path from "node:path";
import type { RegistryPaths } from "./registry-types.js";

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
