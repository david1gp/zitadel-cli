import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { VerifyPhoneRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserVerifyPhoneRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserVerifyPhoneRequest = MessageInitShape<typeof VerifyPhoneRequestSchema>

export async function userVerifyPhoneRequestParse(
  options: UserVerifyPhoneRequestParseOptions = {},
): PromiseResult<UserVerifyPhoneRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userVerifyPhoneRequestParse",
    schema: VerifyPhoneRequestSchema,
  })
}
