import { RemoveRecoveryCodesResponseSchema } from "../generated/zitadel/user/v2/user_service_pb.js"
import { userRemoveRecoveryCodesRequestParse } from "../v2/userRemoveRecoveryCodesRequestParse.js"
import { userServiceRemoveRecoveryCodes } from "../v2/userServiceRemoveRecoveryCodes.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

export const usersRemoveRecoveryCodesCommand = endpointCommandBuild({
  call: userServiceRemoveRecoveryCodes,
  docs: {
    brief: "Remove recovery codes from the authenticated user",
    fullDescription:
      "Removes all recovery codes from the authenticated user and disables the recovery-code second factor. Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated RemoveRecoveryCodes protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/user/zitadel.user.v2.UserService.RemoveRecoveryCodes",
  },
  operation: "usersRemoveRecoveryCodesCommandRun",
  requestName: "RemoveRecoveryCodes",
  requestParse: userRemoveRecoveryCodesRequestParse,
  responseSchema: RemoveRecoveryCodesResponseSchema,
})
