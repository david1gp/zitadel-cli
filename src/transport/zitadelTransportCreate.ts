import type { Transport } from "@connectrpc/connect"
import { createConnectTransport } from "@connectrpc/connect-node"
import type { ZitadelConfig } from "../config/zitadelConfig.js"
import { zitadelBearerInterceptorCreate } from "./zitadelBearerInterceptorCreate.js"

export function zitadelTransportCreate(config: ZitadelConfig): Transport {
  return createConnectTransport({
    baseUrl: config.baseUrl,
    httpVersion: "1.1",
    interceptors: [zitadelBearerInterceptorCreate(config.token)],
  })
}
