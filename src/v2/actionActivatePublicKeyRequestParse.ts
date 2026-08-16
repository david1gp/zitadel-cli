import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ActivatePublicKeyRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionActivatePublicKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionActivatePublicKeyRequest = MessageInitShape<typeof ActivatePublicKeyRequestSchema>

export async function actionActivatePublicKeyRequestParse(
  options: ActionActivatePublicKeyRequestParseOptions = {},
): PromiseResult<ActionActivatePublicKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionActivatePublicKeyRequestParse",
    schema: ActivatePublicKeyRequestSchema,
  })
}
