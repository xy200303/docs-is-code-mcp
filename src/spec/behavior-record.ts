/* Shared markdown helpers for recording confirmed runtime behavior in specs. */
import type { BehaviorRecord } from "./types.js";

const emptyBehaviorRecord: BehaviorRecord = {
  scenario: "未提供已验证行为",
  condition: "未提供来自代码、测试或用户确认的条件",
  result: "不可作为真实行为事实",
  defaultBehavior: "未验证",
  edgeCase: "未验证",
  verification: "未提供验证证据",
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
