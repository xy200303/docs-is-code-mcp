/* Structured review result writer for implementation summaries. */
import { promises as fs } from "node:fs";
import { bulletList, verificationLines } from "./todo-files.js";
import { resolveInsideRoot } from "./spec-files.js";
import type { BehaviorRecord, ReviewResult } from "./types.js";
import { nowIso, relativePosix } from "../shared/utils.js";
import { behaviorRecordLines } from "./behavior-record.js";

export async function recordSpecReviewResult(input: {
  projectRoot: string;
  specsDir?: string;
  file: string;
  summary: string;
  completedTodos?: string[];
  incompleteTodos?: string[];
  changedFiles?: string[];
  verification?: ReviewResult["verification"];
  behaviorRecords?: BehaviorRecord[];
  risks?: string[];
  blockers?: string[];
  note?: string;
}): Promise<ReviewResult> {
  const root = input.projectRoot;
  const specsDir = input.specsDir ?? "specs";
  const source = resolveInsideRoot(root, input.file, "Review file");
  const lines = [
    "",
    "## Review Result",
    "",
    `- at: ${nowIso()}`,
    `- summary: ${input.summary.trim()}`,
    ...(input.note?.trim() ? [`- note: ${input.note.trim()}`] : []),
    "",
    "### Completed TODOs",
    "",
    ...bulletList(input.completedTodos ?? [], "无"),
    "",
    "### Incomplete TODOs",
    "",
    ...bulletList(input.incompleteTodos ?? [], "无"),
    "",
    "### Changed Files",
    "",
    ...bulletList((input.changedFiles ?? []).map((file) => `\`${file}\``), "未记录"),
    "",
    "### Verification",
    "",
    ...verificationLines(input.verification ?? []),
    "",
    ...behaviorRecordLines("### 实际行为记录", input.behaviorRecords),
    "",
    "### Risks",
    "",
    ...bulletList(input.risks ?? [], "无"),
    "",
    "### Blockers",
    "",
    ...bulletList(input.blockers ?? [], "无")
  ];
  await fs.appendFile(source, `${lines.join("\n")}\n`, "utf8");
  return {
    file: relativePosix(root, source),
    summary: input.summary.trim(),
    completedTodos: input.completedTodos ?? [],
    incompleteTodos: input.incompleteTodos ?? [],
    verification: input.verification ?? [],
    behaviorRecords: input.behaviorRecords ?? [],
    changedFiles: input.changedFiles ?? [],
    risks: input.risks ?? [],
    blockers: input.blockers ?? []
  };
}
