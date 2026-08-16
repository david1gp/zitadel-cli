import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { StartIdentityProviderIntentRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserStartIdentityProviderIntentRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserStartIdentityProviderIntentRequest = MessageInitShape<typeof StartIdentityProviderIntentRequestSchema>

export async function userStartIdentityProviderIntentRequestParse(
  options: UserStartIdentityProviderIntentRequestParseOptions = {},
): PromiseResult<UserStartIdentityProviderIntentRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userStartIdentityProviderIntentRequestParse",
    schema: StartIdentityProviderIntentRequestSchema,
  })
}
