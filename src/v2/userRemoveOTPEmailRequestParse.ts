import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveOTPEmailRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveOTPEmailRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveOTPEmailRequest = MessageInitShape<typeof RemoveOTPEmailRequestSchema>

export async function userRemoveOTPEmailRequestParse(
  options: UserRemoveOTPEmailRequestParseOptions = {},
): PromiseResult<UserRemoveOTPEmailRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveOTPEmailRequestParse",
    schema: RemoveOTPEmailRequestSchema,
  })
}
