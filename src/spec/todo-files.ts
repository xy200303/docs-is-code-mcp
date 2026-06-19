/* TODO and markdown helpers for spec workflow documents. */
import type { TodoItem, VerificationItem } from "./types.js";

export function extractTodos(file: string, text: string): TodoItem[] {
  return text.split(/\r?\n/).flatMap((line, index) => {
    const task = /^\s*[-*]\s+\[([ xX])\]\s+(.+?)\s*$/.exec(line);
    if (task) {
      return [{
        file,
        text: task[2].trim(),
        checked: task[1].toLowerCase() === "x",
        line: index + 1
      }];
    }
    const plain = /^\s*[-*]\s+(?:TODO|todo|待办|任务)[:：]\s*(.+?)\s*$/.exec(line);
    if (plain) {
      return [{
        file,
        text: plain[1].trim(),
        checked: false,
        line: index + 1
      }];
    }
    return [];
  });
}

export function normalizeTodoText(value: string): string {
  return value
    .trim()
    .replace(/^\[[ xX]\]\s*/, "")
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function markCompletedTodos(text: string, completedTodos: string[]): { text: string; matched: string[] } {
  const pending = new Set(completedTodos.map(normalizeTodoText).filter(Boolean));
  const matched = new Set<string>();
  const lines = text.split(/\r?\n/).map((line) => {
    const task = /^(\s*[-*]\s+)\[ \](\s+)(.+?)\s*$/.exec(line);
    if (!task) return line;
    const normalized = normalizeTodoText(task[3]);
    if (!pending.has(normalized)) return line;
    matched.add(normalized);
    return `${task[1]}[x]${task[2]}${task[3].trimEnd()}`;
  });
  return { text: lines.join("\n"), matched: [...matched] };
}

export function bulletList(items: string[], empty: string): string[] {
  return items.length ? items.map((item) => `- ${item}`) : [`- ${empty}`];
}

export function verificationLines(items: VerificationItem[]): string[] {
  if (!items.length) return ["- 未记录验证命令。"];
  return items.map((item) => {
    const note = item.note?.trim() ? `：${item.note.trim()}` : "";
    return `- ${item.status} \`${item.command}\`${note}`;
  });
}
