import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeleteOrganizationDomainRequestSchema,
  type DeleteOrganizationDomainResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceDeleteOrganizationDomainRequest = MessageInitShape<
  typeof DeleteOrganizationDomainRequestSchema
>

export type OrganizationServiceDeleteOrganizationDomainOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceDeleteOrganizationDomainRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes a domain from an organization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganizationDomain
 */
export async function organizationServiceDeleteOrganizationDomain(
  options: OrganizationServiceDeleteOrganizationDomainOptions = {},
): PromiseResult<DeleteOrganizationDomainResponse> {
  const op = "organizationServiceDeleteOrganizationDomain"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteOrganizationDomain(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
