import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListOrganizationsRequestSchema,
  type ListOrganizationsResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceListOrganizationsRequest = MessageInitShape<typeof ListOrganizationsRequestSchema>

export type OrganizationServiceListOrganizationsOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceListOrganizationsRequest
}

/**
 * Lists organizations visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizations
 */
export async function organizationServiceListOrganizations(
  options: OrganizationServiceListOrganizationsOptions = {},
): PromiseResult<ListOrganizationsResponse> {
  const op = "organizationServiceListOrganizations"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listOrganizations(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
