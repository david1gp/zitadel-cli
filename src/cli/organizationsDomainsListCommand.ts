import { ListOrganizationDomainsResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationListOrganizationDomainsRequestParse } from "../v2/organizationListOrganizationDomainsRequestParse.js"
import { organizationServiceListOrganizationDomains } from "../v2/organizationServiceListOrganizationDomains.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.ListOrganizationDomains.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizationDomains
 */
export const organizationsDomainsListCommand = endpointCommandBuild({
  call: organizationServiceListOrganizationDomains,
  docs: {
    brief: "List domains registered to an organization",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListOrganizationDomains protobuf JSON shape.",
  },
  operation: "organizationsDomainsListCommandRun",
  requestName: "ListOrganizationDomains",
  requestParse: organizationListOrganizationDomainsRequestParse,
  responseSchema: ListOrganizationDomainsResponseSchema,
})
