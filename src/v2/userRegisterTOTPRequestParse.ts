import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RegisterTOTPRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRegisterTOTPRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRegisterTOTPRequest = MessageInitShape<typeof RegisterTOTPRequestSchema>

export async function userRegisterTOTPRequestParse(
  options: UserRegisterTOTPRequestParseOptions = {},
): PromiseResult<UserRegisterTOTPRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRegisterTOTPRequestParse",
    schema: RegisterTOTPRequestSchema,
  })
}
