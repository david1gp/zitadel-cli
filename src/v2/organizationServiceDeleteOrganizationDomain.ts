import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeleteOrganizationDomainRequestSchema,
  type DeleteOrganizationDomainResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceDeleteOrganizationDomainRequest = MessageInitShape<
  typeof DeleteOrganizationDomainRequestSchema
>

export type OrganizationServiceDeleteOrganizationDomainOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceDeleteOrganizationDomainRequest
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
    ...options,
    invoke: (client, request) => client.deleteOrganizationDomain(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
