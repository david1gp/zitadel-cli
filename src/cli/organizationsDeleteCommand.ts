import { DeleteOrganizationResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationDeleteOrganizationRequestParse } from "../v2/organizationDeleteOrganizationRequestParse.js"
import { organizationServiceDeleteOrganization } from "../v2/organizationServiceDeleteOrganization.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.DeleteOrganization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganization
 */
export const organizationsDeleteCommand = endpointCommandBuild({
  call: organizationServiceDeleteOrganization,
  docs: {
    brief: "Delete an organization for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteOrganization protobuf JSON shape.",
  },
  operation: "organizationsDeleteCommandRun",
  requestName: "DeleteOrganization",
  requestParse: organizationDeleteOrganizationRequestParse,
  responseSchema: DeleteOrganizationResponseSchema,
})
