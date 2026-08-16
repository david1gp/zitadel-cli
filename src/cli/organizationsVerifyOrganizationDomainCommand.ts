import { VerifyOrganizationDomainResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationServiceVerifyOrganizationDomain } from "../v2/organizationServiceVerifyOrganizationDomain.js"
import { organizationVerifyOrganizationDomainRequestParse } from "../v2/organizationVerifyOrganizationDomainRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.VerifyOrganizationDomain.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.VerifyOrganizationDomain
 */
export const organizationsVerifyOrganizationDomainCommand = endpointCommandBuild({
  call: organizationServiceVerifyOrganizationDomain,
  docs: {
    brief: "Verify an organization's domain",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated VerifyOrganizationDomain protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.VerifyOrganizationDomain",
  },
  operation: "organizationsVerifyOrganizationDomainCommandRun",
  requestName: "VerifyOrganizationDomain",
  requestParse: organizationVerifyOrganizationDomainRequestParse,
  responseSchema: VerifyOrganizationDomainResponseSchema,
})
