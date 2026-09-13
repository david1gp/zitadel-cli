import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  UpdateApplicationRequestSchema,
  type UpdateApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceUpdateApplicationRequest = MessageInitShape<typeof UpdateApplicationRequestSchema>

export type ApplicationServiceUpdateApplicationOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceUpdateApplicationRequest
}

/**
 * Updates an application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.UpdateApplication
 */
export async function applicationServiceUpdateApplication(
  options: ApplicationServiceUpdateApplicationOptions = {},
): PromiseResult<UpdateApplicationResponse> {
  const op = "applicationServiceUpdateApplication"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.updateApplication(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
