import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ActivateOrganizationRequestSchema,
  type ActivateOrganizationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceActivateOrganizationRequest = MessageInitShape<typeof ActivateOrganizationRequestSchema>

export type OrganizationServiceActivateOrganizationOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceActivateOrganizationRequest
}

/**
 * Activates an organization for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ActivateOrganization
 */
export async function organizationServiceActivateOrganization(
  options: OrganizationServiceActivateOrganizationOptions = {},
): PromiseResult<ActivateOrganizationResponse> {
  const op = "organizationServiceActivateOrganization"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.activateOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
