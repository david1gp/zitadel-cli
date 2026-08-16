# API discovery

The CLI exposes the policy-filtered catalog through `api list`, `api describe`, and `api call`. This is the
recommended workflow for people and automation—including AI agents—because it discovers the generated protobuf
request shape instead of guessing or duplicating fields. Output is pretty JSON by default; add `--output yaml` for
YAML.

```sh
zitadel-cli api list
zitadel-cli api list --api-version v2 --service ProjectService
zitadel-cli api describe ProjectService.ListProjects
zitadel-cli api describe zitadel.project.v2.ProjectService.ListProjects --output yaml
```

Use `--api-version v2` and `--service ProjectService` to narrow a large list. `describe` accepts a service or
method name and reports the generated protobuf request/response descriptors, official ZITADEL reference URL, API
version, and deprecation policy. Deprecated, beta, alpha, and unapproved v1 methods are absent from the catalog.

Call a catalog-supported unary method with the complete protobuf JSON request. Requests may be
inline or read from a file, but not both:

```sh
ZITADEL_BASE_URL=https://instance.zitadel.cloud \
ZITADEL_TOKEN="$TOKEN" \
zitadel-cli api call ProjectService.ListProjects \
  --request-json '{"pagination":{"limit":25}}'

zitadel-cli api call ProjectService.ListProjects \
  --request-file ./list-projects.json \
  --base-url https://instance.zitadel.cloud \
  --token "$TOKEN" \
  --output yaml
```

`--request-json` and `--request-file` are mutually exclusive. Use the complete generated protobuf JSON request;
the CLI does not maintain a second, hand-written field schema. Configuration precedence is explicit flags,
process environment, then the selected `.env` file (`--env-file`), with no implicit `.env` loading. The catalog
includes only the two approved `legacy_v1` AdminService methods; other legacy methods are rejected and the
dedicated `legacy-v1` commands remain available for compatibility.
