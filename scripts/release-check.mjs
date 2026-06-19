/* Release readiness checks for version, CLI, MCP, and documentation contracts. */
import { readFileSync } from "node:fs";

function readText(file) {
  return readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(readText(file));
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertIncludes(text, expected, file) {
  assert(text.includes(expected), `${file} is missing: ${expected}`);
}

function appVersionFromSource(text) {
  const match = /APP_VERSION\s*=\s*"([^"]+)"/.exec(text);
  assert(match, "src/shared/meta.ts must export APP_VERSION.");
  return match[1];
}

function assertVersionContract(packageJson, packageLock, metaText) {
  const appVersion = appVersionFromSource(metaText);
  assert(packageJson.version === appVersion, "package.json version must match APP_VERSION.");
  assert(packageLock.version === packageJson.version, "package-lock.json root version must match package.json.");
  assert(packageLock.packages?.[""]?.version === packageJson.version, "package-lock package version must match package.json.");
}

function assertScriptContract(packageJson) {
  const scripts = packageJson.scripts ?? {};
  assert(scripts["release:check"] === "bun scripts/release-check.mjs", "package.json must expose release:check.");
  assert(scripts.verify === "npm run build && npm run unit && npm run smoke && npm run release:check", "package.json verify must run build, unit, smoke, and release:check.");
  assert(scripts.test === "npm run verify", "package.json test must delegate to verify.");
  assert(scripts.prepack === "npm run verify", "package.json prepack must run verify.");
}

function assertCompatibilityContract(text) {
  assertIncludes(text, "MCP_SERVER_NAME = \"spec-coding\"", "src/cli/compatibility-contract.ts");
  assertIncludes(text, "MCP_DIST_ENTRY = \"dist/index.js\"", "src/cli/compatibility-contract.ts");
  assertIncludes(text, "MCP_START_COMMAND = \"serve\"", "src/cli/compatibility-contract.ts");
  for (const tool of ["codex", "claude", "opencode", "cursor", "continue", "windsurf"]) {
    assertIncludes(text, `"${tool}"`, "src/cli/compatibility-contract.ts");
  }
}

function assertDocumentationContract(readmeText, agentsText) {
  for (const phrase of [
    "specc serve",
    "node dist/index.js serve",
    "Current Task Protocol",
    "src/templates/prompt-protocol.ts",
    "npm run release:check",
    "npm run verify"
  ]) {
    assertIncludes(readmeText, phrase, "README.md");
  }
  for (const phrase of ["Hard Rules", "Recommended Practices", "Business Confirmation Rules", "Current Task Protocol"]) {
    assertIncludes(agentsText, phrase, "AGENTS.md");
  }
}

function assertWorkflowContract(ciText, publishText) {
  assertIncludes(ciText, "uses: oven-sh/setup-bun@v2", ".github/workflows/ci.yml");
  assertIncludes(ciText, "run: npm run verify", ".github/workflows/ci.yml");
  assertIncludes(ciText, "run: npm pack --dry-run", ".github/workflows/ci.yml");
  assertIncludes(publishText, "uses: oven-sh/setup-bun@v2", ".github/workflows/publish-npm.yml");
  assertIncludes(publishText, "run: npm run verify", ".github/workflows/publish-npm.yml");
  assertIncludes(publishText, "NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}", ".github/workflows/publish-npm.yml");
  assertIncludes(publishText, "npm publish --access public", ".github/workflows/publish-npm.yml");
  assert(!publishText.includes("--provenance"), "publish workflow must use NPM_TOKEN only, without provenance/OIDC publishing.");
  assert(!publishText.includes("run: npm run smoke"), "publish workflow must use verify instead of a partial smoke-only check.");
}

const packageJson = readJson("package.json");
const packageLock = readJson("package-lock.json");
const metaText = readText("src/shared/meta.ts");
const compatibilityText = readText("src/cli/compatibility-contract.ts");
const readmeText = readText("README.md");
const agentsText = readText("AGENTS.md");
const ciText = readText(".github/workflows/ci.yml");
const publishText = readText(".github/workflows/publish-npm.yml");

assertVersionContract(packageJson, packageLock, metaText);
assertScriptContract(packageJson);
assertCompatibilityContract(compatibilityText);
assertDocumentationContract(readmeText, agentsText);
assertWorkflowContract(ciText, publishText);

console.log("spec-coding release checks passed");
