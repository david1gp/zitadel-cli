import { CreateApplicationKeyResponseSchema } from "../generated/zitadel/application/v2/application_service_pb.js"
import { applicationCreateApplicationKeyRequestParse } from "../v2/applicationCreateApplicationKeyRequestParse.js"
import { applicationServiceCreateApplicationKey } from "../v2/applicationServiceCreateApplicationKey.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for ApplicationService.CreateApplicationKey.
 *
 * @see https://zitadel.com/docs/reference/api/application/zitadel.application.v2.ApplicationService.CreateApplicationKey
 */
export const applicationsCreateKeyCommand = endpointCommandBuild({
  call: applicationServiceCreateApplicationKey,
  docs: {
    brief: "Create an application key for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated CreateApplicationKey protobuf JSON shape.",
  },
  operation: "applicationsCreateKeyCommandRun",
  requestName: "CreateApplicationKey",
  requestParse: applicationCreateApplicationKeyRequestParse,
  responseSchema: CreateApplicationKeyResponseSchema,
})
