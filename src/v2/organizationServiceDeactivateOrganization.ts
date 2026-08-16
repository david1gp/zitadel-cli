import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import {
  DeactivateOrganizationRequestSchema,
  type DeactivateOrganizationResponse,
  OrganizationService,
} from "../generated/zitadel/org/v2/org_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"

export type OrganizationServiceDeactivateOrganizationRequest = MessageInitShape<
  typeof DeactivateOrganizationRequestSchema
>

export type OrganizationServiceDeactivateOrganizationOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: OrganizationServiceDeactivateOrganizationRequest
  readonly token?: string
  readonly transport?: Transport
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
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.deactivateOrganization(request),
    operation: op,
    request: options.request ?? {},
    service: OrganizationService,
    token: options.token,
    transport: options.transport,
  })
}
