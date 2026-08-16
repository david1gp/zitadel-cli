import {
  ClientSecretBasic,
  ClientSecretPost,
  customFetch,
  type DeviceAuthorizationResponse,
  None,
  deviceAuthorizationRequest as oauthDeviceAuthorizationRequest,
  processDeviceAuthorizationResponse,
} from "oauth4webapi"
import { createResult, createResultError, type PromiseResult } from "#result"
import {
  type DeviceAuthorizationConfigCreateOptions,
  deviceAuthorizationConfigCreate,
} from "./deviceAuthorizationConfigCreate.js"

type DeviceAuthorizationFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

type DeviceAuthorizationRequestOptions = DeviceAuthorizationConfigCreateOptions & {
  readonly fetch?: DeviceAuthorizationFetch
}

export async function deviceAuthorizationRequest(
  options: DeviceAuthorizationRequestOptions = {},
): PromiseResult<DeviceAuthorizationResponse> {
  const op = "deviceAuthorizationRequest"
  const configResult = await deviceAuthorizationConfigCreate(options)
  if (!configResult.success) {
    return configResult
  }

  const config = configResult.data
  let endpoint: URL
  try {
    endpoint = new URL(config.deviceAuthorizationEndpoint)
  } catch {
    return createResultError(op, "deviceAuthorizationEndpoint must be a valid URL")
  }
  const parameters = new URLSearchParams(config.parameters)
  parameters.set("client_id", config.clientId)
  if (config.scope !== undefined) {
    parameters.set("scope", config.scope)
  }
  if (config.resource.length > 0) {
    parameters.delete("resource")
    for (const resource of config.resource) {
      parameters.append("resource", resource)
    }
  }
  if (config.authorizationDetails !== undefined) {
    parameters.set("authorization_details", config.authorizationDetails)
  }

  const client = { client_id: config.clientId }
  const authorizationServer = {
    device_authorization_endpoint: endpoint.href,
    issuer: config.issuer ?? endpoint.origin,
  }
  const clientAuthentication =
    config.clientAuthentication === "client_secret_basic"
      ? ClientSecretBasic(config.clientSecret as string)
      : config.clientAuthentication === "client_secret_post"
        ? ClientSecretPost(config.clientSecret as string)
        : None()
  const fetchImplementation = options.fetch ?? globalThis.fetch

  try {
    const response = await oauthDeviceAuthorizationRequest(
      authorizationServer,
      client,
      clientAuthentication,
      parameters,
      {
        [customFetch]: async (url, requestOptions) => fetchImplementation(url, requestOptions as RequestInit),
      },
    )
    const parsed = await processDeviceAuthorizationResponse(authorizationServer, client, response)
    return createResult(parsed)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
}

export type { DeviceAuthorizationFetch, DeviceAuthorizationRequestOptions }
