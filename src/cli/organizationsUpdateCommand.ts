import { UpdateOrganizationResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationServiceUpdateOrganization } from "../v2/organizationServiceUpdateOrganization.js"
import { organizationUpdateOrganizationRequestParse } from "../v2/organizationUpdateOrganizationRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.UpdateOrganization.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.UpdateOrganization
 */
export const organizationsUpdateCommand = endpointCommandBuild({
  call: organizationServiceUpdateOrganization,
  docs: {
    brief: "Update an organization for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated UpdateOrganization protobuf JSON shape.",
  },
  operation: "organizationsUpdateCommandRun",
  requestName: "UpdateOrganization",
  requestParse: organizationUpdateOrganizationRequestParse,
  responseSchema: UpdateOrganizationResponseSchema,
})
