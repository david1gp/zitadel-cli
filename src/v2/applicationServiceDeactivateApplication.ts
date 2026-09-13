import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  DeactivateApplicationRequestSchema,
  type DeactivateApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceDeactivateApplicationRequest = MessageInitShape<typeof DeactivateApplicationRequestSchema>

export type ApplicationServiceDeactivateApplicationOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceDeactivateApplicationRequest
}

/**
 * Deactivates an application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeactivateApplication
 */
export async function applicationServiceDeactivateApplication(
  options: ApplicationServiceDeactivateApplicationOptions = {},
): PromiseResult<DeactivateApplicationResponse> {
  const op = "applicationServiceDeactivateApplication"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deactivateApplication(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
