import { allowInsecureRequests, customFetch, discoveryRequest } from "oauth4webapi"
import * as v from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { zitadelConfigCreate } from "../config/zitadelConfigCreate.js"
import { type OidcDiscoveryResponse, oidcDiscoveryResponseSchema } from "./oidcDiscoveryResponseSchema.js"

export type OidcDiscoveryOptions = {
  readonly baseUrl?: string
  readonly config?: Pick<ZitadelConfig, "baseUrl">
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly fetch?: (input: string | URL | Request, init?: RequestInit) => Promise<Response>
}

/**
 * Retrieves and validates the OpenID Connect provider configuration.
 *
 * @see https://openid.net/specs/openid-connect-discovery-1_0-errata2.html#ProviderConfig
 */
export async function oidcDiscovery(options: OidcDiscoveryOptions = {}): PromiseResult<OidcDiscoveryResponse> {
  const op = "oidcDiscovery"
  const configResult = await zitadelConfigCreate({
    baseUrl: options.config?.baseUrl ?? options.baseUrl,
    env: options.env,
    envFile: options.envFile,
    token: "oidc-discovery",
  })
  if (!configResult.success) {
    return configResult
  }

  const issuer = new URL(configResult.data.baseUrl)
  const fetchImplementation = options.fetch ?? globalThis.fetch

  let response: Response
  try {
    response = await discoveryRequest(issuer, {
      ...(issuer.protocol === "http:" ? { [allowInsecureRequests]: true } : {}),
      [customFetch]: (url, init) => fetchImplementation(url, init),
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, `OIDC discovery request failed: ${message}`)
  }

  if (!response.ok) {
    const statusText = response.statusText === "" ? "" : ` ${response.statusText}`
    return createResultError(op, `OIDC discovery request failed: HTTP ${response.status}${statusText}`)
  }

  let body: unknown
  try {
    body = await response.json()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, `Invalid OIDC discovery response: ${message}`)
  }

  const parsed = v.safeParse(oidcDiscoveryResponseSchema, body)
  if (!parsed.success) {
    return createResultError(op, `Invalid OIDC discovery response: ${v.summarize(parsed.issues)}`)
  }
  const expectedIssuer = issuer.href.replace(/\/+$/, "")
  const receivedIssuer = parsed.output.issuer.replace(/\/+$/, "")
  if (receivedIssuer !== expectedIssuer) {
    return createResultError(op, "Invalid OIDC discovery response: issuer does not match the requested base URL")
  }

  return createResult(parsed.output)
}
