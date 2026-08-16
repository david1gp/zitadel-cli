import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListAuthenticationMethodTypesRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListAuthenticationMethodTypesRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListAuthenticationMethodTypesRequest = MessageInitShape<
  typeof ListAuthenticationMethodTypesRequestSchema
>

export async function userListAuthenticationMethodTypesRequestParse(
  options: UserListAuthenticationMethodTypesRequestParseOptions = {},
): PromiseResult<UserListAuthenticationMethodTypesRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListAuthenticationMethodTypesRequestParse",
    schema: ListAuthenticationMethodTypesRequestSchema,
  })
}
