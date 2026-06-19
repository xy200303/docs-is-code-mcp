/* Shared markdown helpers for recording confirmed runtime behavior in specs. */
import type { BehaviorRecord } from "./types.js";

const emptyBehaviorRecord: BehaviorRecord = {
  scenario: "未记录",
  condition: "未记录",
  result: "未记录",
  defaultBehavior: "未记录",
  edgeCase: "未记录",
  verification: "请查看本文件中的 Verification 记录",
  relatedFiles: []
};

function escapeTableCell(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\r?\n/g, " ").trim() || "未记录";
}

function relatedFilesText(files: string[] = []): string {
  return files.length ? files.map((file) => `\`${file}\``).join("<br>") : "未记录";
}

export function hasBehaviorRecords(records: BehaviorRecord[] = []): boolean {
  return records.length > 0;
}

export function normalizeBehaviorRecords(records: BehaviorRecord[] = []): BehaviorRecord[] {
  return records.length ? records : [emptyBehaviorRecord];
}

export function behaviorRecordLines(title: string, records: BehaviorRecord[] = []): string[] {
  const rows = normalizeBehaviorRecords(records);
  return [
    title,
    "",
    "| 场景 | 条件 | 结果 | 默认行为 | 边界处理 | 验证 | 关联文件 |",
    "|---|---|---|---|---|---|---|",
    ...rows.map((record) =>
      [
        record.scenario,
        record.condition,
        record.result,
        record.defaultBehavior ?? "未记录",
        record.edgeCase ?? "未记录",
        record.verification ?? "未记录",
        relatedFilesText(record.relatedFiles)
      ].map(escapeTableCell).join(" | ")
    ).map((row) => `| ${row} |`)
  ];
}
