import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ApplicationService,
  GenerateClientSecretRequestSchema,
  type GenerateClientSecretResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type ApplicationServiceGenerateClientSecretRequest = MessageInitShape<typeof GenerateClientSecretRequestSchema>

export type ApplicationServiceGenerateClientSecretOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: ApplicationServiceGenerateClientSecretRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.generateClientSecret(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
