/* Shared markdown helpers for recording confirmed runtime behavior in specs. */
import type { BehaviorRecord } from "./types.js";

const emptyBehaviorRecord: BehaviorRecord = {
  scenario: "未提供已验证行为",
  condition: "未提供来自代码、测试或用户确认的条件",
  result: "不可作为真实行为事实",
  trigger: "未记录",
  input: "未记录",
  steps: [],
  output: "未记录",
  sideEffects: "未记录",
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

function executionStepLines(steps: string[] = []): string[] {
  const cleaned = steps.map(readableText).filter((step) => step !== "未记录");
  if (!cleaned.length) return ["  - 执行过程：未记录"];
  return [
    "  - 执行过程：",
    ...cleaned.map((step, index) => `    ${index + 1}. ${step}`)
  ];
}

function behaviorRecordBlock(record: BehaviorRecord, index: number): string[] {
  return [
    `${index + 1}. ${readableText(record.scenario)}`,
    `  - 条件：${readableText(record.condition)}`,
    `  - 触发入口：${readableText(record.trigger)}`,
    `  - 输入与前置状态：${readableText(record.input)}`,
    ...executionStepLines(record.steps),
    `  - 输出结果：${readableText(record.output ?? record.result)}`,
    `  - 副作用：${readableText(record.sideEffects)}`,
    `  - 默认行为：${readableText(record.defaultBehavior)}`,
    `  - 边界处理：${readableText(record.edgeCase)}`,
    `  - 结果摘要：${readableText(record.result)}`,
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
    ...(title === "## 最终行为契约"
      ? [
          "本节用于给用户审查功能完整行为；必须覆盖所有已知正常、失败、边界、权限、状态、异常、空值和默认行为。模型自行采用的默认策略也必须写清楚。",
          ""
        ]
      : []),
    ...rows.flatMap((record, index) => [
      ...behaviorRecordBlock(record, index),
      ""
    ]).slice(0, -1)
  ];
}
