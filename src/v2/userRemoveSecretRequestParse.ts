import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveSecretRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveSecretRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveSecretRequest = MessageInitShape<typeof RemoveSecretRequestSchema>

export async function userRemoveSecretRequestParse(
  options: UserRemoveSecretRequestParseOptions = {},
): PromiseResult<UserRemoveSecretRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveSecretRequestParse",
    schema: RemoveSecretRequestSchema,
  })
}
