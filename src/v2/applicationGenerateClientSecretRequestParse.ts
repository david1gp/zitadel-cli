import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import { GenerateClientSecretRequestSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointRequestParse } from "./internal/endpointRequestParse.js"

type ApplicationGenerateClientSecretRequestParseOptions = {
  readonly json?: string
  readonly file?: string
}

export type ApplicationGenerateClientSecretRequest = MessageInitShape<typeof GenerateClientSecretRequestSchema>

export async function applicationGenerateClientSecretRequestParse(
  options: ApplicationGenerateClientSecretRequestParseOptions = {},
): PromiseResult<ApplicationGenerateClientSecretRequest> {
  return endpointRequestParse({
    file: options.file,
    json: options.json,
    operation: "applicationGenerateClientSecretRequestParse",
    schema: GenerateClientSecretRequestSchema,
  })
}
