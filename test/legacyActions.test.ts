import { describe, expect, test } from "bun:test"
import {
  adminServiceListOrganizations,
  managementServiceDeactivateAction,
  managementServiceGetFlow,
  managementServiceListActions,
  managementServiceSetFlowTrigger,
} from "../src/legacy_v1/legacyActions.js"

const config = {
  baseUrl: "https://auth.example.test",
  organizationId: "org-1",
  token: "test-bearer-token",
}

describe("typed legacy Actions cleanup operations", () => {
  test("uses exact organization, flow, trigger, action-list, and deactivate requests", async () => {
    const requests: Request[] = []
    const fetch = async (input: string | URL | Request, init?: RequestInit) => {
      const request = new Request(String(input), init)
      requests.push(request)
      const path = new URL(request.url).pathname
      if (path === "/admin/v1/orgs/_search") {
        return new Response(
          JSON.stringify({ details: { totalResult: "1" }, result: [{ id: "org-1", name: "Contentoren" }] }),
        )
      }
      if (path === "/management/v1/flows/1") {
        return new Response(
          JSON.stringify({
            flow: { triggerActions: [{ triggerType: { id: "1" }, actions: [{ id: "legacy-1", name: "old" }] }] },
          }),
        )
      }
      if (path === "/management/v1/actions/_search") {
        return new Response(
          JSON.stringify({
            details: { totalResult: "1" },
            result: [{ id: "action-1", name: "old", state: "ACTION_STATE_ACTIVE" }],
          }),
        )
      }
      return new Response("{}")
    }

    const organizationsResult = await adminServiceListOrganizations({
      config: { baseUrl: config.baseUrl, token: config.token },
      fetch,
      request: {
        query: { asc: true, limit: 100, offset: 0 },
        queries: [{ query: { case: "nameQuery", value: { method: 0, name: "Contentoren" } } }],
      },
    })
    const flowResult = await managementServiceGetFlow({ config, fetch, flow: "1" })
    const triggerResult = await managementServiceSetFlowTrigger({
      config,
      fetch,
      flow: "1",
      request: { actionIds: ["keep-1"] },
      trigger: "1",
    })
    const actionsResult = await managementServiceListActions({
      config,
      fetch,
      request: { query: { asc: true, limit: 100, offset: 0 } },
    })
    const deactivateResult = await managementServiceDeactivateAction({ actionId: "action-1", config, fetch })

    expect(organizationsResult.success).toBe(true)
    expect(flowResult.success).toBe(true)
    expect(triggerResult.success).toBe(true)
    expect(actionsResult.success).toBe(true)
    expect(deactivateResult.success).toBe(true)
    expect(requests.map((request) => [request.method, new URL(request.url).pathname])).toEqual([
      ["POST", "/admin/v1/orgs/_search"],
      ["GET", "/management/v1/flows/1"],
      ["POST", "/management/v1/flows/1/trigger/1"],
      ["POST", "/management/v1/actions/_search"],
      ["POST", "/management/v1/actions/action-1/_deactivate"],
    ])
    expect(new Headers(requests[1]?.headers).get("x-zitadel-orgid")).toBe("org-1")
    expect(new Headers(requests[0]?.headers).get("x-zitadel-orgid")).toBeNull()
    expect(await requests[2]?.clone().text()).toBe('{"actionIds":["keep-1"]}')
    expect(await requests[4]?.clone().text()).toBe("{}")
  })

  test("does not expose bearer tokens in request failures", async () => {
    const result = await managementServiceListActions({
      config,
      fetch: async () => new Response("test-bearer-token", { status: 503, statusText: "Unavailable" }),
      request: { query: { asc: true, limit: 100, offset: 0 } },
    })
    expect(result).toEqual({
      success: false,
      op: "managementServiceListActions",
      errorMessage: "ZITADEL request failed: HTTP 503 Unavailable",
    })
  })
})
