import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyPasskeyRegistrationRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserVerifyPasskeyRegistrationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserVerifyPasskeyRegistrationRequest = MessageInitShape<typeof VerifyPasskeyRegistrationRequestSchema>

export async function userVerifyPasskeyRegistrationRequestParse(
  options: UserVerifyPasskeyRegistrationRequestParseOptions = {},
): PromiseResult<UserVerifyPasskeyRegistrationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userVerifyPasskeyRegistrationRequestParse",
    schema: VerifyPasskeyRegistrationRequestSchema,
  })
}
