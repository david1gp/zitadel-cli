import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { HumanMFAInitSkippedRequestSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type UserHumanMFAInitSkippedRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type UserHumanMFAInitSkippedRequest = MessageInitShape<typeof HumanMFAInitSkippedRequestSchema>

export async function userHumanMFAInitSkippedRequestParse(
  options: UserHumanMFAInitSkippedRequestParseOptions = {},
): PromiseResult<UserHumanMFAInitSkippedRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "userHumanMFAInitSkippedRequestParse",
    schema: HumanMFAInitSkippedRequestSchema,
  })
}
