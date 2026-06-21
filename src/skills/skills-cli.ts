/* Thin wrapper around the official skills CLI for search and global agent installs. */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { ToolId } from "../cli/registry-types.js";

const execFileAsync = promisify(execFile);

export const SKILLS_CLI_PACKAGE = "skills";
export const DEFAULT_SKILL_AGENT: ToolId = "codex";
export const UI_UX_PRO_MAX_SKILL_SOURCE = "https://github.com/nextlevelbuilder/ui-ux-pro-max-skill";
export const UI_UX_PRO_MAX_SKILL_NAME = "ui-ux-pro-max";

export type SkillAgentInput = ToolId | "claude-code" | "*";

export interface SkillsCommandResult {
  command: string;
  args: string[];
  dryRun: boolean;
  stdout: string;
  stderr: string;
}

export interface SearchSkillsInput {
  query: string;
  maxChars?: number;
}

export interface InstallSkillsInput {
  source?: string;
  skills?: string[];
  agents?: SkillAgentInput[];
  global?: boolean;
  listOnly?: boolean;
  copy?: boolean;
  dryRun?: boolean;
  timeoutMs?: number;
}

function npxCommand(): string {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function stripAnsi(value: string): string {
  return value.replace(/\u001b\[[0-9;?]*[ -/]*[@-~]/g, "");
}

function cleanOutput(value: string, maxChars = 6000): string {
  const clean = stripAnsi(value).replace(/\r/g, "").trim();
  return clean.length > maxChars ? `${clean.slice(0, maxChars)}\n... output truncated ...` : clean;
}

export function toSkillsAgent(agent: SkillAgentInput): string {
  return agent === "claude" ? "claude-code" : agent;
}

export function buildSkillsSearchArgs(input: SearchSkillsInput): string[] {
  const query = input.query.trim();
  if (!query) {
    throw new Error("skills search query is required.");
  }
  return ["--yes", SKILLS_CLI_PACKAGE, "find", query];
}

export function buildSkillsInstallArgs(input: InstallSkillsInput = {}): string[] {
  const source = input.source?.trim() || UI_UX_PRO_MAX_SKILL_SOURCE;
  const agents = input.agents?.length ? input.agents : [DEFAULT_SKILL_AGENT];
  const skills = input.skills?.length ? input.skills : [UI_UX_PRO_MAX_SKILL_NAME];
  const args = ["--yes", SKILLS_CLI_PACKAGE, "add", source];

  if (input.listOnly) {
    args.push("--list");
    return args;
  }

  if (input.global ?? true) {
    args.push("--global");
  }
  args.push("--agent", ...agents.map(toSkillsAgent));
  args.push("--skill", ...skills);
  args.push("--yes");
  if (input.copy) {
    args.push("--copy");
  }
  return args;
}

async function runSkillsCommand(args: string[], input: { dryRun?: boolean; timeoutMs?: number; maxChars?: number } = {}): Promise<SkillsCommandResult> {
  if (input.dryRun) {
    return {
      command: npxCommand(),
      args,
      dryRun: true,
      stdout: "",
      stderr: ""
    };
  }
  try {
    const result = await execFileAsync(npxCommand(), args, {
      timeout: input.timeoutMs ?? 120000,
      maxBuffer: 1024 * 1024,
      windowsHide: true
    });
    return {
      command: npxCommand(),
      args,
      dryRun: false,
      stdout: cleanOutput(result.stdout, input.maxChars),
      stderr: cleanOutput(result.stderr, input.maxChars)
    };
  } catch (error) {
    const maybe = error as { stdout?: string; stderr?: string; message?: string };
    const stdout = cleanOutput(maybe.stdout ?? "", input.maxChars);
    const stderr = cleanOutput(maybe.stderr ?? maybe.message ?? String(error), input.maxChars);
    throw new Error([`skills CLI command failed: ${npxCommand()} ${args.join(" ")}`, stdout, stderr].filter(Boolean).join("\n"));
  }
}

export async function searchSkills(input: SearchSkillsInput): Promise<SkillsCommandResult> {
  return runSkillsCommand(buildSkillsSearchArgs(input), { maxChars: input.maxChars });
}

export async function installSkills(input: InstallSkillsInput = {}): Promise<SkillsCommandResult> {
  return runSkillsCommand(buildSkillsInstallArgs(input), {
    dryRun: input.dryRun,
    timeoutMs: input.timeoutMs
  });
}

export function renderSkillsResult(title: string, result: SkillsCommandResult, nextSteps: string[] = []): string {
  const commandLine = [result.command, ...result.args].join(" ");
  return [
    `# ${title}`,
    "",
    `command: \`${commandLine}\``,
    `dryRun: \`${result.dryRun ? "true" : "false"}\``,
    "",
    ...(result.stdout ? ["## stdout", "", result.stdout, ""] : []),
    ...(result.stderr ? ["## stderr", "", result.stderr, ""] : []),
    ...(nextSteps.length ? ["## Next", "", ...nextSteps.map((step) => `- ${step}`)] : [])
  ].join("\n");
}
