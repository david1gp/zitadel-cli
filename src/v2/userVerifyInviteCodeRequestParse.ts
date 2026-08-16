import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyInviteCodeRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserVerifyInviteCodeRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserVerifyInviteCodeRequest = MessageInitShape<typeof VerifyInviteCodeRequestSchema>

export async function userVerifyInviteCodeRequestParse(
  options: UserVerifyInviteCodeRequestParseOptions = {},
): PromiseResult<UserVerifyInviteCodeRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userVerifyInviteCodeRequestParse",
    schema: VerifyInviteCodeRequestSchema,
  })
}
