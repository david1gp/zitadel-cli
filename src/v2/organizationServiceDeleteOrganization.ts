import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeleteOrganizationRequestSchema,
  type DeleteOrganizationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceDeleteOrganizationRequest = MessageInitShape<typeof DeleteOrganizationRequestSchema>

export type OrganizationServiceDeleteOrganizationOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceDeleteOrganizationRequest
}

/**
 * Deletes an organization and all its resources for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganization
 */
export async function organizationServiceDeleteOrganization(
  options: OrganizationServiceDeleteOrganizationOptions = {},
): PromiseResult<DeleteOrganizationResponse> {
  const op = "organizationServiceDeleteOrganization"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
