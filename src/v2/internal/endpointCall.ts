import type { DescMessage, DescService, MessageInitShape } from "@bufbuild/protobuf"
import { createClient, type Client, type Transport } from "@connectrpc/connect"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { ZitadelConfig } from "../../config/zitadelConfig.js"
import { zitadelConfigCreate } from "../../config/zitadelConfigCreate.js"
import { zitadelTransportCreate } from "../../transport/zitadelTransportCreate.js"

export type EndpointCallOptions = {
  readonly baseUrl?: string
  readonly config?: ZitadelConfig
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly organizationId?: string
  readonly profile?: string
  readonly project?: string
  readonly projectId?: string
  readonly token?: string
  readonly transport?: Transport
}

type EndpointCallDefinition<
  Service extends DescService,
  Request extends DescMessage,
  Response,
> = EndpointCallOptions & {
  readonly operation: string
  readonly projectIdField?: boolean
  readonly request: MessageInitShape<Request>
  readonly service: Service
  readonly invoke: (client: Client<Service>, request: MessageInitShape<Request>) => Promise<Response>
}

export async function endpointCall<Service extends DescService, Request extends DescMessage, Response>(
  definition: EndpointCallDefinition<Service, Request, Response>,
): PromiseResult<Response> {
  const configResult = await zitadelConfigCreate({
    baseUrl: definition.baseUrl,
    config: definition.config,
    env: definition.env,
    envFile: definition.envFile,
    organizationId: definition.organizationId,
    profile: definition.profile,
    project: definition.project,
    projectId: definition.projectId,
    token: definition.token,
  })
  if (!configResult.success) {
    return configResult
  }

  const transport = definition.transport ?? zitadelTransportCreate(configResult.data)
  const client = createClient(definition.service, transport)
  const request =
    definition.projectIdField === true && configResult.data.projectId !== undefined
      ? {
          ...definition.request,
          projectId:
            (definition.request as MessageInitShape<Request> & { readonly projectId?: string }).projectId ??
            configResult.data.projectId,
        }
      : definition.request

  try {
    const response = await definition.invoke(client, request)
    return createResult(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(definition.operation, message)
  }
}
