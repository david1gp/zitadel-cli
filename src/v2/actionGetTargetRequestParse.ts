import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GetTargetRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionGetTargetRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionGetTargetRequest = MessageInitShape<typeof GetTargetRequestSchema>

export async function actionGetTargetRequestParse(
  options: ActionGetTargetRequestParseOptions = {},
): PromiseResult<ActionGetTargetRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionGetTargetRequestParse",
    schema: GetTargetRequestSchema,
  })
}
