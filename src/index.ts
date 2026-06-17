#!/usr/bin/env node
import { runCli } from "./cli/main.js";

runCli(process.argv).catch((error) => {
  console.error("spec-coding fatal error:", error);
  process.exit(1);
});
