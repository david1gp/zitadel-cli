import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  AddOrganizationRequestSchema,
  type AddOrganizationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceAddOrganizationRequest = MessageInitShape<typeof AddOrganizationRequestSchema>

export type OrganizationServiceAddOrganizationOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceAddOrganizationRequest
}

/**
 * Creates an organization for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.AddOrganization
 */
export async function organizationServiceAddOrganization(
  options: OrganizationServiceAddOrganizationOptions = {},
): PromiseResult<AddOrganizationResponse> {
  const op = "organizationServiceAddOrganization"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
