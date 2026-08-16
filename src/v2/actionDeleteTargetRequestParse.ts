import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteTargetRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionDeleteTargetRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionDeleteTargetRequest = MessageInitShape<typeof DeleteTargetRequestSchema>

export async function actionDeleteTargetRequestParse(
  options: ActionDeleteTargetRequestParseOptions = {},
): PromiseResult<ActionDeleteTargetRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionDeleteTargetRequestParse",
    schema: DeleteTargetRequestSchema,
  })
}
