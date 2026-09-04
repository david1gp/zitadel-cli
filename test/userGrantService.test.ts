import { describe, expect, test } from "bun:test"
import {
  userGrantServiceAddUserGrant,
  userGrantServiceListUserGrants,
  userGrantServiceReactivateUserGrant,
  userGrantServiceUpdateUserGrant,
} from "../src/legacy_v1/userGrants.js"

const config = {
  baseUrl: "https://auth.example.test",
  organizationId: "org-1",
  token: "test-bearer-token",
}

const fetchResponse =
  (body: unknown, status = 200) =>
  async (input: string | URL | Request, init?: RequestInit) => {
    expect(String(input)).toBe("https://auth.example.test/management/v1/users/grants/_search")
    expect(init?.method).toBe("POST")
    expect(new Headers(init?.headers).get("Authorization")).toBe("Bearer test-bearer-token")
    expect(new Headers(init?.headers).get("x-zitadel-orgid")).toBe("org-1")
    return new Response(JSON.stringify(body), { status, statusText: status === 200 ? "" : "Unavailable" })
  }

describe("legacy Management user-grant operations", () => {
  test("lists and validates paginated grant response data", async () => {
    const result = await userGrantServiceListUserGrants({
      config,
      fetch: fetchResponse({
        details: { totalResult: "1" },
        result: [
          {
            id: "grant-1",
            orgId: "org-1",
            projectId: "project-1",
            roleKeys: ["admin"],
            state: "USER_GRANT_STATE_INACTIVE",
            userId: "user-1",
          },
        ],
      }),
      request: {
        queries: [{ projectIdQuery: { projectId: "project-1" } }, { userIdQuery: { userId: "user-1" } }],
        query: { asc: true, limit: 100, offset: 0 },
      },
    })

    expect(result).toEqual({
      success: true,
      data: {
        result: [
          {
            id: "grant-1",
            orgId: "org-1",
            projectId: "project-1",
            roleKeys: ["admin"],
            state: 2,
            userId: "user-1",
          },
        ],
        totalResult: 1n,
      },
    })
  })

  test("accepts only the exact metadata-only empty-grant compatibility response", async () => {
    const accepted = await userGrantServiceListUserGrants({
      config,
      fetch: fetchResponse({ details: { viewTimestamp: "2026-08-23T00:00:00Z" } }),
      request: {
        queries: [{ userIdQuery: { userId: "user-1" } }],
        query: { asc: true, limit: 100, offset: 0 },
      },
    })
    expect(accepted).toEqual({ success: true, data: { result: [], totalResult: undefined } })

    for (const body of [
      {},
      { details: {} },
      { details: { totalResult: 0 } },
      { details: { viewTimestamp: "2026-08-23T00:00:00" } },
      { details: { viewTimestamp: "not-a-timestamp" } },
      { result: [], details: { viewTimestamp: "2026-08-23T00:00:00Z" } },
      {
        result: [
          { id: "grant-1", orgId: "org-1", projectId: "project-1", roleKeys: ["admin"], state: 1, userId: "user-1" },
        ],
        details: { viewTimestamp: "2026-08-23T00:00:00Z" },
      },
    ]) {
      const rejected = await userGrantServiceListUserGrants({
        config,
        fetch: fetchResponse(body),
        request: {
          queries: [{ userIdQuery: { userId: "user-1" } }],
          query: { asc: true, limit: 100, offset: 0 },
        },
      })
      expect(rejected.success).toBe(false)
    }
  })

  test("uses exact add, update, and reactivate paths and bodies", async () => {
    const requests: Request[] = []
    const fetch = async (input: string | URL | Request, init?: RequestInit) => {
      requests.push(new Request(String(input), init))
      return new Response("{}")
    }

    const addResult = await userGrantServiceAddUserGrant({
      config,
      fetch,
      request: { projectId: "project-1", roleKeys: ["admin"] },
      userId: "user-1",
    })
    const updateResult = await userGrantServiceUpdateUserGrant({
      config,
      fetch,
      grantId: "grant-1",
      request: { roleKeys: ["admin"] },
      userId: "user-1",
    })
    const reactivateResult = await userGrantServiceReactivateUserGrant({
      config,
      fetch,
      grantId: "grant-1",
      userId: "user-1",
    })

    expect(addResult.success).toBe(true)
    expect(updateResult.success).toBe(true)
    expect(reactivateResult.success).toBe(true)
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["POST", "/management/v1/users/user-1/grants"],
      ["PUT", "/management/v1/users/user-1/grants/grant-1"],
      ["POST", "/management/v1/users/user-1/grants/grant-1/_reactivate"],
    ])
    expect(await requests[0]?.clone().text()).toBe('{"projectId":"project-1","roleKeys":["admin"]}')
    expect(await requests[1]?.clone().text()).toBe('{"roleKeys":["admin"]}')
    expect(await requests[2]?.clone().text()).toBe("{}")
  })

  test("does not expose an HTTP error body or bearer token", async () => {
    const result = await userGrantServiceListUserGrants({
      config,
      fetch: async () => new Response("test-bearer-token", { status: 503, statusText: "Unavailable" }),
      request: {
        queries: [{ userIdQuery: { userId: "user-1" } }],
        query: { asc: true, limit: 100, offset: 0 },
      },
    })

    expect(result).toEqual({
      success: false,
      op: "userGrantServiceListUserGrants",
      errorMessage: "ZITADEL request failed: HTTP 503 Unavailable",
    })
  })
})
