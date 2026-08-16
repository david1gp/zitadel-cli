import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListKeysRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListKeysRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListKeysRequest = MessageInitShape<typeof ListKeysRequestSchema>

export async function userListKeysRequestParse(
  options: UserListKeysRequestParseOptions = {},
): PromiseResult<UserListKeysRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListKeysRequestParse",
    schema: ListKeysRequestSchema,
  })
}
