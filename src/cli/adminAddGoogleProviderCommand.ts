import { AddGoogleProviderResponseSchema } from "../generated/zitadel/admin_pb.js"
import { adminAddGoogleProviderRequestParse, adminServiceAddGoogleProvider } from "../legacy_v1/addGoogleProvider.js"
import { endpointCommandBuild } from "./endpointCommandBuild.js"

/**
 * Standalone CLI command for the legacy AdminService.AddGoogleProvider endpoint.
 *
 * @deprecated Legacy v1 compatibility command.
 * @see https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.AddGoogleProvider
 */
export const adminAddGoogleProviderCommand = endpointCommandBuild({
  call: adminServiceAddGoogleProvider,
  docs: {
    brief: "Add a Google identity provider through the legacy v1 AdminService",
    fullDescription:
      "Compatibility command for ZITADEL's legacy v1 AdminService.AddGoogleProvider endpoint. Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the complete generated AddGoogleProvider protobuf JSON shape. Prefer the current ZITADEL API when an equivalent v2 operation is available. Official reference: https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.AddGoogleProvider",
  },
  operation: "adminAddGoogleProviderCommandRun",
  requestName: "AddGoogleProvider",
  requestParse: adminAddGoogleProviderRequestParse,
  responseSchema: AddGoogleProviderResponseSchema,
})
