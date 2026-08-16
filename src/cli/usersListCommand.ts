import { ListUsersResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userListUsersRequestParse } from "../v2/userListUsersRequestParse.js"
import { userServiceListUsers } from "../v2/userServiceListUsers.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

export const usersListCommand = endpointCommandBuild({
  call: userServiceListUsers,
  docs: {
    brief: "List users visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListUsers protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.ListUsers",
  },
  operation: "usersListCommandRun",
  requestName: "ListUsers",
  requestParse: userListUsersRequestParse,
  responseSchema: ListUsersResponseSchema,
})
