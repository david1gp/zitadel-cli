import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { AddOTPEmailRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserAddOTPEmailRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserAddOTPEmailRequest = MessageInitShape<typeof AddOTPEmailRequestSchema>

export async function userAddOTPEmailRequestParse(
  options: UserAddOTPEmailRequestParseOptions = {},
): PromiseResult<UserAddOTPEmailRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userAddOTPEmailRequestParse",
    schema: AddOTPEmailRequestSchema,
  })
}
