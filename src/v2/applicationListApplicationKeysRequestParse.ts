import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListApplicationKeysRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationListApplicationKeysRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationListApplicationKeysRequest = MessageInitShape<typeof ListApplicationKeysRequestSchema>

export async function applicationListApplicationKeysRequestParse(
  options: ApplicationListApplicationKeysRequestParseOptions = {},
): PromiseResult<ApplicationListApplicationKeysRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationListApplicationKeysRequestParse",
    schema: ListApplicationKeysRequestSchema,
  })
}
