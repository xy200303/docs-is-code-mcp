import { promises as fs } from "node:fs";
import path from "node:path";
import type { SourceScanSummary, SourceSpecCandidate } from "./types.js";
import { listTextFiles, relativePosix, slugifyAscii, unique } from "../shared/utils.js";

const DEFAULT_EXCLUDES = [
  "node_modules",
  ".git",
  ".docs-code",
  "specs",
  "docs",
  "dist",
  "build",
  "coverage",
  ".next",
  ".nuxt",
  ".turbo",
  ".cache",
  "vendor",
  "target",
  ".venv",
  "__pycache__"
];

const CODE_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".py",
  ".go",
  ".rs",
  ".java",
  ".kt",
  ".swift",
  ".cs",
  ".php",
  ".rb",
  ".sql",
  ".prisma",
  ".graphql",
  ".gql",
  ".vue",
  ".svelte",
  ".dart"
]);

const MANIFEST_NAMES = new Set([
  "package.json",
  "pnpm-workspace.yaml",
  "yarn.lock",
  "package-lock.json",
  "requirements.txt",
  "pyproject.toml",
  "go.mod",
  "cargo.toml",
  "pom.xml",
  "build.gradle",
  "settings.gradle",
  "composer.json",
  "gemfile",
  "pubspec.yaml"
]);

function normalizeLine(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function shouldIncludeSourceFile(relativeFile: string, includePatterns: string[], excludePatterns: string[]): boolean {
  const posix = relativeFile.replace(/\\/g, "/");
  if (excludePatterns.some((pattern) => posix.includes(pattern.replace(/\\/g, "/")))) return false;
  if (includePatterns.length === 0) return true;
  return includePatterns.some((pattern) => posix.includes(pattern.replace(/\\/g, "/")));
}

function classifyFile(relativeFile: string): "manifest" | "api" | "ui" | "data" | "test" | "code" | "other" {
  const lower = relativeFile.toLowerCase().replace(/\\/g, "/");
  const base = path.basename(lower);
  if (MANIFEST_NAMES.has(base)) return "manifest";
  if (/(^|\/)(__tests__|tests?|specs?|e2e)(\/|$)|\.(test|spec)\./i.test(lower)) return "test";
  if (/(route|routes|controller|controllers|api|endpoint|server|handler|resolver)/i.test(lower)) return "api";
  if (/(component|components|page|pages|screen|screens|view|views|app\/|ui\/)|\.(tsx|jsx|vue|svelte)$/i.test(lower)) return "ui";
  if (/(schema|model|models|migration|migrations|repository|repositories|entity|entities|dao|prisma|database|db\/)/i.test(lower)) return "data";
  if (CODE_EXTENSIONS.has(path.extname(lower))) return "code";
  return "other";
}

function routeHintsFromContent(relativeFile: string, content: string): string[] {
  const hints = new Set<string>();
  const routeRegexes = [
    /\b(app|router|route)\.(get|post|put|patch|delete)\s*\(\s*["'`]([^"'`]+)["'`]/gi,
    /\b(GET|POST|PUT|PATCH|DELETE)\s+([/\w:.-]+)/g,
    /@(Get|Post|Put|Patch|Delete)\s*\(\s*["'`]([^"'`]*)["'`]/gi,
    /\b(method|path)\s*:\s*["'`]([^"'`]+)["'`]/gi
  ];
  for (const regex of routeRegexes) {
    for (const match of content.matchAll(regex)) {
      hints.add(`${relativeFile} ${normalizeLine(match[0]).slice(0, 140)}`);
      if (hints.size >= 12) break;
    }
  }
  return [...hints];
}

function componentHintsFromContent(relativeFile: string, content: string): string[] {
  const hints = new Set<string>();
  const regexes = [
    /export\s+(default\s+)?function\s+([A-Z][A-Za-z0-9_]*)/g,
    /function\s+([A-Z][A-Za-z0-9_]*)\s*\(/g,
    /class\s+([A-Z][A-Za-z0-9_]*)/g,
    /name\s*:\s*["'`]([A-Z][A-Za-z0-9_-]+)["'`]/g
  ];
  for (const regex of regexes) {
    for (const match of content.matchAll(regex)) {
      hints.add(`${relativeFile} ${match[2] ?? match[1]}`);
      if (hints.size >= 12) break;
    }
  }
  return [...hints];
}

function modelHintsFromContent(relativeFile: string, content: string): string[] {
  const hints = new Set<string>();
  const regexes = [
    /\b(model|table|entity|class|interface|type)\s+([A-Z][A-Za-z0-9_]*)/g,
    /CREATE\s+TABLE\s+["`]?([A-Za-z0-9_]+)/gi,
    /\bmodel\s+([A-Z][A-Za-z0-9_]*)\s*\{/g
  ];
  for (const regex of regexes) {
    for (const match of content.matchAll(regex)) {
      hints.add(`${relativeFile} ${match[2] ?? match[1]}`);
      if (hints.size >= 12) break;
    }
  }
  return [...hints];
}

export async function scanSource(input: {
  root: string;
  includePatterns?: string[];
  excludePatterns?: string[];
  maxFiles?: number;
}): Promise<SourceScanSummary> {
  const includePatterns = input.includePatterns ?? [];
  const excludePatterns = [...DEFAULT_EXCLUDES, ...(input.excludePatterns ?? [])];
  const all = await listTextFiles(input.root, {
    maxFiles: input.maxFiles ?? 800,
    excludeDirs: excludePatterns,
    extensions: CODE_EXTENSIONS,
    includeNames: MANIFEST_NAMES
  });
  const files = all.filter((file) => shouldIncludeSourceFile(relativePosix(input.root, file), includePatterns, input.excludePatterns ?? []));
  const summary: SourceScanSummary = {
    totalFiles: files.length,
    manifests: [],
    apiFiles: [],
    uiFiles: [],
    dataFiles: [],
    testFiles: [],
    routeHints: [],
    componentHints: [],
    modelHints: []
  };

  for (const absolute of files) {
    const relative = relativePosix(input.root, absolute);
    const kind = classifyFile(relative);
    if (kind === "manifest") summary.manifests.push(relative);
    if (kind === "api") summary.apiFiles.push(relative);
    if (kind === "ui") summary.uiFiles.push(relative);
    if (kind === "data") summary.dataFiles.push(relative);
    if (kind === "test") summary.testFiles.push(relative);
    if (["api", "ui", "data", "code"].includes(kind)) {
      let content = "";
      try {
        content = await fs.readFile(absolute, "utf8");
      } catch {
        continue;
      }
      if (kind === "api" || kind === "code") summary.routeHints.push(...routeHintsFromContent(relative, content));
      if (kind === "ui" || kind === "code") summary.componentHints.push(...componentHintsFromContent(relative, content));
      if (kind === "data" || kind === "code") summary.modelHints.push(...modelHintsFromContent(relative, content));
    }
  }

  summary.manifests = unique(summary.manifests).slice(0, 30);
  summary.apiFiles = unique(summary.apiFiles).slice(0, 80);
  summary.uiFiles = unique(summary.uiFiles).slice(0, 80);
  summary.dataFiles = unique(summary.dataFiles).slice(0, 80);
  summary.testFiles = unique(summary.testFiles).slice(0, 80);
  summary.routeHints = unique(summary.routeHints).slice(0, 60);
  summary.componentHints = unique(summary.componentHints).slice(0, 60);
  summary.modelHints = unique(summary.modelHints).slice(0, 60);
  return summary;
}

function domainFromFile(file: string, fallback: string): string {
  const parts = file.split(/[\\/]/).filter(Boolean);
  const ignored = new Set(["src", "app", "pages", "components", "routes", "controllers", "api", "server", "client", "ui", "lib"]);
  const chosen = parts.find((part) => !ignored.has(part.toLowerCase()) && !part.includes("."));
  return slugifyAscii(chosen ?? fallback, fallback);
}

export function specCandidatesFromSource(summary: SourceScanSummary): SourceSpecCandidate[] {
  const candidates: SourceSpecCandidate[] = [];
  const routeGroups = new Map<string, string[]>();
  for (const hint of summary.routeHints) {
    const file = hint.split(" ")[0];
    const domain = domainFromFile(file, "api");
    const list = routeGroups.get(domain) ?? [];
    list.push(hint);
    routeGroups.set(domain, list);
  }
  for (const [domain, routes] of routeGroups) {
    const relatedFiles = unique(routes.map((item) => item.split(" ")[0]));
    candidates.push({
      domain,
      name: "api",
      title: `${domain} API 能力`,
      evidence: relatedFiles,
      routes,
      components: summary.componentHints.filter((item) => relatedFiles.some((file) => item.startsWith(file))).slice(0, 8),
      models: summary.modelHints.filter((item) => item.includes(domain)).slice(0, 8),
      tests: summary.testFiles.filter((item) => item.toLowerCase().includes(domain)).slice(0, 8)
    });
  }

  if (candidates.length === 0 && summary.uiFiles.length) {
    const domain = domainFromFile(summary.uiFiles[0], "ui");
    candidates.push({
      domain,
      name: "ui",
      title: `${domain} 界面能力`,
      evidence: summary.uiFiles.slice(0, 12),
      routes: [],
      components: summary.componentHints.slice(0, 12),
      models: [],
      tests: summary.testFiles.filter((item) => /ui|component|frontend|web/i.test(item)).slice(0, 8)
    });
  }

  if (candidates.length === 0 && summary.dataFiles.length) {
    const domain = domainFromFile(summary.dataFiles[0], "data");
    candidates.push({
      domain,
      name: "data",
      title: `${domain} 数据能力`,
      evidence: summary.dataFiles.slice(0, 12),
      routes: [],
      components: [],
      models: summary.modelHints.slice(0, 12),
      tests: summary.testFiles.filter((item) => /data|model|db|repository/i.test(item)).slice(0, 8)
    });
  }

  if (candidates.length === 0) {
    const evidence = unique([...summary.apiFiles, ...summary.uiFiles, ...summary.dataFiles]).slice(0, 12);
    candidates.push({
      domain: "core",
      name: "source-overview",
      title: "源码核心能力概览",
      evidence,
      routes: summary.routeHints.slice(0, 12),
      components: summary.componentHints.slice(0, 12),
      models: summary.modelHints.slice(0, 12),
      tests: summary.testFiles.slice(0, 8)
    });
  }

  return candidates.slice(0, 12);
}
