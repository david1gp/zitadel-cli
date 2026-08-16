# `InternalPermissionService.DeleteAdministrator`

This slice exposes the stable v2 `InternalPermissionService.DeleteAdministrator` operation through the typed library and its endpoint-owned CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.DeleteAdministrator>

## Request discovery

The request is the generated `DeleteAdministratorRequest` protobuf shape. Pass the user ID and resource as protobuf JSON:

```sh
zitadel-cli internal-permissions administrators delete \
  --request-json '{"userId":"user-1","resource":{"organizationId":"org-1"}}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
