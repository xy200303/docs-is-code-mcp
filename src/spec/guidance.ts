/* Read project-editable guidance prompt files with built-in defaults. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { guidanceTemplateByName, guidanceTemplates } from "../templates/guidance.js";
import { pathExists, relativePosix } from "../shared/utils.js";
import { writeTextFile } from "./file-writers.js";
import type { GeneratedFile } from "./types.js";

export interface GuidanceItem {
  name: string;
  title: string;
  purpose: string;
  file: string;
}

export interface GuidanceContent extends GuidanceItem {
  content: string;
  source: "project" | "builtin";
}

export function guidanceItems(specsDir = "specs"): GuidanceItem[] {
  return guidanceTemplates.map((item) => ({
    name: item.name,
    title: item.title,
    purpose: item.purpose,
    file: path.posix.join(specsDir, "guidance", item.fileName)
  }));
}

export async function writeDefaultGuidanceFiles(root: string, specsDir: string, overwrite: boolean, files: GeneratedFile[]): Promise<void> {
  for (const item of guidanceTemplates) {
    await writeTextFile(root, path.join(specsDir, "guidance", item.fileName), item.content, overwrite, files);
  }
}

export async function readGuidance(input: { projectRoot: string; specsDir?: string; name: string }): Promise<GuidanceContent> {
  const root = path.resolve(input.projectRoot);
  const specsDir = input.specsDir ?? "specs";
  const template = guidanceTemplateByName(input.name);
  if (!template) {
    throw new Error(`Unknown guidance: ${input.name}. Available: ${guidanceTemplates.map((item) => item.name).join(", ")}`);
  }

  const absolute = path.join(root, specsDir, "guidance", template.fileName);
  const item = guidanceItems(specsDir).find((entry) => entry.name === template.name);
  if (!item) {
    throw new Error(`Guidance template is not registered: ${template.name}`);
  }

  if (await pathExists(absolute)) {
    return {
      ...item,
      file: relativePosix(root, absolute),
      content: await fs.readFile(absolute, "utf8"),
      source: "project"
    };
  }

  return {
    ...item,
    content: template.content,
    source: "builtin"
  };
}
