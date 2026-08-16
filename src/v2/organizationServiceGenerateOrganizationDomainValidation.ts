import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  GenerateOrganizationDomainValidationRequestSchema,
  type GenerateOrganizationDomainValidationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceGenerateOrganizationDomainValidationRequest = MessageInitShape<
  typeof GenerateOrganizationDomainValidationRequestSchema
>

export type OrganizationServiceGenerateOrganizationDomainValidationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceGenerateOrganizationDomainValidationRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Generates a validation token for an organization's domain.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.GenerateOrganizationDomainValidation
 */
export async function organizationServiceGenerateOrganizationDomainValidation(
  options: OrganizationServiceGenerateOrganizationDomainValidationOptions = {},
): PromiseResult<GenerateOrganizationDomainValidationResponse> {
  const op = "organizationServiceGenerateOrganizationDomainValidation"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.generateOrganizationDomainValidation(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
