import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateInviteCodeRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserCreateInviteCodeRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserCreateInviteCodeRequest = MessageInitShape<typeof CreateInviteCodeRequestSchema>

export async function userCreateInviteCodeRequestParse(
  options: UserCreateInviteCodeRequestParseOptions = {},
): PromiseResult<UserCreateInviteCodeRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userCreateInviteCodeRequestParse",
    schema: CreateInviteCodeRequestSchema,
  })
}
