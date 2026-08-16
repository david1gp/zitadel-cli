import { AdminService } from "../legacy_v1/adminService.js"
import { serviceCatalogCreate } from "./serviceCatalogCreate.js"

export const LEGACY_SERVICE_CATALOG = [serviceCatalogCreate(AdminService, "admin", "legacy_v1")] as const
