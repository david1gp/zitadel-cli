import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  OrganizationService,
  VerifyOrganizationDomainRequestSchema,
  type VerifyOrganizationDomainResponse,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceVerifyOrganizationDomainRequest = MessageInitShape<
  typeof VerifyOrganizationDomainRequestSchema
>

export type OrganizationServiceVerifyOrganizationDomainOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceVerifyOrganizationDomainRequest
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
    ...options,
    invoke: (client, request) => client.verifyOrganizationDomain(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
