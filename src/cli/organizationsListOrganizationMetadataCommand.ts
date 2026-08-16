import { ListOrganizationMetadataResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationListOrganizationMetadataRequestParse } from "../v2/organizationListOrganizationMetadataRequestParse.js"
import { organizationServiceListOrganizationMetadata } from "../v2/organizationServiceListOrganizationMetadata.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.ListOrganizationMetadata.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizationMetadata
 */
export const organizationsListOrganizationMetadataCommand = endpointCommandBuild({
  call: organizationServiceListOrganizationMetadata,
  docs: {
    brief: "List metadata stored for an organization",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated ListOrganizationMetadata protobuf JSON shape. Official reference: https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizationMetadata",
  },
  operation: "organizationsListOrganizationMetadataCommandRun",
  requestName: "ListOrganizationMetadata",
  requestParse: organizationListOrganizationMetadataRequestParse,
  responseSchema: ListOrganizationMetadataResponseSchema,
})
