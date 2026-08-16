import { describe, expect, test } from "bun:test"
import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parse as yamlParse, stringify as yamlStringify } from "yaml"
import { oidcDiscovery } from "../src/oidcDiscovery.js"

const discoveryResponse = {
  authorization_endpoint: "https://issuer.example/oauth/v2/authorize",
  id_token_signing_alg_values_supported: ["RS256"],
  issuer: "https://issuer.example",
  jwks_uri: "https://issuer.example/oauth/v2/keys",
  response_types_supported: ["code"],
  scopes_supported: ["openid", "profile"],
  subject_types_supported: ["public"],
  token_endpoint: "https://issuer.example/oauth/v2/token",
}

describe("oidcDiscovery", () => {
  test("performs the public OIDC discovery GET and returns JSON/YAML-compatible data", async () => {
    let requestedUrl = ""
    let requestedMethod = ""
    let requestedAccept = ""
    let requestedAuthorization: string | null = null

    const result = await oidcDiscovery({
      baseUrl: "https://issuer.example/",
      fetch: async (input, init) => {
        requestedUrl = String(input)
        requestedMethod = init?.method ?? ""
        const headers = new Headers(init?.headers)
        requestedAccept = headers.get("accept") ?? ""
        requestedAuthorization = headers.get("authorization")
        return new Response(JSON.stringify(discoveryResponse), {
          headers: { "content-type": "application/json" },
          status: 200,
        })
      },
    })

    expect(requestedUrl).toBe("https://issuer.example/.well-known/openid-configuration")
    expect(requestedMethod).toBe("GET")
    expect(requestedAccept).toBe("application/json")
    expect(requestedAuthorization).toBeNull()
    expect(result).toEqual({ success: true, data: discoveryResponse })
    expect(JSON.parse(JSON.stringify(result.success ? result.data : {}))).toEqual(discoveryResponse)
    expect(yamlParse(yamlStringify(result.success ? result.data : {}))).toEqual(discoveryResponse)
  })

  test("uses process environment before the selected .env file and normalizes the base URL", async () => {
    const directory = await mkdtemp(join(tmpdir(), "zitadel-cli-"))
    const envFile = join(directory, ".env.test")
    let requestedUrl = ""

    try {
      await writeFile(envFile, "ZITADEL_BASE_URL=https://from-file.example/\n")
      const result = await oidcDiscovery({
        env: { ZITADEL_BASE_URL: "https://from-environment.example/" },
        envFile,
        fetch: async (input) => {
          requestedUrl = String(input)
          return new Response(JSON.stringify({ ...discoveryResponse, issuer: "https://from-environment.example" }))
        },
      })

      expect(result.success).toBe(true)
      expect(requestedUrl).toBe("https://from-environment.example/.well-known/openid-configuration")
    } finally {
      await rm(directory, { force: true, recursive: true })
    }
  })

  test("returns a Result error for malformed discovery metadata", async () => {
    const result = await oidcDiscovery({
      baseUrl: "https://issuer.example",
      fetch: async () => new Response(JSON.stringify({ issuer: "https://issuer.example" })),
    })

    expect(result.success).toBe(false)
    if (result.success) {
      return
    }
    expect(result.op).toBe("oidcDiscovery")
    expect(result.errorMessage).toContain("Invalid OIDC discovery response")
  })

  test("rejects metadata for a different issuer", async () => {
    const result = await oidcDiscovery({
      baseUrl: "https://issuer.example",
      fetch: async () =>
        new Response(
          JSON.stringify({
            ...discoveryResponse,
            issuer: "https://different-issuer.example",
          }),
        ),
    })

    expect(result).toEqual({
      success: false,
      op: "oidcDiscovery",
      errorMessage: "Invalid OIDC discovery response: issuer does not match the requested base URL",
    })
  })

  test("returns HTTP failures as Result errors without reading response content", async () => {
    const result = await oidcDiscovery({
      baseUrl: "https://issuer.example",
      fetch: async () => new Response("server details", { status: 503, statusText: "Unavailable" }),
    })

    expect(result).toEqual({
      success: false,
      op: "oidcDiscovery",
      errorMessage: "OIDC discovery request failed: HTTP 503 Unavailable",
    })
  })

  test("returns fetch failures as Result errors", async () => {
    const result = await oidcDiscovery({
      baseUrl: "https://issuer.example",
      fetch: async () => {
        throw new Error("network unavailable")
      },
    })

    expect(result).toEqual({
      success: false,
      op: "oidcDiscovery",
      errorMessage: "OIDC discovery request failed: network unavailable",
    })
  })
})
