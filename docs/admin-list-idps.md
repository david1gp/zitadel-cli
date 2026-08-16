# `AdminService.ListIDPs`

This isolated compatibility slice exposes the legacy v1 `zitadel.admin.v1.AdminService.ListIDPs` operation through
the typed library and a standalone Stricli command.

Official reference: <https://zitadel.com/docs/reference/api/admin/zitadel.admin.v1.AdminService.ListIDPs>

> **Compatibility notice:** This is a legacy v1 operation retained for existing integrations. Prefer a supported
> current API when migrating from v1, and do not assume it is available on every ZITADEL deployment.

## Request discovery

The request is the generated `ListIDPsRequest` protobuf JSON shape. When composing the standalone command, pass the
complete request with `--request-json` or `--request-file`. Credentials use `--base-url` and `--token`, or
`ZITADEL_BASE_URL` and `ZITADEL_TOKEN`; output defaults to JSON and also supports YAML.
