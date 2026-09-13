import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  DeactivateOrganizationRequestSchema,
  type DeactivateOrganizationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceDeactivateOrganizationRequest = MessageInitShape<
  typeof DeactivateOrganizationRequestSchema
>

export type OrganizationServiceDeactivateOrganizationOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceDeactivateOrganizationRequest
}

/**
 * Deactivates an organization for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeactivateOrganization
 */
export async function organizationServiceDeactivateOrganization(
  options: OrganizationServiceDeactivateOrganizationOptions = {},
): PromiseResult<DeactivateOrganizationResponse> {
  const op = "organizationServiceDeactivateOrganization"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deactivateOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
