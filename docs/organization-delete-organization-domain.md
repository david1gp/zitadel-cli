# `OrganizationService.DeleteOrganizationDomain`

This slice exposes the stable v2 `OrganizationService.DeleteOrganizationDomain` operation through the typed library and its CLI command.

Official reference: <https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.DeleteOrganizationDomain>

## Request discovery

The request is the generated `DeleteOrganizationDomainRequest` protobuf shape; pass the organization ID and fully qualified domain as protobuf JSON:

```sh
zitadel-cli organizations delete-organization-domain \
  --request-json '{"organizationId":"organization-1","domain":"example.com"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
