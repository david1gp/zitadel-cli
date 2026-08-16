import type { Result } from "#result"
import { createResult, createResultError } from "#result"
import type { DescMessage, MessageShape } from "@bufbuild/protobuf"
import { toJson, toJsonString } from "@bufbuild/protobuf"
import { stringify } from "yaml"
import type { MessageOutputFormat } from "./messageOutputFormat.js"

export function messageSerialize<Desc extends DescMessage>(
  schema: Desc,
  message: MessageShape<Desc>,
  format: MessageOutputFormat = "json",
): Result<string> {
  const op = "messageSerialize"

  try {
    if (format === "json") {
      return createResult(toJsonString(schema, message, { prettySpaces: 2 }))
    }
    if (format === "yaml") {
      return createResult(stringify(toJson(schema, message)))
    }
    return createResultError(op, `Unsupported output format: ${format}`)
  } catch (error) {
    const messageText = error instanceof Error ? error.message : String(error)
    return createResultError(op, messageText)
  }
}
