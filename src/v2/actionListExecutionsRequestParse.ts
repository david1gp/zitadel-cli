import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListExecutionsRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionListExecutionsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionListExecutionsRequest = MessageInitShape<typeof ListExecutionsRequestSchema>

export async function actionListExecutionsRequestParse(
  options: ActionListExecutionsRequestParseOptions = {},
): PromiseResult<ActionListExecutionsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionListExecutionsRequestParse",
    schema: ListExecutionsRequestSchema,
  })
}
