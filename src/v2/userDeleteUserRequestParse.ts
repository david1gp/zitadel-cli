import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeleteUserRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserDeleteUserRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserDeleteUserRequest = MessageInitShape<typeof DeleteUserRequestSchema>

export async function userDeleteUserRequestParse(
  options: UserDeleteUserRequestParseOptions = {},
): PromiseResult<UserDeleteUserRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userDeleteUserRequestParse",
    schema: DeleteUserRequestSchema,
  })
}
