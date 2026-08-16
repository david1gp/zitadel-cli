import { describe, expect, test } from "bun:test"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parse as yamlParse } from "yaml"
import { deviceAuthorizationConfigCreate } from "../src/protocol/deviceAuthorizationConfigCreate.js"
import { deviceAuthorizationRequest } from "../src/protocol/deviceAuthorizationRequest.js"
import { deviceAuthorizationSerialize } from "../src/protocol/deviceAuthorizationSerialize.js"

const responseBody = {
  device_code: "device-code",
  user_code: "user-code",
  verification_uri: "https://example.test/verify",
  verification_uri_complete: "https://example.test/verify?user_code=user-code",
  expires_in: 600,
  interval: 5,
}

describe("OAuth device authorization", () => {
  test("uses validated discovery endpoint, form encoding, and complete request parameters", async () => {
    let requestUrl = ""
    let requestInit: RequestInit | undefined
    const result = await deviceAuthorizationRequest({
      authorizationDetails: '{"type":"example"}',
      clientId: "client-id",
      discovery: {
        device_authorization_endpoint: "https://issuer.example/oauth/device",
        issuer: "https://issuer.example",
      },
      fetch: async (input, init) => {
        requestUrl = String(input)
        requestInit = init
        return new Response(JSON.stringify(responseBody), { headers: { "content-type": "application/json" } })
      },
      parameters: { custom: "value" },
      resource: ["https://api.example/one", "https://api.example/two"],
      scope: "openid profile",
    })

    expect(result.success).toBe(true)
    expect(requestUrl).toBe("https://issuer.example/oauth/device")
    expect(requestInit?.method).toBe("POST")
    expect(requestInit?.headers).toMatchObject({ "content-type": "application/x-www-form-urlencoded;charset=UTF-8" })
    expect(requestInit?.body).toBeInstanceOf(URLSearchParams)
    const body = new URLSearchParams(requestInit?.body as string)
    expect([...body.entries()]).toEqual([
      ["custom", "value"],
      ["client_id", "client-id"],
      ["scope", "openid profile"],
      ["resource", "https://api.example/one"],
      ["resource", "https://api.example/two"],
      ["authorization_details", '{"type":"example"}'],
    ])
  })

  test("uses process environment before an explicitly selected .env file and flags before both", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-device-"))
    const envFile = join(directory, ".env.test")
    try {
      await writeFile(
        envFile,
        [
          "ZITADEL_OIDC_DEVICE_AUTHORIZATION_ENDPOINT=https://file.example/device",
          "ZITADEL_OIDC_CLIENT_ID=file-client",
          "ZITADEL_OIDC_SCOPE=file-scope",
          "",
        ].join("\n"),
      )

      const result = await deviceAuthorizationConfigCreate({
        clientId: "flag-client",
        env: {
          ZITADEL_OIDC_CLIENT_ID: "environment-client",
          ZITADEL_OIDC_DEVICE_AUTHORIZATION_ENDPOINT: "https://environment.example/device",
        },
        envFile,
      })
      expect(result).toEqual({
        success: true,
        data: {
          authorizationDetails: undefined,
          clientAuthentication: "none",
          clientId: "flag-client",
          clientSecret: undefined,
          deviceAuthorizationEndpoint: "https://environment.example/device",
          parameters: {},
          resource: [],
          scope: "file-scope",
        },
      })
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("checks all environment aliases before falling back to the env file and lets the endpoint flag override discovery", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-device-"))
    const envFile = join(directory, ".env.test")
    try {
      await writeFile(envFile, "ZITADEL_OIDC_CLIENT_ID=file-client\n")

      const result = await deviceAuthorizationConfigCreate({
        deviceAuthorizationEndpoint: "https://flag.example/device",
        discovery: {
          device_authorization_endpoint: "https://discovery.example/device",
          issuer: "https://discovery.example",
        },
        env: { OIDC_CLIENT_ID: "environment-client" },
        envFile,
      })

      expect(result.success).toBe(true)
      if (!result.success) {
        return
      }
      expect(result.data.clientId).toBe("environment-client")
      expect(result.data.deviceAuthorizationEndpoint).toBe("https://flag.example/device")
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("returns Result errors for invalid discovery endpoint and HTTP failures", async () => {
    const invalid = await deviceAuthorizationRequest({
      clientId: "client-id",
      discovery: { issuer: "https://issuer.example" },
    })
    expect(invalid.success).toBe(false)

    const failed = await deviceAuthorizationRequest({
      clientId: "client-id",
      deviceAuthorizationEndpoint: "https://issuer.example/oauth/device",
      fetch: async () => {
        return new Response(JSON.stringify({ error: "invalid_client" }), {
          headers: { "content-type": "application/json" },
          status: 400,
        })
      },
    })
    expect(failed).toMatchObject({ success: false, op: "deviceAuthorizationRequest" })
  })

  test("serializes device authorization responses as JSON and YAML", () => {
    const json = deviceAuthorizationSerialize(responseBody, "json")
    expect(json.success).toBe(true)
    if (!json.success) {
      return
    }
    expect(JSON.parse(json.data)).toEqual(responseBody)

    const yaml = deviceAuthorizationSerialize(responseBody, "yaml")
    expect(yaml.success).toBe(true)
    if (!yaml.success) {
      return
    }
    expect(yamlParse(yaml.data)).toEqual(responseBody)
  })
})
