import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  AddProjectRoleRequestSchema,
  type AddProjectRoleResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceAddProjectRoleRequest = MessageInitShape<typeof AddProjectRoleRequestSchema>

export type ProjectServiceAddProjectRoleOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceAddProjectRoleRequest
}

/**
 * Adds a role to a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.AddProjectRole
 */
export async function projectServiceAddProjectRole(
  options: ProjectServiceAddProjectRoleOptions = {},
): PromiseResult<AddProjectRoleResponse> {
  const op = "projectServiceAddProjectRole"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.addProjectRole(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
