/* Manual version/tag release helper for the tag-triggered npm publish workflow. */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const isDryRun = args.includes("--dry-run");
const isPublish = args.includes("--publish");
const version = args.find((arg) => !arg.startsWith("--"));

function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8"));
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", shell: process.platform === "win32", ...options });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
}

function read(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8", shell: process.platform === "win32" });
  if (result.status !== 0) {
    throw new Error(`Command failed: ${command} ${args.join(" ")}`);
  }
  return result.stdout.trim();
}

function requireVersion() {
  if (!version || !/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(version)) {
    throw new Error("Usage: npm run release:manual -- <version> [--dry-run|--publish]");
  }
}

function requireMode() {
  if (isDryRun && isPublish) {
    throw new Error("Choose either --dry-run or --publish, not both.");
  }
}

function assertCleanWorktree() {
  const status = read("git", ["status", "--porcelain"]);
  if (status) {
    throw new Error("Worktree is not clean. Commit or stash changes before releasing.");
  }
}

function assertTagDoesNotExist(tag) {
  if (read("git", ["tag", "--list", tag])) {
    throw new Error(`Local tag ${tag} already exists.`);
  }
  const remote = spawnSync("git", ["ls-remote", "--exit-code", "--tags", "origin", tag], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  if (remote.status === 0) {
    throw new Error(`Remote tag ${tag} already exists.`);
  }
}

function assertNpmVersionDoesNotExist(packageName) {
  const result = spawnSync("npm", ["view", `${packageName}@${version}`, "version"], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  if (result.status === 0) {
    throw new Error(`${packageName}@${version} already exists on npm.`);
  }
}

function updateVersionFiles() {
  run("npm", ["version", version, "--no-git-tag-version"]);
  run("npm", ["install", "--package-lock-only", "--ignore-scripts"]);
}

function publishTag(tag) {
  run("npm", ["run", "verify"]);
  run("npm", ["pack", "--dry-run"]);
  run("git", ["add", "package.json", "package-lock.json"]);
  run("git", ["commit", "-m", `发布 ${version}`]);
  run("git", ["tag", tag]);
  run("git", ["push", "origin", "main"]);
  run("git", ["push", "origin", tag]);
}

requireVersion();
requireMode();

const packageJson = readJson("package.json");
const tag = `v${version}`;

assertCleanWorktree();
assertTagDoesNotExist(tag);
assertNpmVersionDoesNotExist(packageJson.name);

if (isDryRun || !isPublish) {
  console.log(`Dry run OK: ${packageJson.name}@${version} can be released as ${tag}.`);
  console.log(`Run: npm run release:manual -- ${version} --publish`);
  process.exit(0);
}

updateVersionFiles();
publishTag(tag);

console.log(`Pushed ${tag}. The Publish npm workflow will publish ${packageJson.name}@${version}.`);
