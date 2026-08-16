import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RegisterPasskeyRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRegisterPasskeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRegisterPasskeyRequest = MessageInitShape<typeof RegisterPasskeyRequestSchema>

export async function userRegisterPasskeyRequestParse(
  options: UserRegisterPasskeyRequestParseOptions = {},
): PromiseResult<UserRegisterPasskeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRegisterPasskeyRequestParse",
    schema: RegisterPasskeyRequestSchema,
  })
}
