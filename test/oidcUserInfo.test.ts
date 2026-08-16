import { describe, expect, test } from "bun:test"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import type { AuthorizationServer } from "oauth4webapi"
import { parse as yamlParse } from "yaml"
import { type OidcUserInfoFetch, oidcUserInfo } from "../src/protocol/oidcUserInfo.js"
import { oidcUserInfoSerialize } from "../src/protocol/oidcUserInfoSerialize.js"

const discovery: AuthorizationServer = {
  issuer: "https://issuer.example.test",
  userinfo_endpoint: "https://userinfo.example.test/oidc/userinfo",
}

const mockedFetchCreate = (
  response: Response,
  onRequest: (url: string, options: Parameters<OidcUserInfoFetch>[1]) => void | Promise<void>,
): OidcUserInfoFetch => {
  return async (url, options) => {
    await onRequest(url, options)
    return response
  }
}

describe("OIDC UserInfo", () => {
  test("uses the discovered UserInfo endpoint and bearer token", async () => {
    let requestUrl = ""
    let authorization = ""
    const fetch: OidcUserInfoFetch = mockedFetchCreate(
      new Response(JSON.stringify({ sub: "user-1", email: "user@example.test" }), {
        headers: { "content-type": "application/json" },
        status: 200,
      }),
      async (url, options) => {
        requestUrl = url
        authorization = options.headers.authorization ?? ""
        expect(options.method).toBe("GET")
        expect(options.body).toBeNull()
      },
    )

    const result = await oidcUserInfo({
      discovery,
      fetch,
      token: "access-token",
    })

    expect(result).toEqual({
      success: true,
      data: { sub: "user-1", email: "user@example.test" },
    })
    expect(requestUrl).toBe(discovery.userinfo_endpoint ?? "")
    expect(authorization).toBe("Bearer access-token")
  })

  test("uses token precedence from flags, environment, then .env", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-oidc-userinfo-"))
    const envFile = join(directory, ".env")
    const received: string[] = []
    const fetch: OidcUserInfoFetch = async (_url, options) => {
      received.push(options.headers.authorization ?? "")
      return new Response(JSON.stringify({ sub: "user-1" }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })
    }

    try {
      await writeFile(envFile, "ZITADEL_TOKEN=file-token\n")
      const fileResult = await oidcUserInfo({
        discovery,
        env: {},
        envFile,
        fetch,
      })
      const environmentResult = await oidcUserInfo({
        discovery,
        env: { ZITADEL_TOKEN: "environment-token" },
        envFile,
        fetch,
      })
      const flagResult = await oidcUserInfo({
        discovery,
        env: { ZITADEL_TOKEN: "environment-token" },
        envFile,
        fetch,
        token: "flag-token",
      })

      expect(fileResult.success).toBe(true)
      expect(environmentResult.success).toBe(true)
      expect(flagResult.success).toBe(true)
      expect(received).toEqual(["Bearer file-token", "Bearer environment-token", "Bearer flag-token"])
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("returns OIDC HTTP failures as Result errors", async () => {
    const result = await oidcUserInfo({
      discovery,
      fetch: async () => new Response(JSON.stringify({ error: "invalid_token" }), { status: 401 }),
      token: "expired-token",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.op).toBe("oidcUserInfo")
      expect(result.errorMessage).toContain("unexpected HTTP status code")
    }
  })

  test("serializes claims as JSON and YAML", () => {
    const claims = { sub: "user-1", email: "user@example.test" }
    const jsonResult = oidcUserInfoSerialize(claims)
    const yamlResult = oidcUserInfoSerialize(claims, "yaml")

    expect(jsonResult.success).toBe(true)
    expect(yamlResult.success).toBe(true)
    if (!jsonResult.success || !yamlResult.success) {
      return
    }
    expect(JSON.parse(jsonResult.data)).toEqual(claims)
    expect(yamlParse(yamlResult.data)).toEqual(claims)
  })

  test("rejects discovery without a validated UserInfo endpoint", async () => {
    const result = await oidcUserInfo({
      discovery: { issuer: discovery.issuer },
      token: "access-token",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.op).toBe("oidcUserInfo")
    }
  })
})
