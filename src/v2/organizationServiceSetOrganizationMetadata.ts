import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  OrganizationService,
  SetOrganizationMetadataRequestSchema,
  type SetOrganizationMetadataResponse,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type OrganizationServiceSetOrganizationMetadataRequest = MessageInitShape<
  typeof SetOrganizationMetadataRequestSchema
>

export type OrganizationServiceSetOrganizationMetadataOptions = EndpointCallOptions & {
  readonly request?: OrganizationServiceSetOrganizationMetadataRequest
}

/**
 * Sets organization metadata for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.SetOrganizationMetadata
 */
export async function organizationServiceSetOrganizationMetadata(
  options: OrganizationServiceSetOrganizationMetadataOptions = {},
): PromiseResult<SetOrganizationMetadataResponse> {
  const op = "organizationServiceSetOrganizationMetadata"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.setOrganizationMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
