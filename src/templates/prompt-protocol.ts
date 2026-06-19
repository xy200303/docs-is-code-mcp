/* Shared task protocol text for model-facing spec context and AGENTS output. */
export const currentTaskInstructions = [
  "先读本次 `spec_context`；没有上下文不得实现或改文档。",
  "selected specs 和 open TODOs 是唯一需求源，不按旧对话扩范围。",
  "按 open TODOs 自上而下执行；无 TODO 时按 spec 目标、行为规则和验收标准执行。",
  "每完成一个 TODO，必须勾选 `[x]`；无法完成则保留 `[ ]` 并写明阻塞。",
  "先读目标、规则、验收标准和代码线索，再搜索代码。",
  "遵守 Hard Rules、Recommended Practices 和 Business Confirmation Rules；冲突或高风险时先问用户。",
  "高风险业务描述不完整时，停止实现，说明疑点并给出 2 到 3 种解释。",
  "阶段完成后调用 `spec_checkpoint` 记录 TODO、文件、验证、风险和阻塞。",
  "全部完成且验证通过后，再调用 `spec_done` 或按用户要求归档。"
];
