/* Archive writer for completed specs. */
import { promises as fs } from "node:fs";
import path from "node:path";
import { resolveInsideRoot } from "./spec-files.js";
import type { SpecResult } from "./types.js";
import { nowIso, pathExists, relativePosix } from "../shared/utils.js";

async function unusedDoneFile(doneDir: string, sourceFile: string): Promise<string> {
  const parsed = path.parse(sourceFile);
  let target = path.join(doneDir, sourceFile);
  let suffix = 2;
  while (await pathExists(target)) {
    target = path.join(doneDir, `${parsed.name}-${suffix}${parsed.ext}`);
    suffix += 1;
  }
  return target;
}

export async function markSpecDone(input: { projectRoot: string; specsDir?: string; file: string; note?: string }): Promise<SpecResult> {
  const root = input.projectRoot;
  const specsDir = input.specsDir ?? "specs";
  const source = resolveInsideRoot(root, input.file, "Spec file");
  const doneDir = path.join(root, specsDir, "done");
  await fs.mkdir(doneDir, { recursive: true });
  const target = await unusedDoneFile(doneDir, path.basename(source));
  const text = await fs.readFile(source, "utf8");
  const doneText = [
    text.trimEnd(),
    "",
    "## Done",
    "",
    `- doneAt: ${nowIso()}`,
    input.note ? `- note: ${input.note}` : "- note: verified by user/Codex"
  ].join("\n");
  await fs.writeFile(target, `${doneText}\n`, "utf8");
  await fs.rm(source);
  return {
    projectRoot: root,
    specsDir,
    files: [{ path: relativePosix(root, target), status: "created" }],
    specs: [relativePosix(root, target)],
    nextSteps: ["Spec 已归档到 done/。"]
  };
}
