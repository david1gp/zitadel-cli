import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddOTPSMSRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserAddOTPSMSRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserAddOTPSMSRequest = MessageInitShape<typeof AddOTPSMSRequestSchema>

export async function userAddOTPSMSRequestParse(
  options: UserAddOTPSMSRequestParseOptions = {},
): PromiseResult<UserAddOTPSMSRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userAddOTPSMSRequestParse",
    schema: AddOTPSMSRequestSchema,
  })
}
