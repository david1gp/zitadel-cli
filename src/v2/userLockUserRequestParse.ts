import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { LockUserRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserLockUserRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserLockUserRequest = MessageInitShape<typeof LockUserRequestSchema>

export async function userLockUserRequestParse(
  options: UserLockUserRequestParseOptions = {},
): PromiseResult<UserLockUserRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userLockUserRequestParse",
    schema: LockUserRequestSchema,
  })
}
