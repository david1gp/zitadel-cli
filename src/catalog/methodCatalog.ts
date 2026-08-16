import { SERVICE_CATALOG } from "./serviceCatalog.js"
import type { MethodCatalogEntry } from "./serviceCatalogCreate.js"

export const METHOD_CATALOG: readonly MethodCatalogEntry[] = SERVICE_CATALOG.flatMap((service) => service.methods)
