import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyTOTPRegistrationRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserVerifyTOTPRegistrationRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserVerifyTOTPRegistrationRequest = MessageInitShape<typeof VerifyTOTPRegistrationRequestSchema>

export async function userVerifyTOTPRegistrationRequestParse(
  options: UserVerifyTOTPRegistrationRequestParseOptions = {},
): PromiseResult<UserVerifyTOTPRegistrationRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userVerifyTOTPRegistrationRequestParse",
    schema: VerifyTOTPRegistrationRequestSchema,
  })
}
