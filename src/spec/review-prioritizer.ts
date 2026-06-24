/* Prioritize files for code review based on git change history.
 * Uses git log to extract per-file change frequency, recency, and churn metrics,
 * then computes a composite priority score so reviewers focus on the highest-risk
 * files first. */
import { runGit, relativePosix } from "../shared/utils.js";

/** Per-file change statistics extracted from git history. */
export interface FileChangeStat {
  file: string;
  /** Number of commits that touched this file. */
  commitCount: number;
  /** Days since the most recent commit that touched this file. */
  daysSinceLastChange: number;
  /** Total lines added + deleted across all commits. */
  linesChanged: number;
  /** Composite priority score (0–1, higher = review sooner). */
  score: number;
  /** File category used for risk adjustment. */
  category: FileCategory;
}

export type FileCategory = "core" | "test" | "config" | "doc" | "other";

/** Weights for the priority scoring formula. All should sum reasonably. */
export interface PriorityWeights {
  /** Weight for recency (default 0.4). Recent changes are higher risk. */
  recency: number;
  /** Weight for change frequency (default 0.35). Frequently-changed files are less stable. */
  frequency: number;
  /** Weight for churn volume (default 0.25). High-churn files need closer review. */
  churn: number;
}

export interface ReviewPrioritizeInput {
  projectRoot: string;
  /** Only consider commits within this many days (default 90). */
  days?: number;
  /** Maximum files to return (default 30). */
  maxFiles?: number;
  /** Custom weights for the scoring formula. */
  weights?: PriorityWeights;
  /** Optional path filters (e.g., ["src/", "lib/"]). */
  includePaths?: string[];
  /** Optional path patterns to exclude (e.g., ["*.test.ts", "docs/"]). */
  excludePatterns?: string[];
}

export interface ReviewPrioritizeResult {
  projectRoot: string;
  analyzedFiles: number;
  totalCommits: number;
  /** Files sorted by priority score descending. */
  prioritized: FileChangeStat[];
  /** The weights used for scoring. */
  weights: PriorityWeights;
}

const DEFAULT_WEIGHTS: PriorityWeights = { recency: 0.4, frequency: 0.35, churn: 0.25 };

const CORE_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".go", ".rs", ".py", ".java", ".kt", ".swift", ".cs", ".rb", ".php", ".dart"]);
const TEST_PATTERN = /\.(test|spec)\./i;
const CONFIG_PATTERN = /(^|\/)(\.?config|\.?env|tsconfig|package\.json|dockerfile|makefile|\.github|\.gitlab)/i;
const DOC_PATTERN = /(^|\/)(docs?|readme|changelog|license|\.md$)/i;

function categorizeFile(file: string): FileCategory {
  if (TEST_PATTERN.test(file)) return "test";
  if (CONFIG_PATTERN.test(file)) return "config";
  if (DOC_PATTERN.test(file)) return "doc";
  if (CORE_EXTS.has(file.slice(file.lastIndexOf(".")))) return "core";
  return "other";
}

function categoryBoost(category: FileCategory): number {
  switch (category) {
    case "core": return 1.2;
    case "test": return 0.7;
    case "config": return 1.0;
    case "doc": return 0.3;
    default: return 0.8;
  }
}

function daysBetween(isoDate: string, now: Date): number {
  const commitDate = new Date(isoDate);
  if (isNaN(commitDate.getTime())) return 999;
  return Math.max(0, Math.round((now.getTime() - commitDate.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * Determines if a file should be excluded based on excludePatterns.
 * Paths and patterns use forward-slash notation and match against the entire relative path.
 */
function shouldExclude(file: string, excludePatterns: string[]): boolean {
  const normalized = file.replace(/\\/g, "/");
  return excludePatterns.some((pattern) => {
    const normalizedPattern = pattern.replace(/\\/g, "/");
    if (normalizedPattern.includes("*")) {
      const regex = new RegExp("^" + normalizedPattern.replace(/\*/g, ".*") + "$", "i");
      return regex.test(normalized) || regex.test("/" + normalized);
    }
    return normalized.toLowerCase().includes(normalizedPattern.toLowerCase());
  });
}

const DEFAULT_EXCLUDES = [
  "node_modules/",
  ".git/",
  "dist/",
  "build/",
  "coverage/",
  ".next/",
  ".turbo/",
  ".cache/",
  "vendor/",
  "target/",
  ".venv/",
  "__pycache__/",
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".tmp/",
  "*.lock"
];

/**
 * Run git log --numstat to get per-file add/delete stats with commit timestamps.
 * Output format:
 *   COMMIT <hash> <iso-date>
 *   <adds>\t<dels>\t<file>
 *   ...
 */
export async function reviewPrioritize(input: ReviewPrioritizeInput): Promise<ReviewPrioritizeResult> {
  const root = input.projectRoot;
  const days = input.days ?? 90;
  const maxFiles = input.maxFiles ?? 30;
  const weights = input.weights ?? DEFAULT_WEIGHTS;
  const now = new Date();

  const args = ["log", `--since="${days} days ago"`, "--numstat", '--pretty=format:COMMIT %H %ai', "--", "."];
  const lines = await runGit(root, args);

  if (lines.length === 0) {
    return {
      projectRoot: root,
      analyzedFiles: 0,
      totalCommits: 0,
      prioritized: [],
      weights
    };
  }

  // Parse git log output into per-file stats.
  const fileStats = new Map<string, { commitCount: number; lastDate: string; linesChanged: number }>();
  let commitCount = 0;
  let currentCommitDate = "";

  for (const line of lines) {
    if (line.startsWith("COMMIT ")) {
      commitCount += 1;
      // Format: "COMMIT <hash> <iso-date>"
      currentCommitDate = line.slice(7 + 40).trim();
      continue;
    }
    // numstat line: "<adds>\t<dels>\t<file>"
    const parts = line.split("\t");
    if (parts.length < 3) continue;
    const adds = parts[0] === "-" ? 0 : parseInt(parts[0], 10);
    const dels = parts[1] === "-" ? 0 : parseInt(parts[1], 10);
    const file = parts.slice(2).join("\t").trim();
    if (!file || isNaN(adds) || isNaN(dels)) continue;

    const posixFile = file.replace(/\\/g, "/");
    const excludePatterns = [...DEFAULT_EXCLUDES, ...(input.excludePatterns ?? [])];
    if (shouldExclude(posixFile, excludePatterns)) continue;
    if (input.includePaths && input.includePaths.length > 0) {
      const normalized = input.includePaths.map((p) => p.replace(/\\/g, "/"));
      if (!normalized.some((p) => posixFile.startsWith(p))) continue;
    }

    const existing = fileStats.get(posixFile);
    if (existing) {
      existing.commitCount += 1;
      if (currentCommitDate > existing.lastDate) {
        existing.lastDate = currentCommitDate;
      }
      existing.linesChanged += adds + dels;
    } else {
      fileStats.set(posixFile, {
        commitCount: 1,
        lastDate: currentCommitDate,
        linesChanged: adds + dels
      });
    }
  }

  if (fileStats.size === 0) {
    return {
      projectRoot: root,
      analyzedFiles: 0,
      totalCommits: commitCount,
      prioritized: [],
      weights
    };
  }

  // Compute max values for normalization.
  let maxCommits = 0;
  let maxLines = 0;
  for (const stat of fileStats.values()) {
    if (stat.commitCount > maxCommits) maxCommits = stat.commitCount;
    if (stat.linesChanged > maxLines) maxLines = stat.linesChanged;
  }

  // Compute scores.
  const prioritized: FileChangeStat[] = [];
  for (const [file, stat] of fileStats) {
    const daysSinceLastChange = daysBetween(stat.lastDate, now);
    const recencyScore = 1 / (1 + daysSinceLastChange); // 1.0 for today, decays over time
    const frequencyScore = maxCommits > 0 ? stat.commitCount / maxCommits : 0;
    const churnScore = maxLines > 0 ? stat.linesChanged / maxLines : 0;
    const category = categorizeFile(file);
    const boost = categoryBoost(category);
    const rawScore = weights.recency * recencyScore + weights.frequency * frequencyScore + weights.churn * churnScore;
    // Apply category boost clamped to [0, 1].
    const score = Math.min(1, Math.max(0, rawScore * boost));
    prioritized.push({
      file,
      commitCount: stat.commitCount,
      daysSinceLastChange,
      linesChanged: stat.linesChanged,
      score: Math.round(score * 1000) / 1000,
      category
    });
  }

  prioritized.sort((a, b) => b.score - a.score);

  return {
    projectRoot: root,
    analyzedFiles: fileStats.size,
    totalCommits: commitCount,
    prioritized: prioritized.slice(0, maxFiles),
    weights
  };
}
