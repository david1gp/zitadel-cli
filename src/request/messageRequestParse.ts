import type { Result } from "#result"
import { createResult, createResultError } from "#result"
import { fromJsonString, type DescMessage, type MessageShape } from "@bufbuild/protobuf"

export function messageRequestParse<Desc extends DescMessage>(schema: Desc, json: string): Result<MessageShape<Desc>> {
  const op = "messageRequestParse"

  try {
    return createResult(fromJsonString(schema, json))
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
}
