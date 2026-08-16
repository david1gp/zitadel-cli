import { GenerateRecoveryCodesResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userGenerateRecoveryCodesRequestParse } from "../v2/userGenerateRecoveryCodesRequestParse.js"
import { userServiceGenerateRecoveryCodes } from "../v2/userServiceGenerateRecoveryCodes.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

export const usersGenerateRecoveryCodesCommand = endpointCommandBuild({
  call: userServiceGenerateRecoveryCodes,
  docs: {
    brief: "Generate recovery codes for a user",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GenerateRecoveryCodes protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.GenerateRecoveryCodes",
  },
  operation: "usersGenerateRecoveryCodesCommandRun",
  requestName: "GenerateRecoveryCodes",
  requestParse: userGenerateRecoveryCodesRequestParse,
  responseSchema: GenerateRecoveryCodesResponseSchema,
})
