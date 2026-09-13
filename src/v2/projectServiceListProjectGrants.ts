import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListProjectGrantsRequestSchema,
  type ListProjectGrantsResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceListProjectGrantsRequest = MessageInitShape<typeof ListProjectGrantsRequestSchema>

export type ProjectServiceListProjectGrantsOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceListProjectGrantsRequest
}

/**
 * Lists project grants visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjectGrants
 */
export async function projectServiceListProjectGrants(
  options: ProjectServiceListProjectGrantsOptions = {},
): PromiseResult<ListProjectGrantsResponse> {
  const op = "projectServiceListProjectGrants"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listProjectGrants(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
