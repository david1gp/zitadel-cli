import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreatePasskeyRegistrationLinkRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserCreatePasskeyRegistrationLinkRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserCreatePasskeyRegistrationLinkRequest = MessageInitShape<
  typeof CreatePasskeyRegistrationLinkRequestSchema
>

export async function userCreatePasskeyRegistrationLinkRequestParse(
  options: UserCreatePasskeyRegistrationLinkRequestParseOptions = {},
): PromiseResult<UserCreatePasskeyRegistrationLinkRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userCreatePasskeyRegistrationLinkRequestParse",
    schema: CreatePasskeyRegistrationLinkRequestSchema,
  })
}
