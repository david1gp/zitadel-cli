import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { ListApplicationsRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationListApplicationsRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationListApplicationsRequest = MessageInitShape<typeof ListApplicationsRequestSchema>

export async function applicationListApplicationsRequestParse(
  options: ApplicationListApplicationsRequestParseOptions = {},
): PromiseResult<ApplicationListApplicationsRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationListApplicationsRequestParse",
    schema: ListApplicationsRequestSchema,
  })
}
