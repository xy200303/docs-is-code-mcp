/* Status workflow recommendation contract for CLI text and JSON output. */
export type WorkflowState = { active: number; todo: number; review: number; done: number; openTodos: number };
export type RecommendationArguments = Record<string, string>;

export const STATUS_JSON_SCHEMA_VERSION = 1;

export interface StatusRecommendation {
  nextTool: string;
  alternatives: string[];
  arguments: RecommendationArguments;
  reason: string;
}

export interface StatusDecision extends StatusRecommendation {
  nextStep: string;
}

function baseRecommendationArguments(input: { projectRoot: string; specsDir: string }): RecommendationArguments {
  return { projectRoot: input.projectRoot, specsDir: input.specsDir };
}

export function decideStatusRecommendation(input: { workflowState: WorkflowState; projectRoot: string; specsDir: string }): StatusDecision {
  const baseArguments = baseRecommendationArguments(input);
  if (input.workflowState.openTodos) {
    return {
      nextStep: "Call spec_context and execute open TODOs in order.",
      nextTool: "spec_context",
      alternatives: [],
      arguments: baseArguments,
      reason: "Open TODOs exist and must be read before implementation."
    };
  }
  if (input.workflowState.active || input.workflowState.todo || input.workflowState.review) {
    return {
      nextStep: "Call spec_context in your AI tool before changing code or docs.",
      nextTool: "spec_context",
      alternatives: [],
      arguments: baseArguments,
      reason: "Executable specs exist and must be loaded before code or doc changes."
    };
  }
  if (input.workflowState.done) {
    return {
      nextStep: "No open work items. Create a new spec_todo or spec_create entry when new work starts.",
      nextTool: "spec_todo",
      alternatives: ["spec_create"],
      arguments: { ...baseArguments, prompt: "<small ordered task list>", title: "<short task title>" },
      reason: "Only done specs exist; create new work before implementation."
    };
  }
  return {
    nextStep: "Run specc bootstrap --project-root <path> --project-kind auto.",
    nextTool: "spec_bootstrap",
    alternatives: ["spec_todo", "spec_create"],
    arguments: { ...baseArguments, projectKind: "auto" },
    reason: "No specs exist yet; bootstrap the project workflow first."
  };
}

export function publicStatusRecommendation(decision: StatusDecision): StatusRecommendation {
  return {
    nextTool: decision.nextTool,
    alternatives: decision.alternatives,
    arguments: decision.arguments,
    reason: decision.reason
  };
}
