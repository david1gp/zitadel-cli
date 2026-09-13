import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  GetApplicationRequestSchema,
  type GetApplicationResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceGetApplicationRequest = MessageInitShape<typeof GetApplicationRequestSchema>

export type ApplicationServiceGetApplicationOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceGetApplicationRequest
}

/**
 * Retrieves the application matching the provided ID.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GetApplication
 */
export async function applicationServiceGetApplication(
  options: ApplicationServiceGetApplicationOptions = {},
): PromiseResult<GetApplicationResponse> {
  const op = "applicationServiceGetApplication"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.getApplication(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
