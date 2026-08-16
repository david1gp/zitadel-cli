# `OrganizationService.UpdateOrganization`

This slice exposes the stable v2 `OrganizationService.UpdateOrganization` operation through the typed library and endpoint-owned CLI command.

Official reference: <https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.UpdateOrganization>

## Request discovery

The request is the generated `UpdateOrganizationRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli organizations update \
  --request-json '{"organizationId":"organization-id","name":"Updated organization"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
