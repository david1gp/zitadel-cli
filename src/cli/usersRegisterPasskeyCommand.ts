import { RegisterPasskeyResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRegisterPasskeyRequestParse } from "../v2/userRegisterPasskeyRequestParse.js"
import { userServiceRegisterPasskey } from "../v2/userServiceRegisterPasskey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

export const usersRegisterPasskeyCommand = endpointCommandBuild({
  call: userServiceRegisterPasskey,
  docs: {
    brief: "Start passkey registration for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RegisterPasskey protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterPasskey",
  },
  operation: "usersRegisterPasskeyCommandRun",
  requestName: "RegisterPasskey",
  requestParse: userRegisterPasskeyRequestParse,
  responseSchema: RegisterPasskeyResponseSchema,
})
