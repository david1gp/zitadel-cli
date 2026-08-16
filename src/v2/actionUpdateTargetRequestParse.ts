import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateTargetRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionUpdateTargetRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionUpdateTargetRequest = MessageInitShape<typeof UpdateTargetRequestSchema>

export async function actionUpdateTargetRequestParse(
  options: ActionUpdateTargetRequestParseOptions = {},
): PromiseResult<ActionUpdateTargetRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionUpdateTargetRequestParse",
    schema: UpdateTargetRequestSchema,
  })
}
