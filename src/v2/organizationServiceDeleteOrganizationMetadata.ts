import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeleteOrganizationMetadataRequestSchema,
  type DeleteOrganizationMetadataResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceDeleteOrganizationMetadataRequest = MessageInitShape<
  typeof DeleteOrganizationMetadataRequestSchema
>

export type OrganizationServiceDeleteOrganizationMetadataOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceDeleteOrganizationMetadataRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Deletes selected metadata entries from an organization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganizationMetadata
 */
export async function organizationServiceDeleteOrganizationMetadata(
  options: OrganizationServiceDeleteOrganizationMetadataOptions = {},
): PromiseResult<DeleteOrganizationMetadataResponse> {
  const op = "organizationServiceDeleteOrganizationMetadata"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deleteOrganizationMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
