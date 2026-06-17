export interface GeneratedFile {
  path: string;
  status: "created" | "updated" | "skipped";
  reason?: string;
}

export interface SourceScanSummary {
  totalFiles: number;
  manifests: string[];
  apiFiles: string[];
  uiFiles: string[];
  dataFiles: string[];
  testFiles: string[];
  routeHints: string[];
  componentHints: string[];
  modelHints: string[];
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
  activeSpecs: SpecItem[];
  reviewSpecs: SpecItem[];
  selectedSpecs: Array<SpecItem & { text: string }>;
  candidateFiles: string[];
  instructions: string[];
  markdown: string;
}
