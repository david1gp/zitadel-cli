import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { SendEmailCodeRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserSendEmailCodeRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserSendEmailCodeRequest = MessageInitShape<typeof SendEmailCodeRequestSchema>

export async function userSendEmailCodeRequestParse(
  options: UserSendEmailCodeRequestParseOptions = {},
): PromiseResult<UserSendEmailCodeRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userSendEmailCodeRequestParse",
    schema: SendEmailCodeRequestSchema,
  })
}
