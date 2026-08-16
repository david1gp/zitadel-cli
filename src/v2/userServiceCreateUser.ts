import type { MessageInitShape } from "@bufbuild/protobuf"
import type { Transport } from "@connectrpc/connect"
import type { PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { CreateUserRequestSchema, type CreateUserResponse } from "../generated/zitadel/user/v2/user_service_pb.js"
import { endpointCall } from "./internal/endpointCall.js"
import { UserService } from "./userService.js"

export type UserServiceCreateUserRequest = MessageInitShape<typeof CreateUserRequestSchema>

export type UserServiceCreateUserOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly request?: UserServiceCreateUserRequest
  readonly token?: string
  readonly transport?: Transport
}

/**
 * Creates a user or service account in the specified organization.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.CreateUser
 */
export async function userServiceCreateUser(
  options: UserServiceCreateUserOptions = {},
): PromiseResult<CreateUserResponse> {
  const op = "userServiceCreateUser"
  return endpointCall({
    baseUrl: options.baseUrl,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    invoke: (client, request) => client.createUser(request),
    operation: op,
    request: options.request ?? {},
    service: UserService,
    token: options.token,
    transport: options.transport,
  })
}
