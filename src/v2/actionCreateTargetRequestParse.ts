import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateTargetRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionCreateTargetRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionCreateTargetRequest = MessageInitShape<typeof CreateTargetRequestSchema>

export async function actionCreateTargetRequestParse(
  options: ActionCreateTargetRequestParseOptions = {},
): PromiseResult<ActionCreateTargetRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionCreateTargetRequestParse",
    schema: CreateTargetRequestSchema,
  })
}
