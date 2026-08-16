import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddPublicKeyRequestSchema } from "../generated/zitadel/action/v2/action_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ActionAddPublicKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ActionAddPublicKeyRequest = MessageInitShape<typeof AddPublicKeyRequestSchema>

export async function actionAddPublicKeyRequestParse(
  options: ActionAddPublicKeyRequestParseOptions = {},
): PromiseResult<ActionAddPublicKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "actionAddPublicKeyRequestParse",
    schema: AddPublicKeyRequestSchema,
  })
}
