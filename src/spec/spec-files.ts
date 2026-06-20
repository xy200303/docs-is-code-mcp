/* Spec file path, naming, and metadata helpers. */
import { promises as fs } from "node:fs";
import path from "node:path";
import type { SpecItem } from "./types.js";
import { listMarkdownFiles, pathExists, relativePosix } from "../shared/utils.js";

const SPEC_SLUG_MAX_LENGTH = 64;
const ORDERED_SPEC_FILE_PATTERN = /^(\d{3})-.+\.md$/;

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
  return readableSpecSlug(title, "spec");
}

export function inferTodoFileName(title: string): string {
  return readableSpecSlug(title, "todo");
}

export function timestampedMarkdownFile(date: Date, slug: string): string {
  return `${localDateDirectory(date)}-${slug}.md`;
}

export function localDateDirectory(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function readableSpecSlug(value: string, fallback: string): string {
  const slug = value
    .normalize("NFKC")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]+/gu, " ")
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  const readable = Array.from(slug).slice(0, SPEC_SLUG_MAX_LENGTH).join("").replace(/-$/g, "");
  return readable || fallback;
}

export async function nextSpecDocumentPath(input: {
  root: string;
  specsDir: string;
  bucket: "active" | "todo" | "done";
  title: string;
  fallbackSlug: string;
  date?: Date;
}): Promise<string> {
  const day = localDateDirectory(input.date ?? new Date());
  const directory = path.join(input.specsDir, input.bucket, day);
  const slug = readableSpecSlug(input.title, input.fallbackSlug);
  let index = await nextDailyIndex(input.root, directory);

  while (true) {
    const sequence = String(index).padStart(3, "0");
    const relative = path.join(directory, `${sequence}-${slug}.md`);
    if (!(await pathExists(path.join(input.root, relative)))) return relative;
    index += 1;
  }
}

async function nextDailyIndex(root: string, relativeDirectory: string): Promise<number> {
  const absoluteDirectory = path.join(root, relativeDirectory);
  let entries;
  try {
    entries = await fs.readdir(absoluteDirectory, { withFileTypes: true });
  } catch {
    return 1;
  }

  const usedIndexes = entries
    .filter((entry) => entry.isFile())
    .map((entry) => ORDERED_SPEC_FILE_PATTERN.exec(entry.name)?.[1])
    .filter((value): value is string => value !== undefined)
    .map((value) => Number.parseInt(value, 10));
  return Math.max(0, ...usedIndexes) + 1;
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
