import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddKeyRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserAddKeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserAddKeyRequest = MessageInitShape<typeof AddKeyRequestSchema>

export async function userAddKeyRequestParse(
  options: UserAddKeyRequestParseOptions = {},
): PromiseResult<UserAddKeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userAddKeyRequestParse",
    schema: AddKeyRequestSchema,
  })
}
