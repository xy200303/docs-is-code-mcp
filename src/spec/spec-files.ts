/* Spec file path, naming, and metadata helpers. */
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SpecItem } from "./types.js";
import { listMarkdownFiles, relativePosix, slugifyAscii } from "../shared/utils.js";

export function resolveInsideRoot(root: string, file: string, label: string): string {
  const absolute = path.resolve(root, file);
  const relative = path.relative(root, absolute);
  if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error(`${label} must be inside project root.`);
  return absolute;
}

export function inferProjectName(projectRoot: string, explicit?: string): string {
  if (explicit?.trim()) return explicit.trim();
  return path.basename(projectRoot) || "未命名系统";
}

export function inferTitle(prompt: string): string {
  const firstLine = prompt.split(/\r?\n/).map((line) => line.trim()).find(Boolean);
  if (!firstLine) return "未命名 Spec";
  return firstLine.replace(/^#+\s*/, "").slice(0, 48);
}

export function inferSpecFileName(title: string): string {
  return slugifyAscii(title, "spec");
}

export function inferTodoFileName(title: string): string {
  return slugifyAscii(title, "todo");
}

export function timestampedMarkdownFile(date: Date, slug: string): string {
  return `${date.toISOString().slice(0, 10)}-${slug}.md`;
}

export function readMeta(text: string, key: string, fallback: string): string {
  const pattern = new RegExp(`^-\\s*${key}:\\s*(.+?)\\s*$`, "im");
  return pattern.exec(text)?.[1]?.trim() ?? fallback;
}

export function titleFromMarkdown(text: string, fallback: string): string {
  return /^#\s+(.+?)\s*$/m.exec(text)?.[1]?.trim() ?? fallback;
}

export async function listSpecsIn(root: string, specsDir: string, subdir: string): Promise<SpecItem[]> {
  const dir = path.join(root, specsDir, subdir);
  const files = await listMarkdownFiles(dir);
  const items: SpecItem[] = [];
  for (const absolute of files) {
    const text = await fs.readFile(absolute, "utf8");
    const stat = await fs.stat(absolute);
    items.push({
      file: relativePosix(root, absolute),
      title: titleFromMarkdown(text, path.basename(absolute, ".md")),
      status: subdir === "done" ? "done" : readMeta(text, "status", subdir),
      source: readMeta(text, "source", subdir),
      updatedAt: stat.mtime.toISOString()
    });
  }
  return items.sort((a, b) => a.file.localeCompare(b.file));
}
