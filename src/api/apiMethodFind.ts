import { createResult, createResultError, type Result } from "#result"
import { METHOD_CATALOG, type MethodCatalogEntry } from "../catalog/index.js"

const targetAliasesCreate = (method: MethodCatalogEntry): readonly string[] => [
  method.methodKey,
  method.methodName,
  `${method.serviceName}.${method.methodKey}`,
  `${method.serviceName}.${method.methodName}`,
  `${method.service.typeName}.${method.methodKey}`,
  `${method.service.typeName}.${method.methodName}`,
  `${method.service.typeName}/${method.methodKey}`,
  `${method.service.typeName}/${method.methodName}`,
  `/${method.service.typeName}/${method.methodName}`,
]

export function apiMethodFind(
  target: string,
  catalog: readonly MethodCatalogEntry[] = METHOD_CATALOG,
): Result<MethodCatalogEntry> {
  const op = "apiMethodFind"
  const normalizedTarget = target.trim().replace(/^\/+/, "").toLowerCase()
  if (normalizedTarget === "") {
    return createResultError(op, "An API method target is required")
  }

  const matches = catalog.filter((method) =>
    targetAliasesCreate(method).some((alias) => alias.toLowerCase().replace(/^\/+/, "") === normalizedTarget),
  )
  if (matches.length === 1) {
    const method = matches[0]
    if (method === undefined) {
      return createResultError(op, `Unsupported API method "${target}"`)
    }
    return createResult(method)
  }
  if (matches.length > 1) {
    return createResultError(op, `API method target "${target}" is ambiguous; use a fully qualified service and method`)
  }
  return createResultError(op, `Unsupported API method "${target}"; only catalog-supported methods may be called`)
}
