import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { SetExecutionRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionSetExecutionRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionSetExecutionRequest = MessageInitShape<typeof SetExecutionRequestSchema>

export async function actionSetExecutionRequestParse(
  options: ActionSetExecutionRequestParseOptions = {},
): PromiseResult<ActionSetExecutionRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionSetExecutionRequestParse",
    schema: SetExecutionRequestSchema,
  })
}
