/* Markdown front matter helpers for model/tool-readable generated documents. */

export interface MarkdownMetadata {
  name: string;
  version: string;
  title: string;
  type: string;
  status?: string;
  source?: string;
  description: string;
  category: string;
  triggers: string[];
  appliesTo: string[];
  updated: string;
}

export const MARKDOWN_METADATA_VERSION = "1.1.0";
export const MARKDOWN_METADATA_UPDATED = "2026-06-21";

function yamlList(items: string[]): string[] {
  return items.map((item) => `  - ${yamlScalar(item)}`);
}

function yamlScalar(value: string): string {
  return `'${value.replaceAll("'", "''")}'`;
}

export function markdownMetadataBlock(metadata: MarkdownMetadata): string[] {
  return [
    "---",
    `name: ${yamlScalar(metadata.name)}`,
    `version: ${yamlScalar(metadata.version)}`,
    `title: ${yamlScalar(metadata.title)}`,
    `type: ${yamlScalar(metadata.type)}`,
    ...(metadata.status ? [`status: ${yamlScalar(metadata.status)}`] : []),
    ...(metadata.source ? [`source: ${yamlScalar(metadata.source)}`] : []),
    `description: ${yamlScalar(metadata.description)}`,
    `category: ${yamlScalar(metadata.category)}`,
    "triggers:",
    ...yamlList(metadata.triggers),
    "appliesTo:",
    ...yamlList(metadata.appliesTo),
    `updated: ${yamlScalar(metadata.updated)}`,
    "---"
  ];
}

export function withMarkdownMetadata(metadata: MarkdownMetadata, bodyLines: string[]): string {
  return [
    ...markdownMetadataBlock(metadata),
    "",
    ...bodyLines
  ].join("\n");
}
