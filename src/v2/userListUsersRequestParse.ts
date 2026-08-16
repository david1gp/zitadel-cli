import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListUsersRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListUsersRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListUsersRequest = MessageInitShape<typeof ListUsersRequestSchema>

export async function userListUsersRequestParse(
  options: UserListUsersRequestParseOptions = {},
): PromiseResult<UserListUsersRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListUsersRequestParse",
    schema: ListUsersRequestSchema,
  })
}
