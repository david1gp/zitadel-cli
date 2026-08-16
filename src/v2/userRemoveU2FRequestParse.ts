import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveU2FRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveU2FRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveU2FRequest = MessageInitShape<typeof RemoveU2FRequestSchema>

export async function userRemoveU2FRequestParse(
  options: UserRemoveU2FRequestParseOptions = {},
): PromiseResult<UserRemoveU2FRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveU2FRequestParse",
    schema: RemoveU2FRequestSchema,
  })
}
