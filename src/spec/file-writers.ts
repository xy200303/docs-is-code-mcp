/* File writing helpers for spec workflows. */
import { promises as fs } from "node:fs";
import path from "node:path";
import type { GeneratedFile } from "./types.js";
import { ensureDir, pathExists, relativePosix } from "../shared/utils.js";

export async function writeTextFile(root: string, relativeFile: string, content: string, overwrite: boolean, files: GeneratedFile[]): Promise<void> {
  const absolute = path.join(root, relativeFile);
  await ensureDir(path.dirname(absolute));
  const normalized = content.trimEnd() + "\n";
  if (await pathExists(absolute)) {
    const old = await fs.readFile(absolute, "utf8");
    if (old === normalized) {
      files.push({ path: relativePosix(root, absolute), status: "skipped", reason: "内容未变化" });
      return;
    }
    if (!overwrite) {
      files.push({ path: relativePosix(root, absolute), status: "skipped", reason: "文件已存在且 overwrite=false" });
      return;
    }
    await fs.writeFile(absolute, normalized, "utf8");
    files.push({ path: relativePosix(root, absolute), status: "updated" });
    return;
  }
  await fs.writeFile(absolute, normalized, "utf8");
  files.push({ path: relativePosix(root, absolute), status: "created" });
}
