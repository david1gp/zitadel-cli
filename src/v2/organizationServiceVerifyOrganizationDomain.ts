import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  OrganizationService,
  VerifyOrganizationDomainRequestSchema,
  type VerifyOrganizationDomainResponse,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceVerifyOrganizationDomainRequest = MessageInitShape<
  typeof VerifyOrganizationDomainRequestSchema
>

export type OrganizationServiceVerifyOrganizationDomainOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceVerifyOrganizationDomainRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Verifies an organization's domain using its configured HTTP or DNS challenge.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.VerifyOrganizationDomain
 */
export async function organizationServiceVerifyOrganizationDomain(
  options: OrganizationServiceVerifyOrganizationDomainOptions = {},
): PromiseResult<VerifyOrganizationDomainResponse> {
  const op = "organizationServiceVerifyOrganizationDomain"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.verifyOrganizationDomain(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
