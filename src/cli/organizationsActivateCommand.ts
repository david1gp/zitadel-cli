import { ActivateOrganizationResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationActivateOrganizationRequestParse } from "../v2/organizationActivateOrganizationRequestParse.js"
import { organizationServiceActivateOrganization } from "../v2/organizationServiceActivateOrganization.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.ActivateOrganization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ActivateOrganization
 */
export const organizationsActivateCommand = endpointCommandBuild({
  call: organizationServiceActivateOrganization,
  docs: {
    brief: "Activate an organization for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ActivateOrganization protobuf JSON shape.",
  },
  operation: "organizationsActivateCommandRun",
  requestName: "ActivateOrganization",
  requestParse: organizationActivateOrganizationRequestParse,
  responseSchema: ActivateOrganizationResponseSchema,
})
