import { ActionService } from "../v2/action.js"
import { ApplicationService } from "../v2/application.js"
import { InternalPermissionService } from "../v2/internalPermission.js"
import { OrganizationService } from "../v2/organization.js"
import { ProjectService } from "../v2/project.js"
import { UserService } from "../v2/user.js"
import { serviceCatalogCreate } from "./serviceCatalogCreate.js"

export const V2_SERVICE_CATALOG = [
  serviceCatalogCreate(ProjectService, "project", "v2"),
  serviceCatalogCreate(ApplicationService, "application", "v2"),
  serviceCatalogCreate(UserService, "user", "v2"),
  serviceCatalogCreate(InternalPermissionService, "internal_permission", "v2"),
  serviceCatalogCreate(OrganizationService, "org", "v2"),
  serviceCatalogCreate(ActionService, "action", "v2"),
] as const
