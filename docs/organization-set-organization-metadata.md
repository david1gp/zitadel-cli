# `OrganizationService.SetOrganizationMetadata`

This slice exposes the stable v2 `OrganizationService.SetOrganizationMetadata` operation through the typed library and `zitadel-cli organizations set-organization-metadata` command.

Official reference: <https://zitadel.com/docs/reference/api/org/zitadel.org.v2.OrganizationService.SetOrganizationMetadata>

## Request discovery

The request is the generated `SetOrganizationMetadataRequest` protobuf shape. It requires an `organizationId` and metadata entries. Metadata values must be base64 encoded in protobuf JSON:

```sh
zitadel-cli organizations set-organization-metadata \
  --request-json '{"organizationId":"organization-id","metadata":[{"key":"owner","value":"ZGF2aWQ="}]}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
