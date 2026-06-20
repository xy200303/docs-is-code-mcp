/* Status CLI command for read-only local workflow diagnostics. */
import { listSpecs } from "../spec/scaffold.js";
import { readSpecsWithText } from "../spec/spec-reader.js";
import { extractTodos } from "../spec/todo-files.js";
import { APP_NAME, APP_VERSION } from "../shared/meta.js";
import { assertKnownOptions, hasFlag, optionValue } from "./cli-options.js";

type ListedSpecs = Awaited<ReturnType<typeof listSpecs>>;
type WorkflowState = { active: number; todo: number; review: number; done: number; openTodos: number };
type RecommendationArguments = Record<string, string>;

interface StatusRecommendation {
  nextTool: string;
  alternatives: string[];
  arguments: RecommendationArguments;
  reason: string;
}

interface StatusDecision extends StatusRecommendation {
  nextStep: string;
}

interface StatusReport {
  name: string;
  version: string;
  projectRoot: string;
  specsDir: string;
  workflowState: WorkflowState;
  nextStep: string;
  recommendation: StatusRecommendation;
}

function printStatusHelp(): void {
  console.log([
    `${APP_NAME} status`,
    "",
    "Usage:",
    "  specc status [options]",
    "",
    "Options:",
    "  --project-root <path>       Project root. Default: current working directory.",
    "  --specs-dir <path>          Specs directory. Default: specs.",
    "  --json                      Print machine-readable JSON.",
    "  -h, --help                  Show status help."
  ].join("\n"));
}

function baseRecommendationArguments(input: { projectRoot: string; specsDir: string }): RecommendationArguments {
  return { projectRoot: input.projectRoot, specsDir: input.specsDir };
}

function statusDecision(input: { workflowState: WorkflowState; projectRoot: string; specsDir: string }): StatusDecision {
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

function publicRecommendation(decision: StatusDecision): StatusRecommendation {
  return {
    nextTool: decision.nextTool,
    alternatives: decision.alternatives,
    arguments: decision.arguments,
    reason: decision.reason
  };
}

async function countOpenTodos(root: string, items: ListedSpecs): Promise<number> {
  const specs = await readSpecsWithText(root, [...items.active, ...items.todo], Number.MAX_SAFE_INTEGER);
  return specs.flatMap((spec) => extractTodos(spec.file, spec.text)).filter((todo) => !todo.checked).length;
}

async function statusReport(args: string[]): Promise<StatusReport> {
  const projectRoot = optionValue(args, "--project-root") ?? process.cwd();
  const specsDir = optionValue(args, "--specs-dir") ?? "specs";
  const specs = await listSpecs({ projectRoot, specsDir });
  const openTodos = await countOpenTodos(specs.projectRoot, specs);
  const workflowState = {
    active: specs.active.length,
    todo: specs.todo.length,
    review: specs.review.length,
    done: specs.done.length,
    openTodos
  };
  const decision = statusDecision({ workflowState, projectRoot: specs.projectRoot, specsDir: specs.specsDir });
  return {
    name: APP_NAME,
    version: APP_VERSION,
    projectRoot: specs.projectRoot,
    specsDir: specs.specsDir,
    workflowState,
    nextStep: decision.nextStep,
    recommendation: publicRecommendation(decision)
  };
}

function renderStatusText(report: StatusReport): string {
  return [
    `${APP_NAME} status`,
    "",
    `Version: ${report.version}`,
    `Project: ${report.projectRoot}`,
    `Specs: ${report.specsDir}`,
    "",
    "Workflow State:",
    `  active specs: ${report.workflowState.active}`,
    `  todo specs: ${report.workflowState.todo}`,
    `  review specs: ${report.workflowState.review}`,
    `  done specs: ${report.workflowState.done}`,
    `  open TODOs: ${report.workflowState.openTodos}`,
    "",
    `Next Step: ${report.nextStep}`
  ].join("\n");
}

export async function runStatus(args: string[]): Promise<void> {
  if (hasFlag(args, "--help") || hasFlag(args, "-h")) {
    printStatusHelp();
    return;
  }
  assertKnownOptions(args, ["--project-root", "--specs-dir", "--json", "--help"]);

  const report = await statusReport(args);
  console.log(hasFlag(args, "--json") ? JSON.stringify(report, null, 2) : renderStatusText(report));
}
