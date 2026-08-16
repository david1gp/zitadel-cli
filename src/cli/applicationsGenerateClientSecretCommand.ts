import { GenerateClientSecretResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationGenerateClientSecretRequestParse } from "../v2/applicationGenerateClientSecretRequestParse.js"
import { applicationServiceGenerateClientSecret } from "../v2/applicationServiceGenerateClientSecret.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.GenerateClientSecret.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.GenerateClientSecret
 */
export const applicationsGenerateClientSecretCommand = endpointCommandBuild({
  call: applicationServiceGenerateClientSecret,
  docs: {
    brief: "Generate a new client secret for an API or OIDC application",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GenerateClientSecret protobuf JSON shape.",
  },
  operation: "applicationsGenerateClientSecretCommandRun",
  requestName: "GenerateClientSecret",
  requestParse: applicationGenerateClientSecretRequestParse,
  responseSchema: GenerateClientSecretResponseSchema,
})
