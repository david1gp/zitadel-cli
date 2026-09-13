import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  GenerateClientSecretRequestSchema,
  type GenerateClientSecretResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceGenerateClientSecretRequest = MessageInitShape<typeof GenerateClientSecretRequestSchema>

export type ApplicationServiceGenerateClientSecretOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceGenerateClientSecretRequest
}

/**
 * Generates a new client secret for an API or OIDC application.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GenerateClientSecret
 */
export async function applicationServiceGenerateClientSecret(
  options: ApplicationServiceGenerateClientSecretOptions = {},
): PromiseResult<GenerateClientSecretResponse> {
  const op = "applicationServiceGenerateClientSecret"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.generateClientSecret(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
