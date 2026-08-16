import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { SetPasswordRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserSetPasswordRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserSetPasswordRequest = MessageInitShape<typeof SetPasswordRequestSchema>

export async function userSetPasswordRequestParse(
  options: UserSetPasswordRequestParseOptions = {},
): PromiseResult<UserSetPasswordRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userSetPasswordRequestParse",
    schema: SetPasswordRequestSchema,
  })
}
