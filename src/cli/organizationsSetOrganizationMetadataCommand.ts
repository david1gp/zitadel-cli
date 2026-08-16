import { SetOrganizationMetadataResponseSchema } from "../generated/zitadel/org/v2/org_service_pb.js"
import { organizationServiceSetOrganizationMetadata } from "../v2/organizationServiceSetOrganizationMetadata.js"
import { organizationSetOrganizationMetadataRequestParse } from "../v2/organizationSetOrganizationMetadataRequestParse.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * CLI command for OrganizationService.SetOrganizationMetadata.
 *
 * @see https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.SetOrganizationMetadata
 */
export const organizationsSetOrganizationMetadataCommand = endpointCommandBuild({
  call: organizationServiceSetOrganizationMetadata,
  docs: {
    brief: "Set organization metadata for the authenticated caller",
    fullDescription:
      "Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the generated SetOrganizationMetadata protobuf JSON shape. Metadata values must be base64 encoded. Official reference: https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.SetOrganizationMetadata",
  },
  operation: "organizationsSetOrganizationMetadataCommandRun",
  requestName: "SetOrganizationMetadata",
  requestParse: organizationSetOrganizationMetadataRequestParse,
  responseSchema: SetOrganizationMetadataResponseSchema,
})
