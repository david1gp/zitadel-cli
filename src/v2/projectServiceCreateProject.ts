import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  CreateProjectRequestSchema,
  type CreateProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceCreateProjectRequest = MessageInitShape<typeof CreateProjectRequestSchema>

export type ProjectServiceCreateProjectOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceCreateProjectRequest
}

/**
 * Creates a project for the authenticated caller.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.CreateProject
 */
export async function projectServiceCreateProject(
  options: ProjectServiceCreateProjectOptions = {},
): PromiseResult<CreateProjectResponse> {
  const op = "projectServiceCreateProject"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createProject(request),
    operation: op,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
