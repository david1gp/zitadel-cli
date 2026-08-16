# `OrganizationService.ListOrganizationMetadata`

This slice exposes the stable v2 `OrganizationService.ListOrganizationMetadata` operation through the typed library and endpoint-owned CLI command.

Official reference: <https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.ListOrganizationMetadata>

## Request discovery

The request is the generated `ListOrganizationMetadataRequest` protobuf shape; no CLI field schema is duplicated. Discover its current fields from the generated descriptor/types, then pass protobuf JSON directly:

```sh
zitadel-cli organizations list-organization-metadata \
  --request-json '{"organizationId":"organization-1","pagination":{"limit":25,"asc":true},"filters":[{"keyFilter":{"key":"role","method":"TEXT_FILTER_METHOD_EQUALS"}}]}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
