import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  OrganizationService,
  SetOrganizationMetadataRequestSchema,
  type SetOrganizationMetadataResponse,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceSetOrganizationMetadataRequest = MessageInitShape<
  typeof SetOrganizationMetadataRequestSchema
>

export type OrganizationServiceSetOrganizationMetadataOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceSetOrganizationMetadataRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.setOrganizationMetadata(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
