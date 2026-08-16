import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListAuthenticationFactorsRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListAuthenticationFactorsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListAuthenticationFactorsRequest = MessageInitShape<typeof ListAuthenticationFactorsRequestSchema>

export async function userListAuthenticationFactorsRequestParse(
  options: UserListAuthenticationFactorsRequestParseOptions = {},
): PromiseResult<UserListAuthenticationFactorsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListAuthenticationFactorsRequestParse",
    schema: ListAuthenticationFactorsRequestSchema,
  })
}
