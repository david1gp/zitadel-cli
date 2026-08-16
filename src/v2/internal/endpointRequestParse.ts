import type { DescMessage, MessageInitShape } from "@bufbuild/protobuf"
import { createResult, createResultError, type PromiseResult } from "#result"
import { readFile } from "node:fs/promises"
import { messageRequestParse } from "../../request/messageRequestParse.js"

type EndpointRequestParseDefinition<Desc extends DescMessage> = {
  readonly file?: string
  readonly json?: string
  readonly operation: string
  readonly schema: Desc
}

export async function endpointRequestParse<Desc extends DescMessage>(
  definition: EndpointRequestParseDefinition<Desc>,
): PromiseResult<MessageInitShape<Desc>> {
  if (definition.json !== undefined && definition.file !== undefined) {
    return createResultError(definition.operation, "Use either --request-json or --request-file, not both")
  }

  if (definition.json === undefined && definition.file === undefined) {
    return createResult<MessageInitShape<Desc>>({} as MessageInitShape<Desc>)
  }

  let json = definition.json
  if (definition.file !== undefined) {
    try {
      json = await readFile(definition.file, "utf8")
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      return createResultError(definition.operation, `Unable to read request file "${definition.file}": ${message}`)
    }
  }

  if (json === undefined) {
    return createResultError(definition.operation, "A request JSON value is required")
  }

  const parsed = messageRequestParse(definition.schema, json)
  if (!parsed.success) {
    return parsed
  }
  return createResult(parsed.data)
}
