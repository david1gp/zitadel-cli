import { AddOrganizationDomainResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationAddOrganizationDomainRequestParse } from "../v2/organizationAddOrganizationDomainRequestParse.js"
import { organizationServiceAddOrganizationDomain } from "../v2/organizationServiceAddOrganizationDomain.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.AddOrganizationDomain.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.AddOrganizationDomain
 */
export const organizationsAddOrganizationDomainCommand = endpointCommandBuild({
  call: organizationServiceAddOrganizationDomain,
  docs: {
    brief: "Add a domain to an organization",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddOrganizationDomain protobuf JSON shape.",
  },
  operation: "organizationsAddOrganizationDomainCommandRun",
  requestName: "AddOrganizationDomain",
  requestParse: organizationAddOrganizationDomainRequestParse,
  responseSchema: AddOrganizationDomainResponseSchema,
})
