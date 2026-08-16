import { GenerateOrganizationDomainValidationResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationGenerateOrganizationDomainValidationRequestParse } from "../v2/organizationGenerateOrganizationDomainValidationRequestParse.js"
import { organizationServiceGenerateOrganizationDomainValidation } from "../v2/organizationServiceGenerateOrganizationDomainValidation.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.GenerateOrganizationDomainValidation.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.GenerateOrganizationDomainValidation
 */
export const organizationsGenerateOrganizationDomainValidationCommand = endpointCommandBuild({
  call: organizationServiceGenerateOrganizationDomainValidation,
  docs: {
    brief: "Generate a validation token for an organization's domain",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated GenerateOrganizationDomainValidation protobuf JSON shape.",
  },
  operation: "organizationsGenerateOrganizationDomainValidationCommandRun",
  requestName: "GenerateOrganizationDomainValidation",
  requestParse: organizationGenerateOrganizationDomainValidationRequestParse,
  responseSchema: GenerateOrganizationDomainValidationResponseSchema,
})
