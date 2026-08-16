# `OrganizationService.GenerateOrganizationDomainValidation`

This slice exposes the stable v2 `OrganizationService.GenerateOrganizationDomainValidation` operation through the typed library and CLI endpoint command.

Official reference: <https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.GenerateOrganizationDomainValidation>

## Request discovery

The request is the generated `GenerateOrganizationDomainValidationRequest` protobuf shape with `organizationId`, `domain`, and `type` fields. Pass protobuf JSON directly:

```sh
zitadel-cli organizations generate-organization-domain-validation \
  --request-json '{"organizationId":"organization-1","domain":"example.test","type":"DOMAIN_VALIDATION_TYPE_DNS"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
