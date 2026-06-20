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

function readableText(value: string | undefined): string {
  return value?.replace(/\r?\n/g, " ").trim() || "未记录";
}

function relatedFilesLines(files: string[] = []): string[] {
  if (!files.length) return ["  - 关联文件：未记录"];
  return [
    "  - 关联文件：",
    ...files.map((file) => `    - \`${file}\``)
  ];
}

function behaviorRecordBlock(record: BehaviorRecord, index: number): string[] {
  return [
    `${index + 1}. ${readableText(record.scenario)}`,
    `  - 条件：${readableText(record.condition)}`,
    `  - 结果：${readableText(record.result)}`,
    `  - 默认行为：${readableText(record.defaultBehavior)}`,
    `  - 边界处理：${readableText(record.edgeCase)}`,
    `  - 验证：${readableText(record.verification)}`,
    ...relatedFilesLines(record.relatedFiles)
  ];
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
    ...rows.flatMap((record, index) => [
      ...behaviorRecordBlock(record, index),
      ""
    ]).slice(0, -1)
  ];
}
