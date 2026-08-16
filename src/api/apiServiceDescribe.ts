import type { ServiceCatalogEntry } from "../catalog/index.js"
import { apiPolicy } from "./apiPolicy.js"

export type ApiServiceDescription = {
  readonly apiVersion: ServiceCatalogEntry["apiVersion"]
  readonly deprecated: false
  readonly deprecationPolicy: (typeof apiPolicy)["deprecation"]
  readonly docsCategory: string
  readonly legacyPolicy: (typeof apiPolicy)["legacy"]
  readonly methods: readonly {
    readonly deprecated: false
    readonly deprecationPolicy: (typeof apiPolicy)["deprecation"]
    readonly docs: {
      readonly url: string
    }
    readonly kind: string
    readonly methodKey: string
    readonly methodName: string
    readonly request: {
      readonly name: string
      readonly typeName: string
    }
    readonly response: {
      readonly name: string
      readonly typeName: string
    }
  }[]
  readonly service: {
    readonly name: string
    readonly typeName: string
  }
  readonly serviceName: string
  readonly typeName: string
}

export function apiServiceDescribe(service: ServiceCatalogEntry): ApiServiceDescription {
  return {
    apiVersion: service.apiVersion,
    deprecated: false,
    deprecationPolicy: { ...apiPolicy.deprecation },
    docsCategory: service.docsCategory,
    legacyPolicy: { ...apiPolicy.legacy },
    methods: service.methods.map((method) => {
      const descriptor = service.service.methods.find(({ localName }) => localName === method.methodKey)
      return {
        deprecated: false,
        deprecationPolicy: { ...apiPolicy.deprecation },
        docs: {
          url: method.docsUrl,
        },
        kind: descriptor?.methodKind ?? "unknown",
        methodKey: method.methodKey,
        methodName: method.methodName,
        request: {
          name: method.request.name,
          typeName: method.request.typeName,
        },
        response: {
          name: method.response.name,
          typeName: method.response.typeName,
        },
      }
    }),
    service: {
      name: service.service.name,
      typeName: service.typeName,
    },
    serviceName: service.serviceName,
    typeName: service.typeName,
  }
}
