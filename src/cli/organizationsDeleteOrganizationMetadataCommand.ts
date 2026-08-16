import { DeleteOrganizationMetadataResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationDeleteOrganizationMetadataRequestParse } from "../v2/organizationDeleteOrganizationMetadataRequestParse.js"
import { organizationServiceDeleteOrganizationMetadata } from "../v2/organizationServiceDeleteOrganizationMetadata.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.DeleteOrganizationMetadata.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganizationMetadata
 */
export const organizationsDeleteOrganizationMetadataCommand = endpointCommandBuild({
  call: organizationServiceDeleteOrganizationMetadata,
  docs: {
    brief: "Delete selected metadata entries from an organization",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated DeleteOrganizationMetadata protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganizationMetadata",
  },
  operation: "organizationsDeleteOrganizationMetadataCommandRun",
  requestName: "DeleteOrganizationMetadata",
  requestParse: organizationDeleteOrganizationMetadataRequestParse,
  responseSchema: DeleteOrganizationMetadataResponseSchema,
})
