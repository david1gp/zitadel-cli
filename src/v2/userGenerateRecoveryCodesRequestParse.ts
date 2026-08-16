import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GenerateRecoveryCodesRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserGenerateRecoveryCodesRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserGenerateRecoveryCodesRequest = MessageInitShape<typeof GenerateRecoveryCodesRequestSchema>

export async function userGenerateRecoveryCodesRequestParse(
  options: UserGenerateRecoveryCodesRequestParseOptions = {},
): PromiseResult<UserGenerateRecoveryCodesRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userGenerateRecoveryCodesRequestParse",
    schema: GenerateRecoveryCodesRequestSchema,
  })
}
