import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListPersonalAccessTokensRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListPersonalAccessTokensRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListPersonalAccessTokensRequest = MessageInitShape<typeof ListPersonalAccessTokensRequestSchema>

export async function userListPersonalAccessTokensRequestParse(
  options: UserListPersonalAccessTokensRequestParseOptions = {},
): PromiseResult<UserListPersonalAccessTokensRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListPersonalAccessTokensRequestParse",
    schema: ListPersonalAccessTokensRequestSchema,
  })
}
