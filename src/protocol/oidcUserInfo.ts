import type { AuthorizationServer, Client, UserInfoRequestOptions, UserInfoResponse } from "oauth4webapi"
import { customFetch, processUserInfoResponse, skipSubjectCheck, userInfoRequest } from "oauth4webapi"
import * as v from "valibot"
import { createResult, createResultError, type PromiseResult } from "#result"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { zitadelConfigCreate } from "../config/zitadelConfigCreate.js"

const oidcUserInfoDiscoverySchema = v.object({
  issuer: v.pipe(v.string(), v.minLength(1), v.url()),
  userinfo_endpoint: v.pipe(v.string(), v.minLength(1), v.url()),
})

export type OidcUserInfoFetch = NonNullable<UserInfoRequestOptions[typeof customFetch]>

export type OidcUserInfoOptions = {
  readonly baseUrl?: string
  readonly client?: Client
  readonly config?: ZitadelConfig
  readonly discovery: AuthorizationServer
  readonly env?: Readonly<Record<string, string | undefined>>
  readonly envFile?: string
  readonly expectedSubject?: string
  readonly fetch?: OidcUserInfoFetch
  readonly token?: string
}

/**
 * Requests and validates OIDC UserInfo claims from the endpoint in validated discovery metadata.
 *
 * @see https://openid.net/specs/openid-connect-core-1_0-errata2.html#UserInfo
 */
export async function oidcUserInfo(options: OidcUserInfoOptions): PromiseResult<UserInfoResponse> {
  const op = "oidcUserInfo"
  const discoveryResult = v.safeParse(oidcUserInfoDiscoverySchema, options.discovery)
  if (!discoveryResult.success) {
    return createResultError(op, v.summarize(discoveryResult.issues))
  }

  const configResult =
    options.config !== undefined
      ? createResult(options.config)
      : await zitadelConfigCreate({
          baseUrl: options.baseUrl ?? discoveryResult.output.issuer,
          env: options.env,
          envFile: options.envFile,
          token: options.token,
        })
  if (!configResult.success) {
    return configResult
  }

  const client = options.client ?? { client_id: "zitadel-cli" }
  const requestOptions: UserInfoRequestOptions = {}
  if (options.fetch !== undefined) {
    requestOptions[customFetch] = options.fetch
  }

  try {
    const response = await userInfoRequest(options.discovery, client, configResult.data.token, requestOptions)
    const claims = await processUserInfoResponse(
      options.discovery,
      client,
      options.expectedSubject ?? skipSubjectCheck,
      response,
    )
    return createResult(claims)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    return createResultError(op, message)
  }
}
