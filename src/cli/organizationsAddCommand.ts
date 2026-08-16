import { AddOrganizationResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationAddOrganizationRequestParse } from "../v2/organizationAddOrganizationRequestParse.js"
import { organizationServiceAddOrganization } from "../v2/organizationServiceAddOrganization.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.AddOrganization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.AddOrganization
 */
export const organizationsAddCommand = endpointCommandBuild({
  call: organizationServiceAddOrganization,
  docs: {
    brief: "Create an organization for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated AddOrganization protobuf JSON shape.",
  },
  operation: "organizationsAddCommandRun",
  requestName: "AddOrganization",
  requestParse: organizationAddOrganizationRequestParse,
  responseSchema: AddOrganizationResponseSchema,
})
