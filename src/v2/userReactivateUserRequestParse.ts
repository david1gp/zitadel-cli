import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ReactivateUserRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserReactivateUserRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserReactivateUserRequest = MessageInitShape<typeof ReactivateUserRequestSchema>

export async function userReactivateUserRequestParse(
  options: UserReactivateUserRequestParseOptions = {},
): PromiseResult<UserReactivateUserRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userReactivateUserRequestParse",
    schema: ReactivateUserRequestSchema,
  })
}
