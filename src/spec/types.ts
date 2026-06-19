export interface GeneratedFile {
  path: string;
  status: "created" | "updated" | "skipped";
  reason?: string;
}

export interface SourceScanSummary {
  totalFiles: number;
  manifests: string[];
  packageScripts: string[];
  apiFiles: string[];
  uiFiles: string[];
  dataFiles: string[];
  testFiles: string[];
  routeHints: string[];
  componentHints: string[];
  modelHints: string[];
  exportHints: string[];
  importHints: string[];
  referenceHints: string[];
}

export interface SourceSpecCandidate {
  domain: string;
  name: string;
  title: string;
  evidence: string[];
  routes: string[];
  components: string[];
  models: string[];
  tests: string[];
}

export interface SpecResult {
  projectRoot: string;
  specsDir: string;
  files: GeneratedFile[];
  specs: string[];
  nextSteps: string[];
  source?: SourceScanSummary;
}

export interface TodoItem {
  file: string;
  text: string;
  checked: boolean;
  line: number;
}

export interface VerificationItem {
  command: string;
  status: "passed" | "failed" | "not-run";
  note?: string;
}

export interface TodoResult {
  task: string;
  status: "done" | "blocked";
  note?: string;
  verificationCommands?: string[];
  relatedFiles?: string[];
  blocker?: string;
}

export interface SpecItem {
  file: string;
  title: string;
  status: string;
  source: string;
  updatedAt?: string;
}

export interface SpecContext {
  projectRoot: string;
  specsDir: string;
  source?: SourceScanSummary;
  activeSpecs: SpecItem[];
  reviewSpecs: SpecItem[];
  todoSpecs: SpecItem[];
  selectedSpecs: Array<SpecItem & { text: string }>;
  todos: TodoItem[];
  candidateFiles: string[];
  instructions: string[];
  markdown: string;
}

export interface ReviewResult {
  file: string;
  summary: string;
  completedTodos: string[];
  incompleteTodos: string[];
  verification: VerificationItem[];
  changedFiles: string[];
  risks: string[];
  blockers: string[];
}
