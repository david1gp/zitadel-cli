import { LEGACY_SERVICE_CATALOG } from "./legacyServiceCatalog.js"
import { V2_SERVICE_CATALOG } from "./v2ServiceCatalog.js"

export const SERVICE_CATALOG = [...V2_SERVICE_CATALOG, ...LEGACY_SERVICE_CATALOG] as const
