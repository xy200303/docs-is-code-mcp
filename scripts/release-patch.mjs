/* One-command patch release helper that verifies, versions, tags, and pushes safely. */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const isPublishing = process.argv.includes("--publish");

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

function assertCleanWorktree() {
  const status = read("git", ["status", "--porcelain"]);
  if (status) {
    throw new Error("Worktree is not clean. Commit or stash changes before running release:patch.");
  }
}

function nextPatchVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Only stable x.y.z versions can be patch-released automatically: ${version}`);
  }
  return `${match[1]}.${match[2]}.${Number(match[3]) + 1}`;
}

function assertTagDoesNotExist(tag) {
  const localTags = read("git", ["tag", "--list", tag]);
  if (localTags) {
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

function assertNpmVersionDoesNotExist(packageName, version) {
  const result = spawnSync("npm", ["view", `${packageName}@${version}`, "version"], {
    encoding: "utf8",
    shell: process.platform === "win32"
  });
  if (result.status === 0) {
    throw new Error(`${packageName}@${version} already exists on npm.`);
  }
}

function updateVersion(version) {
  run("npm", ["version", version, "--no-git-tag-version"]);
  run("npm", ["install", "--package-lock-only", "--ignore-scripts"]);
}

function publishVersion(version, tag) {
  run("git", ["add", "package.json", "package-lock.json"]);
  run("git", ["commit", "-m", `发布 ${version}`]);
  run("git", ["tag", tag]);
  run("git", ["push", "origin", "HEAD"]);
  run("git", ["push", "origin", tag]);
}

const packageJson = readJson("package.json");
const version = nextPatchVersion(packageJson.version);
const tag = `v${version}`;

assertCleanWorktree();
assertTagDoesNotExist(tag);
assertNpmVersionDoesNotExist(packageJson.name, version);

if (!isPublishing) {
  console.log(`Dry run OK: next patch release would be ${version} (${tag}).`);
  console.log("Run `npm run release:patch -- --publish` to version, verify, commit, tag, and push.");
  process.exit(0);
}

updateVersion(version);
run("npm", ["run", "verify"]);
run("npm", ["pack", "--dry-run"]);
publishVersion(version, tag);

console.log(`Published release tag ${tag}. GitHub Actions will publish ${packageJson.name}@${version} to npm.`);
