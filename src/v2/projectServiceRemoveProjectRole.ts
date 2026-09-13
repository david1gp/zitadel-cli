import type { MessageInitShape } from "@bufbuild/protobuf"
import type { PromiseResult } from "#result"
import {
  ProjectService,
  RemoveProjectRoleRequestSchema,
  type RemoveProjectRoleResponse,
} from "../generated/zitadel/project/v2/project_service_pb.js"
import { endpointCall, type EndpointCallOptions } from "./internal/endpointCall.js"

export type ProjectServiceRemoveProjectRoleRequest = MessageInitShape<typeof RemoveProjectRoleRequestSchema>

export type ProjectServiceRemoveProjectRoleOptions = EndpointCallOptions & {
  readonly request?: ProjectServiceRemoveProjectRoleRequest
}

export async function projectServiceRemoveProjectRole(
  options: ProjectServiceRemoveProjectRoleOptions = {},
): PromiseResult<RemoveProjectRoleResponse> {
  const op = "projectServiceRemoveProjectRole"
  return endpointCall({
    ...options,
    invoke: (client, request) => client.removeProjectRole(request),
    operation: op,
    projectIdField: true,
    request: options.request ?? {},
    service: ProjectService,
    token: options.token,
    transport: options.transport,
  })
}
