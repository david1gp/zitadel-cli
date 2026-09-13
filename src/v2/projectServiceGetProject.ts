import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  GetProjectRequestSchema,
  type GetProjectResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceGetProjectRequest = MessageInitShape<typeof GetProjectRequestSchema>

export type ProjectServiceGetProjectOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceGetProjectRequest
}

/**
 * Returns the project identified by the requested ID.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.GetProject
 */
export async function projectServiceGetProject(
  options: ProjectServiceGetProjectOptions = {},
): PromiseResult<GetProjectResponse> {
  const op = "projectServiceGetProject"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.getProject(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
