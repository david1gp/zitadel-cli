import { AdminService as GeneratedAdminService } from "../generated/zitadel/admin_pb.js"

export const AdminService = {
  ...GeneratedAdminService,
  methods: GeneratedAdminService.methods.filter(
    ({ localName }) => localName === "listIDPs" || localName === "addGoogleProvider",
  ),
} as const
