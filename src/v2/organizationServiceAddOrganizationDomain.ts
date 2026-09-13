import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  AddOrganizationDomainRequestSchema,
  type AddOrganizationDomainResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceAddOrganizationDomainRequest = MessageInitShape<
  typeof AddOrganizationDomainRequestSchema
>

export type OrganizationServiceAddOrganizationDomainOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceAddOrganizationDomainRequest
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
    ...options,
    invoke: (client, request) => client.addOrganizationDomain(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
