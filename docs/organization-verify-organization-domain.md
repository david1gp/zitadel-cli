# `OrganizationService.VerifyOrganizationDomain`

This slice exposes the stable v2 `OrganizationService.VerifyOrganizationDomain` operation through the typed library and endpoint CLI command.

Official reference: <https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.VerifyOrganizationDomain>

## Request discovery

The request is the generated `VerifyOrganizationDomainRequest` protobuf shape. Pass the organization ID and domain as protobuf JSON:

```sh
zitadel-cli organizations verify-organization-domain \
  --request-json '{"organizationId":"organization-1","domain":"example.com"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
