import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GetUserByIDRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserGetUserByIDRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserGetUserByIDRequest = MessageInitShape<typeof GetUserByIDRequestSchema>

export async function userGetUserByIDRequestParse(
  options: UserGetUserByIDRequestParseOptions = {},
): PromiseResult<UserGetUserByIDRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userGetUserByIDRequestParse",
    schema: GetUserByIDRequestSchema,
  })
}
