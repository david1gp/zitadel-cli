import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { DeactivateUserRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserDeactivateUserRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserDeactivateUserRequest = MessageInitShape<typeof DeactivateUserRequestSchema>

export async function userDeactivateUserRequestParse(
  options: UserDeactivateUserRequestParseOptions = {},
): PromiseResult<UserDeactivateUserRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userDeactivateUserRequestParse",
    schema: DeactivateUserRequestSchema,
  })
}
