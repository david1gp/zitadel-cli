import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ProjectService,
  UpdateProjectRequestSchema,
  type UpdateProjectResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceUpdateProjectRequest = MessageInitShape<typeof UpdateProjectRequestSchema>

export type ProjectServiceUpdateProjectOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceUpdateProjectRequest
}

/**
 * Updates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.UpdateProject
 */
export async function projectServiceUpdateProject(
  options: ProjectServiceUpdateProjectOptions = {},
): PromiseResult<UpdateProjectResponse> {
  const op = "projectServiceUpdateProject"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.updateProject(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
