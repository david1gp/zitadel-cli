import { endpointCommandBuild } from "../cli/endpointCommandBuild.js"
import { ListIDPsResponseSchema } from "../generated/zitadel/admin_pb.js"
import { adminListIDPsRequestParse } from "./adminListIDPsRequestParse.js"
import { adminServiceListIDPs } from "./listIDPs.js"

/**
 * Standalone Stricli command for the legacy AdminService v1 ListIDPs operation.
 *
 * Add this command to an application's route map when compatibility access to the legacy endpoint is required.
 *
 * @deprecated This command targets a legacy v1 endpoint and is retained for compatibility only.
 * @see https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.ListIDPs
 */
export const adminListIDPsCommand = endpointCommandBuild({
  call: adminServiceListIDPs,
  docs: {
    brief: "List identity providers through the legacy v1 compatibility API",
    fullDescription:
      "This legacy v1 command is retained for existing integrations. Configuration precedence is flag, process environment, then the explicitly selected .env file. Use --request-json or --request-file with the complete generated ListIDPs protobuf JSON shape. Prefer the current ZITADEL API when an equivalent v2 operation is available. Official reference: https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.ListIDPs",
  },
  operation: "adminListIDPsCommandRun",
  requestName: "ListIDPs",
  requestParse: adminListIDPsRequestParse,
  responseSchema: ListIDPsResponseSchema,
})
