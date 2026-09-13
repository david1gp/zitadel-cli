import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ListProjectRolesRequestSchema,
  type ListProjectRolesResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceListProjectRolesRequest = MessageInitShape<typeof ListProjectRolesRequestSchema>

export type ProjectServiceListProjectRolesOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceListProjectRolesRequest
}

/**
 * Lists project roles matching the request parameters.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ListProjectRoles
 */
export async function projectServiceListProjectRoles(
  options: ProjectServiceListProjectRolesOptions = {},
): PromiseResult<ListProjectRolesResponse> {
  const op = "projectServiceListProjectRoles"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.listProjectRoles(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
