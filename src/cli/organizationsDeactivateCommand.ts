import { DeactivateOrganizationResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationDeactivateOrganizationRequestParse } from "../v2/organizationDeactivateOrganizationRequestParse.js"
import { organizationServiceDeactivateOrganization } from "../v2/organizationServiceDeactivateOrganization.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.DeactivateOrganization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeactivateOrganization
 */
export const organizationsDeactivateCommand = endpointCommandBuild({
  call: organizationServiceDeactivateOrganization,
  docs: {
    brief: "Deactivate an organization for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeactivateOrganization protobuf JSON shape.",
  },
  operation: "organizationsDeactivateCommandRun",
  requestName: "DeactivateOrganization",
  requestParse: organizationDeactivateOrganizationRequestParse,
  responseSchema: DeactivateOrganizationResponseSchema,
})
