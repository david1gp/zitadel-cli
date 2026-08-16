import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { RemoveRecoveryCodesRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserRemoveRecoveryCodesRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserRemoveRecoveryCodesRequest = MessageInitShape<typeof RemoveRecoveryCodesRequestSchema>

export async function userRemoveRecoveryCodesRequestParse(
  options: UserRemoveRecoveryCodesRequestParseOptions = {},
): PromiseResult<UserRemoveRecoveryCodesRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userRemoveRecoveryCodesRequestParse",
    schema: RemoveRecoveryCodesRequestSchema,
  })
}
