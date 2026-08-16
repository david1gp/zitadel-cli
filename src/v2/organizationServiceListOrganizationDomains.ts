import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  ListOrganizationDomainsRequestSchema,
  type ListOrganizationDomainsResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceListOrganizationDomainsRequest = MessageInitShape<
  typeof ListOrganizationDomainsRequestSchema
>

export type OrganizationServiceListOrganizationDomainsOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceListOrganizationDomainsRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Lists domains registered to an organization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizationDomains
 */
export async function organizationServiceListOrganizationDomains(
  options: OrganizationServiceListOrganizationDomainsOptions = {},
): PromiseResult<ListOrganizationDomainsResponse> {
  const op = "organizationServiceListOrganizationDomains"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.listOrganizationDomains(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
