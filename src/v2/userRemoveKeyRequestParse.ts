import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveKeyRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveKeyRequest = MessageInitShape<typeof RemoveKeyRequestSchema>

export async function userRemoveKeyRequestParse(
  options: UserRemoveKeyRequestParseOptions = {},
): PromiseResult<UserRemoveKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveKeyRequestParse",
    schema: RemoveKeyRequestSchema,
  })
}
