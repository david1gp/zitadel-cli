# `InternalPermissionService.ListAdministrators`

This slice exposes the stable v2 `InternalPermissionService.ListAdministrators` operation through the typed library and its endpoint-owned CLI command definition.

Official reference: <https://zitadel.com/docs/reference/api/internal_permission/zitadel.internal_permission.v2.InternalPermissionService.ListAdministrators>

## Request discovery

The request is the generated `ListAdministratorsRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli internal-permissions administrators list \
  --request-json '{"pagination":{"limit":25},"sortingColumn":"ADMINISTRATOR_FIELD_NAME_CREATION_DATE"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
