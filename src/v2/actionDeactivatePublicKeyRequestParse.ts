import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeactivatePublicKeyRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionDeactivatePublicKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionDeactivatePublicKeyRequest = MessageInitShape<typeof DeactivatePublicKeyRequestSchema>

export async function actionDeactivatePublicKeyRequestParse(
  options: ActionDeactivatePublicKeyRequestParseOptions = {},
): PromiseResult<ActionDeactivatePublicKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionDeactivatePublicKeyRequestParse",
    schema: DeactivatePublicKeyRequestSchema,
  })
}
