import type { TokenEndpointResponse } from "oauth4webapi"
import { stringify } from "yaml"
import { createResult, createResultError, type Result } from "#result"

export type OauthTokenRequestOutputFormat = "json" | "yaml"

export function oauthTokenRequestSerialize(
  response: TokenEndpointResponse,
  format: OauthTokenRequestOutputFormat = "json",
): Result<string> {
  const op = "oauthTokenRequestSerialize"

  try {
    if (format === "json") {
      return createResult(JSON.stringify(response, null, 2))
    }
    if (format === "yaml") {
      return createResult(stringify(response))
    }
    return createResultError(op, `Unsupported output format: ${format}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
}
