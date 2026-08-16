import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { CreateUserRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserCreateUserRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserCreateUserRequest = MessageInitShape<typeof CreateUserRequestSchema>

export async function userCreateUserRequestParse(
  options: UserCreateUserRequestParseOptions = {},
): PromiseResult<UserCreateUserRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userCreateUserRequestParse",
    schema: CreateUserRequestSchema,
  })
}
