import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { UnlockUserRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserUnlockUserRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserUnlockUserRequest = MessageInitShape<typeof UnlockUserRequestSchema>

export async function userUnlockUserRequestParse(
  options: UserUnlockUserRequestParseOptions = {},
): PromiseResult<UserUnlockUserRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userUnlockUserRequestParse",
    schema: UnlockUserRequestSchema,
  })
}
