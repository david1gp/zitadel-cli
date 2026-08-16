import type { ServiceCatalogEntry } from "../catalog/index.js"
import { SERVICE_CATALOG } from "../catalog/index.js"
import { apiPolicy } from "./apiPolicy.js"
import { apiServiceDescribe, type ApiServiceDescription } from "./apiServiceDescribe.js"

export type ApiCatalogListOptions = {
  readonly apiVersion?: ServiceCatalogEntry["apiVersion"]
  readonly service?: string
}

export type ApiCatalogList = {
  readonly deprecationPolicy: (typeof apiPolicy)["deprecation"]
  readonly legacyPolicy: (typeof apiPolicy)["legacy"]
  readonly services: readonly ApiServiceDescription[]
  readonly versions: (typeof apiPolicy)["versions"]
}

export function apiCatalogList(options: ApiCatalogListOptions = {}): ApiCatalogList {
  const serviceTarget = options.service?.trim().toLowerCase()
  const services = SERVICE_CATALOG.filter((service) => {
    if (options.apiVersion !== undefined && service.apiVersion !== options.apiVersion) {
      return false
    }
    if (serviceTarget === undefined || serviceTarget === "") {
      return true
    }
    return [service.docsCategory, service.serviceName, service.typeName].some(
      (alias) => alias.toLowerCase() === serviceTarget,
    )
  }).map(apiServiceDescribe)

  return {
    deprecationPolicy: { ...apiPolicy.deprecation },
    legacyPolicy: { ...apiPolicy.legacy },
    services,
    versions: apiPolicy.versions,
  }
}
