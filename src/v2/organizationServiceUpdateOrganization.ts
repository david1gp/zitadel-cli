import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  OrganizationService,
  UpdateOrganizationRequestSchema,
  type UpdateOrganizationResponse,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceUpdateOrganizationRequest = MessageInitShape<typeof UpdateOrganizationRequestSchema>

export type OrganizationServiceUpdateOrganizationOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceUpdateOrganizationRequest
}

/**
 * Updates an organization for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.UpdateOrganization
 */
export async function organizationServiceUpdateOrganization(
  options: OrganizationServiceUpdateOrganizationOptions = {},
): PromiseResult<UpdateOrganizationResponse> {
  const op = "organizationServiceUpdateOrganization"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.updateOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
