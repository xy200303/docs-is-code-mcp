/* Shared markdown template helpers for spec documents. */
import { businessConfirmationConstraints, engineeringConstraints, hardEngineeringConstraints, recommendedEngineeringPractices } from "./constraints.js";
import { currentTaskInstructions } from "./prompt-protocol.js";

export function list(items: string[], empty = "未识别到明显线索"): string[] {
  return items.length ? items.map((item) => `- \`${item}\``) : [`- ${empty}`];
}

export function engineeringConstraintBullets(): string[] {
  return engineeringConstraints.map((item) => `- ${item}`);
}

export function hardEngineeringRuleBullets(): string[] {
  return hardEngineeringConstraints.map((item) => `- ${item}`);
}

export function recommendedEngineeringPracticeBullets(): string[] {
  return recommendedEngineeringPractices.map((item) => `- ${item}`);
}

export function businessConfirmationBullets(): string[] {
  return businessConfirmationConstraints.map((item) => `- ${item}`);
}

export function currentTaskInstructionBullets(): string[] {
  return currentTaskInstructions.map((item) => `- ${item}`);
}

export function engineeringRuleSections(): string[] {
  return [
    "### Hard Rules",
    "",
    ...hardEngineeringRuleBullets(),
    "",
    "### Recommended Practices",
    "",
    ...recommendedEngineeringPracticeBullets()
  ];
}

export function engineeringConstraintSection(): string[] {
  return [
    "## 工程质量约束",
    "",
    "这些规则是强制约束，不是建议。",
    "",
    ...engineeringRuleSections()
  ];
}

export function businessConfirmationSection(): string[] {
  return [
    "## 业务不确定性强制确认",
    "",
    "这些规则是硬性约束，不是建议。",
    "",
    ...businessConfirmationBullets()
  ];
}

export function workflowGuardSection(): string[] {
  return [
    "## 开发前置要求",
    "",
    "在修改任何代码或文档之前，必须先调用 `spec_context` 并读取输出。",
    "如果当前任务还没有 `spec_context` 输出，就不要开始实现、重构或改写文档。"
  ];
}

export { currentTaskInstructions, engineeringConstraints, hardEngineeringConstraints, recommendedEngineeringPractices };
