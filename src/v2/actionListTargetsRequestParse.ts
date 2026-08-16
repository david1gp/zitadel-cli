import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListTargetsRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionListTargetsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionListTargetsRequest = MessageInitShape<typeof ListTargetsRequestSchema>

export async function actionListTargetsRequestParse(
  options: ActionListTargetsRequestParseOptions = {},
): PromiseResult<ActionListTargetsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionListTargetsRequestParse",
    schema: ListTargetsRequestSchema,
  })
}
