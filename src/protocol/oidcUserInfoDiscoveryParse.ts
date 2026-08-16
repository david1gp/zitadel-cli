import { readFile } from "node:fs/promises"
import type { AuthorizationServer } from "oauth4webapi"
import { createResult, createResultError, type PromiseResult } from "#result"

type OidcUserInfoDiscoveryParseOptions = {
  readonly file?: string
  readonly json?: string
}

export async function oidcUserInfoDiscoveryParse(
  options: OidcUserInfoDiscoveryParseOptions = {},
): PromiseResult<AuthorizationServer> {
  const op = "oidcUserInfoDiscoveryParse"
  if (options.json !== undefined && options.file !== undefined) {
    return createResultError(op, "Use either --discovery-json or --discovery-file, not both")
  }
  if (options.json === undefined && options.file === undefined) {
    return createResultError(op, "A validated discovery JSON value is required")
  }

  let json = options.json
  if (options.file !== undefined) {
    try {
      json = await readFile(options.file, "utf8")
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return createResultError(op, `Unable to read discovery file "${options.file}": ${message}`)
    }
  }
  if (json === undefined) {
    return createResultError(op, "A validated discovery JSON value is required")
  }

  try {
    const parsed: unknown = JSON.parse(json)
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      return createResultError(op, "Discovery JSON must be an object")
    }
    return createResult(parsed as AuthorizationServer)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, `Invalid discovery JSON: ${message}`)
  }
}
