import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListPublicKeysRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionListPublicKeysRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionListPublicKeysRequest = MessageInitShape<typeof ListPublicKeysRequestSchema>

export async function actionListPublicKeysRequestParse(
  options: ActionListPublicKeysRequestParseOptions = {},
): PromiseResult<ActionListPublicKeysRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionListPublicKeysRequestParse",
    schema: ListPublicKeysRequestSchema,
  })
}
