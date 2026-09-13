import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  DeleteApplicationRequestSchema,
  type DeleteApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceDeleteApplicationRequest = MessageInitShape<typeof DeleteApplicationRequestSchema>

export type ApplicationServiceDeleteApplicationOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceDeleteApplicationRequest
}

/**
 * Deletes an existing application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.DeleteApplication
 */
export async function applicationServiceDeleteApplication(
  options: ApplicationServiceDeleteApplicationOptions = {},
): PromiseResult<DeleteApplicationResponse> {
  const op = "applicationServiceDeleteApplication"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.deleteApplication(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
