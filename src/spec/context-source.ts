/* Source discovery helpers for spec context assembly. */
import { listTextFiles, relativePosix, unique } from "../shared/utils.js";
import type { SpecItem } from "./types.js";

export async function findCandidateFiles(root: string, specs: Array<SpecItem & { text: string }>, limit: number): Promise<string[]> {
  const words = unique(specs.flatMap((spec) => `${spec.title} ${spec.text}`.match(/[\p{L}\p{N}_-]{2,}/gu) ?? []))
    .filter((word) => !["status", "source", "active", "draft", "review", "spec", "测试", "功能", "实现"].includes(word))
    .slice(0, 80);
  const files = await listTextFiles(root, {
    maxFiles: 1500,
    excludeDirs: ["node_modules", ".git", "dist", "build", "coverage", "specs", "docs"],
    extensions: new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".py", ".go", ".rs", ".java", ".vue", ".svelte"])
  });
  return files
    .map((absolute) => relativePosix(root, absolute))
    .map((file) => ({
      file,
      score: words.reduce((score, word) => score + (file.toLowerCase().includes(word.toLowerCase()) ? Math.min(word.length, 12) : 0), 0)
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.file.localeCompare(b.file))
    .slice(0, limit)
    .map((item) => item.file);
}
