import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RegisterU2FRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRegisterU2FRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRegisterU2FRequest = MessageInitShape<typeof RegisterU2FRequestSchema>

export async function userRegisterU2FRequestParse(
  options: UserRegisterU2FRequestParseOptions = {},
): PromiseResult<UserRegisterU2FRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRegisterU2FRequestParse",
    schema: RegisterU2FRequestSchema,
  })
}
