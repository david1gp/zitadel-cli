import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveTOTPRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveTOTPRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveTOTPRequest = MessageInitShape<typeof RemoveTOTPRequestSchema>

export async function userRemoveTOTPRequestParse(
  options: UserRemoveTOTPRequestParseOptions = {},
): PromiseResult<UserRemoveTOTPRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveTOTPRequestParse",
    schema: RemoveTOTPRequestSchema,
  })
}
