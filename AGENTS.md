# AGENTS.md

Project: Spec Coding MCP

## Working Rules

1. Read `specs/` and this file before making changes.
2. Make small, focused, reversible changes.
3. Prefer simple, clear, readable, testable code.
4. Use KISS + YAGNI, Clean Code, Clean Architecture, DDD, SOLID, SoC, Fail Fast.
5. Keep dependencies pointing inward; keep domain logic independent from frameworks.
6. Prefer mature libraries over hand-rolled implementations.
7. Ask the user before unclear, risky, or high-impact decisions.
8. Update TODOs, checkpoints, and review results after each completed item.
9. Keep code organized by business meaning, not by technical clutter.
10. Preserve backward compatibility unless explicitly requested otherwise.
11. Do not mix UI, business, and data access logic in one file.
12. Do not add abstractions without clear benefit.
13. Prefer local refactors over unrelated reshuffles.
14. Keep performance and resource usage explicit.
15. Tests live in `test/`; core logic should remain easy to unit test.
16. Run `npm test` before finishing meaningful changes.
17. When publishing, keep package version, lockfile, CLI version, and server version aligned.
18. Avoid mixing UI, business, and data access in a single layer or file.
19. Avoid adding interfaces, factories, generics, or abstractions without clear value.
20. Prefer small local refactors over unrelated reformatting or reshuffling.
21. Keep complexity and resource usage explicit; do not leak connections, memory, or file handles.

## Project Notes

- Specs drive implementation, not the other way around.
- Use `spec_generate_agents` to refresh this file when project rules change.
- Use `spec_context` for non-trivial implementation work.
- Use `spec_checkpoint` or `spec_review_result` to write results back after progress.
