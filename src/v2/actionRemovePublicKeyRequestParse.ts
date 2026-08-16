import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemovePublicKeyRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionRemovePublicKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionRemovePublicKeyRequest = MessageInitShape<typeof RemovePublicKeyRequestSchema>

export async function actionRemovePublicKeyRequestParse(
  options: ActionRemovePublicKeyRequestParseOptions = {},
): PromiseResult<ActionRemovePublicKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionRemovePublicKeyRequestParse",
    schema: RemovePublicKeyRequestSchema,
  })
}
