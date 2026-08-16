import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ResendEmailCodeRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserResendEmailCodeRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserResendEmailCodeRequest = MessageInitShape<typeof ResendEmailCodeRequestSchema>

export async function userResendEmailCodeRequestParse(
  options: UserResendEmailCodeRequestParseOptions = {},
): PromiseResult<UserResendEmailCodeRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userResendEmailCodeRequestParse",
    schema: ResendEmailCodeRequestSchema,
  })
}
