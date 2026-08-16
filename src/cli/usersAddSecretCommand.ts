import { AddSecretResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userAddSecretRequestParse } from "../v2/userAddSecretRequestParse.js"
import { userServiceAddSecret } from "../v2/userServiceAddSecret.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for UserService.AddSecret.
 *
 * @see https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddSecret
 */
export const usersAddSecretCommand = endpointCommandBuild({
  call: userServiceAddSecret,
  docs: {
    brief: "Add a client secret to a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddSecret protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.AddSecret",
  },
  operation: "usersAddSecretCommandRun",
  requestName: "AddSecret",
  requestParse: userAddSecretRequestParse,
  responseSchema: AddSecretResponseSchema,
})
