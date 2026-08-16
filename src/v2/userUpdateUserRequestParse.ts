import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UpdateUserRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserUpdateUserRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserUpdateUserRequest = MessageInitShape<typeof UpdateUserRequestSchema>

export async function userUpdateUserRequestParse(
  options: UserUpdateUserRequestParseOptions = {},
): PromiseResult<UserUpdateUserRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userUpdateUserRequestParse",
    schema: UpdateUserRequestSchema,
  })
}
