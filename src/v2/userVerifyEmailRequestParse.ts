import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyEmailRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserVerifyEmailRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserVerifyEmailRequest = MessageInitShape<typeof VerifyEmailRequestSchema>

export async function userVerifyEmailRequestParse(
  options: UserVerifyEmailRequestParseOptions = {},
): PromiseResult<UserVerifyEmailRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userVerifyEmailRequestParse",
    schema: VerifyEmailRequestSchema,
  })
}
