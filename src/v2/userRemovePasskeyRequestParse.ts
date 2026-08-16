import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemovePasskeyRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemovePasskeyRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemovePasskeyRequest = MessageInitShape<typeof RemovePasskeyRequestSchema>

export async function userRemovePasskeyRequestParse(
  options: UserRemovePasskeyRequestParseOptions = {},
): PromiseResult<UserRemovePasskeyRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemovePasskeyRequestParse",
    schema: RemovePasskeyRequestSchema,
  })
}
