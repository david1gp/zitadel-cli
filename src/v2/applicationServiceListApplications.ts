import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ApplicationService,
  ListApplicationsRequestSchema,
  type ListApplicationsResponse,
} from "../generated/zitadel/application/v2/application_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ApplicationServiceListApplicationsRequest = MessageInitShape<typeof ListApplicationsRequestSchema>

export type ApplicationServiceListApplicationsOptions = EndpointCallOptions & {
  readonly request?: ApplicationServiceListApplicationsRequest
}

/**
 * Lists applications matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.ListApplications
 */
export async function applicationServiceListApplications(
  options: ApplicationServiceListApplicationsOptions = {},
): PromiseResult<ListApplicationsResponse> {
  const op = "applicationServiceListApplications"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listApplications(request),
    operation: op,
    request: options.request ?? {},
    service: ApplicationService,
    token: options.token,
    transport: options.transport,
  })
}
