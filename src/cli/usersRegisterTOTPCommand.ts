import { RegisterTOTPResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRegisterTOTPRequestParse } from "../v2/userRegisterTOTPRequestParse.js"
import { userServiceRegisterTOTP } from "../v2/userServiceRegisterTOTP.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

export const usersRegisterTOTPCommand = endpointCommandBuild({
  call: userServiceRegisterTOTP,
  docs: {
    brief: "Start TOTP registration for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RegisterTOTP protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RegisterTOTP",
  },
  operation: "usersRegisterTOTPCommandRun",
  requestName: "RegisterTOTP",
  requestParse: userRegisterTOTPRequestParse,
  responseSchema: RegisterTOTPResponseSchema,
})
