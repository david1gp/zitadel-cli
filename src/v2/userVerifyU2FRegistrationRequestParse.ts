import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyU2FRegistrationRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserVerifyU2FRegistrationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserVerifyU2FRegistrationRequest = MessageInitShape<typeof VerifyU2FRegistrationRequestSchema>

export async function userVerifyU2FRegistrationRequestParse(
  options: UserVerifyU2FRegistrationRequestParseOptions = {},
): PromiseResult<UserVerifyU2FRegistrationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userVerifyU2FRegistrationRequestParse",
    schema: VerifyU2FRegistrationRequestSchema,
  })
}
