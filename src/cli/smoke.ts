import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createSpecFromPrompt, createTodoFromPrompt, generateSpecsFromSource, initSpecs, listSpecs, markSpecDone, recordSpecCheckpoint, recordSpecReviewResult, specContext } from "../spec/service.js";
import { registerTools, upsertCodexConfig, upsertOpenCodeConfig } from "./registry.js";

const root = await mkdtemp(path.join(os.tmpdir(), "spec-coding-mcp-"));

try {
  await mkdir(path.join(root, "src", "routes"), { recursive: true });
  await mkdir(path.join(root, "src", "components"), { recursive: true });
  await mkdir(path.join(root, "tests"), { recursive: true });
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({ name: "source-demo", scripts: { test: "node --test" } }, null, 2),
    "utf8"
  );
  await writeFile(
    path.join(root, "src", "routes", "users.ts"),
    [
      "import { Router } from 'express';",
      "export const router = Router();",
      "router.get('/users/:id', async (req, res) => res.json({ id: req.params.id }));"
    ].join("\n"),
    "utf8"
  );
  await writeFile(
    path.join(root, "src", "components", "UserProfile.tsx"),
    "export function UserProfile() { return <section>User</section>; }\n",
    "utf8"
  );
  await writeFile(path.join(root, "tests", "users.test.ts"), "test('users route', () => {});\n", "utf8");

  const init = await initSpecs({ projectRoot: root, specsDir: "specs", projectName: "用户系统" });
  if (!init.files.some((file) => file.path.endsWith("specs/README.md"))) {
    throw new Error("Expected spec init to create specs README.");
  }

  const generated = await generateSpecsFromSource({ projectRoot: root, specsDir: "specs", projectName: "用户系统" });
  if (!generated.source?.routeHints.length || !generated.specs.some((file) => file.includes("review"))) {
    throw new Error("Expected source generation to create review specs with route hints.");
  }

  const created = await createSpecFromPrompt({
    projectRoot: root,
    specsDir: "specs",
    title: "用户详情增加禁用态",
    prompt: "用户详情页需要展示用户是否被禁用，禁用用户不能继续发起敏感操作。"
  });
  if (!created.specs[0]?.includes("specs/active")) {
    throw new Error("Expected prompt-created spec under specs/active.");
  }

  const todo = await createTodoFromPrompt({
    projectRoot: root,
    specsDir: "specs",
    title: "用户详情 TODO",
    prompt: "补充禁用态字段\n更新用户详情测试"
  });
  if (!todo.specs[0]?.includes("specs/todo")) {
    throw new Error("Expected prompt-created TODO under specs/todo.");
  }

  const listed = await listSpecs({ projectRoot: root, specsDir: "specs" });
  if (listed.active.length !== 1 || listed.todo.length !== 1 || listed.review.length === 0) {
    throw new Error("Expected active, todo, and review specs to be listed.");
  }

  const context = await specContext({ projectRoot: root, specsDir: "specs" });
  if (
    !context.markdown.includes("用户详情增加禁用态") ||
    !context.markdown.includes("Open TODOs") ||
    !context.markdown.includes("补充禁用态字段") ||
    !context.markdown.includes("Engineering Constraints") ||
    !context.markdown.includes("不要把所有代码塞进一个文件") ||
    !context.markdown.includes("KISS（Keep It Simple, Stupid）") ||
    !context.markdown.includes("DRY（Don't Repeat Yourself）") ||
    !context.markdown.includes("Boy Scout Rule") ||
    !context.markdown.includes("Source Signals") ||
    !context.markdown.includes("package scripts") ||
    !context.markdown.includes("文件顶部必须写文件注释") ||
    !context.markdown.includes("成熟库解决的就优先使用成熟库") ||
    !context.markdown.includes("先向用户询问和确认") ||
    !context.markdown.includes("这些规则是强制约束，不是建议")
  ) {
    throw new Error("Expected spec context to include active spec text, open TODOs, and engineering constraints.");
  }

  const checkpoint = await recordSpecCheckpoint({
    projectRoot: root,
    specsDir: "specs",
    file: todo.specs[0],
    summary: "完成用户详情禁用态第一步",
    completedTodos: ["补充禁用态字段"],
    changedFiles: ["src/routes/users.ts", "tests/users.test.ts"],
    verification: [{ command: "npm test", status: "passed", note: "smoke" }],
    risks: ["禁用态敏感操作仍需后续覆盖"]
  });
  if (!checkpoint.nextSteps.some((step) => step.includes("已勾选 1 个 TODO"))) {
    throw new Error("Expected checkpoint to mark one TODO.");
  }
  const checkpointText = await readFile(path.join(root, todo.specs[0]), "utf8");
  if (!checkpointText.includes("- [x] 补充禁用态字段") || !checkpointText.includes("## Checkpoint") || !checkpointText.includes("### Summary") || !checkpointText.includes("passed `npm test`")) {
    throw new Error("Expected checkpoint to update TODO and append verification.");
  }

  const reviewResult = await recordSpecReviewResult({
    projectRoot: root,
    specsDir: "specs",
    file: todo.specs[0],
    summary: "完成禁用态第一阶段并留下后续项",
    completedTodos: ["补充禁用态字段"],
    incompleteTodos: ["更新用户详情测试"],
    changedFiles: ["src/routes/users.ts"],
    verification: [{ command: "npm test", status: "passed" }],
    blockers: ["测试覆盖待补齐"]
  });
  if (reviewResult.incompleteTodos.length !== 1 || reviewResult.completedTodos.length !== 1) {
    throw new Error("Expected review result to return structured TODO lists.");
  }
  const reviewText = await readFile(path.join(root, todo.specs[0]), "utf8");
  if (!reviewText.includes("## Review Result") || !reviewText.includes("### Incomplete TODOs") || !reviewText.includes("测试覆盖待补齐")) {
    throw new Error("Expected review result to append structured review output.");
  }

  const done = await markSpecDone({ projectRoot: root, specsDir: "specs", file: created.specs[0], note: "smoke verified" });
  if (!done.specs[0]?.includes("specs/done")) {
    throw new Error("Expected done spec to move under specs/done.");
  }

  const expectedServer = { command: process.execPath, args: [path.resolve("dist", "index.js")] };
  const codexConfig = upsertCodexConfig("[model]\nname = \"gpt-5\"\n", expectedServer);
  if (!codexConfig.includes("[mcp_servers.spec-coding]") || !codexConfig.includes(process.execPath.replace(/\\/g, "\\\\"))) {
    throw new Error("Expected Codex config upsert to add spec-coding MCP server.");
  }
  const opencodeConfig = JSON.parse(upsertOpenCodeConfig("{}", expectedServer));
  if (opencodeConfig.mcp["spec-coding"].type !== "local" || opencodeConfig.mcp["spec-coding"].command[0] !== process.execPath) {
    throw new Error("Expected OpenCode config upsert to add spec-coding MCP server.");
  }

  const registryRoot = await mkdtemp(path.join(os.tmpdir(), "spec-coding-registry-"));
  try {
    const results = await registerTools({
      tools: ["codex", "opencode"],
      paths: {
        homeDir: registryRoot,
        codexConfig: path.join(registryRoot, ".codex", "config.toml"),
        opencodeConfig: path.join(registryRoot, ".config", "opencode", "opencode.json")
      },
      server: expectedServer
    });
    if (results.some((result) => result.status !== "registered")) {
      throw new Error("Expected Codex and OpenCode registry writes to succeed.");
    }
  } finally {
    await rm(registryRoot, { recursive: true, force: true });
  }

  console.log("spec-coding MCP smoke test passed");
} finally {
  await rm(root, { recursive: true, force: true });
}
