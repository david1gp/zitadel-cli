import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RetrieveIdentityProviderIntentRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRetrieveIdentityProviderIntentRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRetrieveIdentityProviderIntentRequest = MessageInitShape<
  typeof RetrieveIdentityProviderIntentRequestSchema
>

export async function userRetrieveIdentityProviderIntentRequestParse(
  options: UserRetrieveIdentityProviderIntentRequestParseOptions = {},
): PromiseResult<UserRetrieveIdentityProviderIntentRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRetrieveIdentityProviderIntentRequestParse",
    schema: RetrieveIdentityProviderIntentRequestSchema,
  })
}
