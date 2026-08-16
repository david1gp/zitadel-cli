import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemovePersonalAccessTokenRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemovePersonalAccessTokenRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemovePersonalAccessTokenRequest = MessageInitShape<typeof RemovePersonalAccessTokenRequestSchema>

export async function userRemovePersonalAccessTokenRequestParse(
  options: UserRemovePersonalAccessTokenRequestParseOptions = {},
): PromiseResult<UserRemovePersonalAccessTokenRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemovePersonalAccessTokenRequestParse",
    schema: RemovePersonalAccessTokenRequestSchema,
  })
}
