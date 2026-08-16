import { describe, expect, test } from "bun:test"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parse as yamlParse } from "yaml"
import { oauthTokenRequest } from "../src/protocol/oauthTokenRequest.js"
import { oauthTokenRequestConfigCreate } from "../src/protocol/oauthTokenRequestConfigCreate.js"
import { oauthTokenRequestSerialize } from "../src/protocol/oauthTokenRequestSerialize.js"

const issuer = "https://issuer.example/tenant"
const discoveryUrl = `${issuer}/.well-known/openid-configuration`
const tokenUrl = "https://tokens.example/oauth/token"

const oauthFetchMockCreate =
  (requests: Array<{ url: string; init: RequestInit }>) =>
  async (input: string | URL, init?: RequestInit): Promise<Response> => {
    const url = String(input)
    requests.push({ init: init ?? {}, url })
    if (url === discoveryUrl) {
      return new Response(JSON.stringify({ issuer, token_endpoint: tokenUrl }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })
    }
    if (url === tokenUrl) {
      return new Response(JSON.stringify({ access_token: "access-token", expires_in: 3600, token_type: "Bearer" }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })
    }
    return new Response("not found", { status: 404 })
  }

describe("oauthTokenRequest", () => {
  test("discovers and posts device-code form fields to the discovered token endpoint", async () => {
    const requests: Array<{ url: string; init: RequestInit }> = []
    const result = await oauthTokenRequest({
      clientId: "device-client",
      fetch: oauthFetchMockCreate(requests),
      grantType: "urn:ietf:params:oauth:grant-type:device_code",
      issuer,
      parameters: { device_code: "device-code", scope: "openid profile" },
    })

    expect(result).toEqual({
      success: true,
      data: {
        access_token: "access-token",
        expires_in: 3600,
        token_type: "bearer",
      },
    })
    expect(requests.map(({ url }) => url)).toEqual([discoveryUrl, tokenUrl])
    const tokenRequest = requests[1]
    expect(tokenRequest?.init.method).toBe("POST")
    expect(tokenRequest?.init.headers).toMatchObject({
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8",
    })
    expect(String(tokenRequest?.init.body)).toContain(
      "grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Adevice_code",
    )
    expect(String(tokenRequest?.init.body)).toContain("device_code=device-code")
    expect(String(tokenRequest?.init.body)).toContain("client_id=device-client")
    expect(String(tokenRequest?.init.body)).toContain("scope=openid+profile")
  })

  test("keeps arbitrary form fields and supports client-secret basic authentication", async () => {
    const requests: Array<{ url: string; init: RequestInit }> = []
    const result = await oauthTokenRequest({
      clientAuth: "client_secret_basic",
      clientId: "confidential-client",
      clientSecret: "secret",
      fetch: oauthFetchMockCreate(requests),
      grantType: "urn:ietf:params:oauth:grant-type:token-exchange",
      issuer,
      parameters: [
        ["subject_token", "subject"],
        ["subject_token_type", "urn:example:subject"],
        ["custom_parameter", "kept"],
      ],
    })

    expect(result.success).toBe(true)
    const tokenRequest = requests[1]
    expect(tokenRequest?.init.headers).toMatchObject({ authorization: expect.stringMatching(/^Basic /) })
    expect(String(tokenRequest?.init.body)).toContain("custom_parameter=kept")
    expect(String(tokenRequest?.init.body)).not.toContain("client_secret")
  })

  test("uses a validated discovery response without accepting a token endpoint override", async () => {
    const requests: Array<{ url: string; init: RequestInit }> = []
    const result = await oauthTokenRequest({
      clientId: "discovered-client",
      discovery: { issuer, token_endpoint: tokenUrl },
      fetch: oauthFetchMockCreate(requests),
      grantType: "refresh_token",
      parameters: { refresh_token: "refresh-token" },
    })

    expect(result.success).toBe(true)
    expect(requests.map(({ url }) => url)).toEqual([tokenUrl])
  })

  test("rejects an issuer mismatch as a Result error before requesting a token", async () => {
    const requests: Array<{ url: string; init: RequestInit }> = []
    const fetcher = async (input: string | URL, init?: RequestInit): Promise<Response> => {
      const url = String(input)
      requests.push({ init: init ?? {}, url })
      return new Response(JSON.stringify({ issuer: "https://another.example/", token_endpoint: tokenUrl }), {
        headers: { "content-type": "application/json" },
        status: 200,
      })
    }

    const result = await oauthTokenRequest({
      clientId: "client",
      fetch: fetcher,
      grantType: "authorization_code",
      issuer,
      parameters: { code: "code" },
    })

    expect(result.success).toBe(false)
    expect(requests).toHaveLength(1)
  })

  test("uses explicit environment values before the selected .env file", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-cli-"))
    const envFile = join(directory, ".env.oauth")
    try {
      await writeFile(envFile, "OIDC_ISSUER=https://from-file.example\nOIDC_CLIENT_ID=file-client\n")
      const result = await oauthTokenRequestConfigCreate({
        env: { OIDC_CLIENT_ID: "environment-client", OIDC_ISSUER: issuer },
        envFile,
      })
      expect(result).toEqual({
        success: true,
        data: {
          clientAuth: "none",
          clientId: "environment-client",
          clientSecret: undefined,
          grantType: undefined,
          issuer,
        },
      })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("serializes token responses as JSON and YAML", async () => {
    const response = { access_token: "access-token", token_type: "bearer" } as const
    const json = oauthTokenRequestSerialize(response, "json")
    const yaml = oauthTokenRequestSerialize(response, "yaml")

    expect(json.success).toBe(true)
    expect(yaml.success).toBe(true)
    if (!json.success || !yaml.success) {
      return
    }
    expect(JSON.parse(json.data)).toEqual(response)
    expect(yamlParse(yaml.data)).toEqual(response)
  })
})
