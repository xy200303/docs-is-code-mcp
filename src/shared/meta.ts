/* Shared runtime metadata for the spec-coding MCP package. */
import { createRequire } from "node:module";

const requirePackageJson = createRequire(import.meta.url);
const packageJson = requirePackageJson("../../package.json") as { version: string };

export const APP_NAME = "spec-coding";
export const APP_VERSION = packageJson.version;
