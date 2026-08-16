import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ResendPhoneCodeRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserResendPhoneCodeRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserResendPhoneCodeRequest = MessageInitShape<typeof ResendPhoneCodeRequestSchema>

export async function userResendPhoneCodeRequestParse(
  options: UserResendPhoneCodeRequestParseOptions = {},
): PromiseResult<UserResendPhoneCodeRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userResendPhoneCodeRequestParse",
    schema: ResendPhoneCodeRequestSchema,
  })
}
