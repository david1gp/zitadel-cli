import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveOTPSMSRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveOTPSMSRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveOTPSMSRequest = MessageInitShape<typeof RemoveOTPSMSRequestSchema>

export async function userRemoveOTPSMSRequestParse(
  options: UserRemoveOTPSMSRequestParseOptions = {},
): PromiseResult<UserRemoveOTPSMSRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveOTPSMSRequestParse",
    schema: RemoveOTPSMSRequestSchema,
  })
}
