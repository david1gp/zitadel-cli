import { DeleteOrganizationDomainResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationDeleteOrganizationDomainRequestParse } from "../v2/organizationDeleteOrganizationDomainRequestParse.js"
import { organizationServiceDeleteOrganizationDomain } from "../v2/organizationServiceDeleteOrganizationDomain.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.DeleteOrganizationDomain.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganizationDomain
 */
export const organizationsDeleteOrganizationDomainCommand = endpointCommandBuild({
  call: organizationServiceDeleteOrganizationDomain,
  docs: {
    brief: "Delete a domain from an organization",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteOrganizationDomain protobuf JSON shape.",
  },
  operation: "organizationsDeleteOrganizationDomainCommandRun",
  requestName: "DeleteOrganizationDomain",
  requestParse: organizationDeleteOrganizationDomainRequestParse,
  responseSchema: DeleteOrganizationDomainResponseSchema,
})
