import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  CreateApplicationRequestSchema,
  type CreateApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceCreateApplicationRequest = MessageInitShape<typeof CreateApplicationRequestSchema>

export type ApplicationServiceCreateApplicationOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceCreateApplicationRequest
}

/**
 * Creates an application for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.CreateApplication
 */
export async function applicationServiceCreateApplication(
  options: ApplicationServiceCreateApplicationOptions = {},
): PromiseResult<CreateApplicationResponse> {
  const op = "applicationServiceCreateApplication"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createApplication(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
