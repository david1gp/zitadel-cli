import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListProjectsRequestSchema,
  type ListProjectsResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceListProjectsRequest = MessageInitShape<typeof ListProjectsRequestSchema>

export type ProjectServiceListProjectsOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceListProjectsRequest
}

/**
 * Lists projects visible to the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjects
 */
export async function projectServiceListProjects(
  options: ProjectServiceListProjectsOptions = {},
): PromiseResult<ListProjectsResponse> {
  const op = "projectServiceListProjects"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listProjects(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
