import { ListOrganizationsResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationListOrganizationsRequestParse } from "../v2/organizationListOrganizationsRequestParse.js"
import { organizationServiceListOrganizations } from "../v2/organizationServiceListOrganizations.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.ListOrganizations.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizations
 */
export const organizationsListCommand = endpointCommandBuild({
  call: organizationServiceListOrganizations,
  docs: {
    brief: "List organizations visible to the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListOrganizations protobuf JSON shape.",
  },
  operation: "organizationsListCommandRun",
  requestName: "ListOrganizations",
  requestParse: organizationListOrganizationsRequestParse,
  responseSchema: ListOrganizationsResponseSchema,
})
