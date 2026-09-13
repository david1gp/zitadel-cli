import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  CreateProjectGrantRequestSchema,
  type CreateProjectGrantResponse,
  ProjectService,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceCreateProjectGrantRequest = MessageInitShape<typeof CreateProjectGrantRequestSchema>

export type ProjectServiceCreateProjectGrantOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceCreateProjectGrantRequest
}

/**
 * Grants a project to another organization.
 *
 * @see https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.CreateProjectGrant
 */
export async function projectServiceCreateProjectGrant(
  options: ProjectServiceCreateProjectGrantOptions = {},
): PromiseResult<CreateProjectGrantResponse> {
  const op = "projectServiceCreateProjectGrant"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.createProjectGrant(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
