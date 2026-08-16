import { createResult, createResultError, type Result } from "#result"
import { SERVICE_CATALOG, type ServiceCatalogEntry } from "../catalog/index.js"

export function apiServiceFind(
  target: string,
  catalog: readonly ServiceCatalogEntry[] = SERVICE_CATALOG,
): Result<ServiceCatalogEntry> {
  const op = "apiServiceFind"
  const normalizedTarget = target.trim().replace(/^\/+/, "").toLowerCase()
  if (normalizedTarget === "") {
    return createResultError(op, "An API service target is required")
  }

  const matches = catalog.filter(({ docsCategory, serviceName, typeName }) =>
    [docsCategory, serviceName, typeName].some((alias) => alias.toLowerCase() === normalizedTarget),
  )
  if (matches.length === 1) {
    const service = matches[0]
    if (service === undefined) {
      return createResultError(op, `Unsupported API service "${target}"`)
    }
    return createResult(service)
  }
  if (matches.length > 1) {
    return createResultError(op, `API service target "${target}" is ambiguous; use a fully qualified service name`)
  }
  return createResultError(op, `Unsupported API service "${target}"; only catalog-supported services may be described`)
}
