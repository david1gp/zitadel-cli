# `ProjectService.ActivateProjectGrant`

This slice exposes the stable v2 `ProjectService.ActivateProjectGrant` operation through the typed library and `zitadel-cli projects activate-project-grant` command.

Official reference: <https://zitadel.com/docs/reference/api/project/zitadel.project.v2.ProjectService.ActivateProjectGrant>

## Request discovery

The request is the generated `ActivateProjectGrantRequest` protobuf shape; no CLI field schema is duplicated. Pass protobuf JSON directly:

```sh
zitadel-cli projects activate-project-grant \
  --request-json '{"projectId":"project-id","grantedOrganizationId":"organization-id"}'
```

Use `--request-file path/to/request.json` for a checked-in request. The flags `--base-url`, `--token`, and `--env-file` override the corresponding `ZITADEL_BASE_URL` and `ZITADEL_TOKEN` values with precedence: flags, process environment, then the explicitly selected `.env` file. Output defaults to JSON; use `--output yaml` for YAML.
