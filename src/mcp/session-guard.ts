/* Session guard for the spec-coding MCP server. */
import type { SessionGuardState } from "../spec/types.js";

export const SPEC_CONTEXT_REQUIRED_MESSAGE = [
  "spec_context must be called first.",
  "This session has not read model-ready context yet.",
  "Write operations are blocked until spec_context unlocks the session."
].join(" ");

export function createSessionGuard(): SessionGuardState {
  return {
    specContextSeen: false
  };
}

export function requireSpecContext(guard: SessionGuardState): void {
  if (guard.specContextSeen) return;
  throw new Error(SPEC_CONTEXT_REQUIRED_MESSAGE);
}

export function markSpecContextSeen(guard: SessionGuardState): void {
  guard.specContextSeen = true;
}
