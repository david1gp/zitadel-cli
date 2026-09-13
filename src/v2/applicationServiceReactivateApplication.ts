import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  ReactivateApplicationRequestSchema,
  type ReactivateApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceReactivateApplicationRequest = MessageInitShape<typeof ReactivateApplicationRequestSchema>

export type ApplicationServiceReactivateApplicationOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceReactivateApplicationRequest
}

/**
 * Reactivates an application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ReactivateApplication
 */
export async function applicationServiceReactivateApplication(
  options: ApplicationServiceReactivateApplicationOptions = {},
): PromiseResult<ReactivateApplicationResponse> {
  const op = "applicationServiceReactivateApplication"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.reactivateApplication(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
