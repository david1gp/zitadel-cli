import type { MethodCatalogEntry } from "../catalog/index.js"
import { apiMessageDescribe, type ApiMessageDescription } from "./apiMessageDescribe.js"
import { apiPolicy } from "./apiPolicy.js"

export type ApiMethodDescription = {
  readonly apiVersion: MethodCatalogEntry["apiVersion"]
  readonly deprecated: false
  readonly deprecationPolicy: (typeof apiPolicy)["deprecation"]
  readonly docs: {
    readonly url: string
  }
  readonly docsCategory: string
  readonly legacyPolicy: (typeof apiPolicy)["legacy"]
  readonly method: {
    readonly kind: string
    readonly localName: string
    readonly name: string
  }
  readonly methodKey: string
  readonly methodName: string
  readonly request: ApiMessageDescription
  readonly response: ApiMessageDescription
  readonly service: {
    readonly name: string
    readonly typeName: string
  }
  readonly serviceName: string
}

export function apiMethodDescribe(entry: MethodCatalogEntry): ApiMethodDescription {
  const method = entry.service.methods.find(({ localName }) => localName === entry.methodKey)

  return {
    apiVersion: entry.apiVersion,
    deprecated: false,
    deprecationPolicy: { ...apiPolicy.deprecation },
    docs: {
      url: entry.docsUrl,
    },
    docsCategory: entry.docsCategory,
    legacyPolicy: { ...apiPolicy.legacy },
    method: {
      kind: method?.methodKind ?? "unknown",
      localName: entry.methodKey,
      name: entry.methodName,
    },
    methodKey: entry.methodKey,
    methodName: entry.methodName,
    request: apiMessageDescribe(entry.request),
    response: apiMessageDescribe(entry.response),
    service: {
      name: entry.service.name,
      typeName: entry.service.typeName,
    },
    serviceName: entry.serviceName,
  }
}
