import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListPasskeysRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserListPasskeysRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserListPasskeysRequest = MessageInitShape<typeof ListPasskeysRequestSchema>

export async function userListPasskeysRequestParse(
  options: UserListPasskeysRequestParseOptions = {},
): PromiseResult<UserListPasskeysRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userListPasskeysRequestParse",
    schema: ListPasskeysRequestSchema,
  })
}
