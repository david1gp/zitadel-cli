import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListOrganizationDomainsRequestSchema,
  type ListOrganizationDomainsResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceListOrganizationDomainsRequest = MessageInitShape<
  typeof ListOrganizationDomainsRequestSchema
>

export type OrganizationServiceListOrganizationDomainsOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceListOrganizationDomainsRequest
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
    ...options,
    invoke: (client, request) => client.listOrganizationDomains(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
