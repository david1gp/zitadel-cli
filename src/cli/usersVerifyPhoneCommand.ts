import { VerifyPhoneResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userServiceVerifyPhone } from "../v2/userServiceVerifyPhone.js"
import { userVerifyPhoneRequestParse } from "../v2/userVerifyPhoneRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

export const usersVerifyPhoneCommand = endpointCommandBuild({
  call: userServiceVerifyPhone,
  docs: {
    brief: "Verify a user's phone number",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated VerifyPhone protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.VerifyPhone",
  },
  operation: "usersVerifyPhoneCommandRun",
  requestName: "VerifyPhone",
  requestParse: userVerifyPhoneRequestParse,
  responseSchema: VerifyPhoneResponseSchema,
})
