import type { TokenEndpointResponse } from "oauth4webapi"
import * as oauth from "oauth4webapi"
import * as v from "valibot"
import { createResult, createResultError, type PromiseResult, type Result } from "#result"
import {
  type OauthTokenRequestClientAuthentication,
  type OauthTokenRequestConfig,
  oauthTokenRequestConfigCreate,
} from "./oauthTokenRequestConfigCreate.js"

const oauthTokenRequestDiscoverySchema = v.object({
  issuer: v.pipe(v.string(), v.minLength(1), v.url()),
  token_endpoint: v.pipe(v.string(), v.minLength(1), v.url()),
})

export type OauthTokenRequestParameters =
  | Readonly<Record<string, string>>
  | ReadonlyArray<readonly [string, string]>
  | URLSearchParams

export type OauthTokenRequestOptions = {
  readonly allowInsecureRequests?: boolean
  readonly baseUrl?: string
  readonly clientAuth?: OauthTokenRequestClientAuthentication
  readonly clientAuthentication?: oauth.ClientAuth
  readonly clientId?: string
  readonly clientSecret?: string
  readonly config?: OauthTokenRequestConfig
  readonly discovery?: unknown
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL, init?: RequestInit) => Promise<Response>
  readonly grantType?: string
  readonly headers?: RequestInit["headers"]
  readonly issuer?: string
  readonly parameters?: OauthTokenRequestParameters
  readonly signal?: AbortSignal
}

type OauthTokenRequestFetch = (
  url: string,
  options: oauth.CustomFetchOptions<string, URLSearchParams | undefined>,
) => Promise<Response>

const oauthTokenRequestParametersCreate = (parameters: OauthTokenRequestParameters | undefined): URLSearchParams => {
  if (parameters === undefined) {
    return new URLSearchParams()
  }
  if (parameters instanceof URLSearchParams) {
    return new URLSearchParams(parameters)
  }
  if (Array.isArray(parameters)) {
    return new URLSearchParams(parameters.map(([key, value]) => [key, value] as [string, string]))
  }
  return new URLSearchParams(parameters as Record<string, string>)
}

const oauthTokenRequestFetchCreate = (
  fetcher: OauthTokenRequestOptions["fetch"],
): OauthTokenRequestFetch | undefined => {
  if (fetcher === undefined) {
    return undefined
  }
  return async (url, options) => fetcher(url, options as RequestInit)
}

const oauthTokenRequestClientAuthenticationCreate = (
  config: OauthTokenRequestConfig,
  options: OauthTokenRequestOptions,
): Result<oauth.ClientAuth> => {
  const op = "oauthTokenRequestClientAuthenticationCreate"
  if (options.clientAuthentication !== undefined) {
    return createResult(options.clientAuthentication)
  }

  switch (config.clientAuth ?? "none") {
    case "none":
      return createResult(oauth.None())
    case "client_secret_basic":
      if (config.clientSecret === undefined) {
        return createResultError(op, "clientSecret is required for client_secret_basic authentication")
      }
      return createResult(oauth.ClientSecretBasic(config.clientSecret))
    case "client_secret_post":
      if (config.clientSecret === undefined) {
        return createResultError(op, "clientSecret is required for client_secret_post authentication")
      }
      return createResult(oauth.ClientSecretPost(config.clientSecret))
  }
}

const oauthTokenRequestDiscoveryParse = (discovery: unknown): Result<oauth.AuthorizationServer> => {
  const op = "oauthTokenRequestDiscoveryParse"
  const parsed = v.safeParse(oauthTokenRequestDiscoverySchema, discovery)
  if (!parsed.success) {
    return createResultError(op, `Invalid validated OIDC discovery metadata: ${v.summarize(parsed.issues)}`)
  }
  return createResult(parsed.output)
}

export async function oauthTokenRequest(options: OauthTokenRequestOptions = {}): PromiseResult<TokenEndpointResponse> {
  const op = "oauthTokenRequest"
  let validatedDiscovery: oauth.AuthorizationServer | undefined
  if (options.discovery !== undefined) {
    const discoveryResult = oauthTokenRequestDiscoveryParse(options.discovery)
    if (!discoveryResult.success) {
      return discoveryResult
    }
    validatedDiscovery = discoveryResult.data
  }

  const configResult = await oauthTokenRequestConfigCreate({
    baseUrl: options.baseUrl,
    clientAuth: options.clientAuth,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    config: options.config,
    env: options.env,
    envFile: options.envFile,
    grantType: options.grantType,
    issuer: options.issuer ?? validatedDiscovery?.issuer,
  })
  if (!configResult.success) {
    return configResult
  }

  const parameters = oauthTokenRequestParametersCreate(options.parameters)
  const clientId = configResult.data.clientId ?? parameters.get("client_id")
  if (clientId === null || clientId === undefined || clientId.length === 0) {
    return createResultError(op, "clientId is required")
  }

  const grantType = configResult.data.grantType ?? parameters.get("grant_type")
  if (grantType === null || grantType === undefined || grantType.length === 0) {
    return createResultError(op, "grantType is required")
  }

  const authResult = oauthTokenRequestClientAuthenticationCreate(configResult.data, options)
  if (!authResult.success) {
    return authResult
  }

  const fetcher = oauthTokenRequestFetchCreate(options.fetch)
  const discoveryOptions: oauth.DiscoveryRequestOptions = {}
  const requestOptions: Omit<oauth.TokenEndpointRequestOptions, "additionalParameters"> = {}
  if (options.headers !== undefined) {
    requestOptions.headers = new Headers(options.headers)
  }
  if (options.signal !== undefined) {
    requestOptions.signal = options.signal
  }
  if (options.allowInsecureRequests === true) {
    requestOptions[oauth.allowInsecureRequests] = true
    discoveryOptions[oauth.allowInsecureRequests] = true
  }
  if (fetcher !== undefined) {
    discoveryOptions[oauth.customFetch] = fetcher
    requestOptions[oauth.customFetch] = fetcher
  }

  try {
    let authorizationServer = validatedDiscovery
    if (authorizationServer === undefined) {
      const issuer = new URL(configResult.data.issuer)
      const discoveryResponse = await oauth.discoveryRequest(issuer, discoveryOptions)
      authorizationServer = await oauth.processDiscoveryResponse(issuer, discoveryResponse)
    }
    const client: oauth.Client = { client_id: clientId }
    const tokenResponse = await oauth.genericTokenEndpointRequest(
      authorizationServer,
      client,
      authResult.data,
      grantType,
      parameters,
      requestOptions,
    )
    const response = await oauth.processGenericTokenEndpointResponse(authorizationServer, client, tokenResponse)
    return createResult(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
}
