import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  OrganizationService,
  UpdateOrganizationRequestSchema,
  type UpdateOrganizationResponse,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceUpdateOrganizationRequest = MessageInitShape<typeof UpdateOrganizationRequestSchema>

export type OrganizationServiceUpdateOrganizationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceUpdateOrganizationRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.updateOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
