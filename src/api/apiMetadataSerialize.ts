import { createResult, createResultError, type Result } from "#result"
import { stringify } from "yaml"

export type ApiOutputFormat = "json" | "yaml"

export function apiMetadataSerialize(value: unknown, format: ApiOutputFormat = "json"): Result<string> {
  const op = "apiMetadataSerialize"

  try {
    if (format === "json") {
      return createResult(JSON.stringify(value, null, 2))
    }
    if (format === "yaml") {
      return createResult(stringify(value))
    }
    return createResultError(op, `Unsupported output format: ${format}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
}
