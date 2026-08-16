import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddPersonalAccessTokenRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserAddPersonalAccessTokenRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserAddPersonalAccessTokenRequest = MessageInitShape<typeof AddPersonalAccessTokenRequestSchema>

export async function userAddPersonalAccessTokenRequestParse(
  options: UserAddPersonalAccessTokenRequestParseOptions = {},
): PromiseResult<UserAddPersonalAccessTokenRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userAddPersonalAccessTokenRequestParse",
    schema: AddPersonalAccessTokenRequestSchema,
  })
}
