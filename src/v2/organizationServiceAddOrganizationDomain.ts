import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  AddOrganizationDomainRequestSchema,
  type AddOrganizationDomainResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceAddOrganizationDomainRequest = MessageInitShape<
  typeof AddOrganizationDomainRequestSchema
>

export type OrganizationServiceAddOrganizationDomainOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceAddOrganizationDomainRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Adds a domain to an organization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.AddOrganizationDomain
 */
export async function organizationServiceAddOrganizationDomain(
  options: OrganizationServiceAddOrganizationDomainOptions = {},
): PromiseResult<AddOrganizationDomainResponse> {
  const op = "organizationServiceAddOrganizationDomain"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.addOrganizationDomain(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
