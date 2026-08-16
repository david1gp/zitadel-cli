import { stringify } from "yaml"
import { createResult, createResultError, type Result } from "#result"
import type { DeviceAuthorizationOutputFormat } from "./deviceAuthorizationOutputFormat.js"

export function deviceAuthorizationSerialize(
  value: unknown,
  format: DeviceAuthorizationOutputFormat = "json",
): Result<string> {
  const op = "deviceAuthorizationSerialize"

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
