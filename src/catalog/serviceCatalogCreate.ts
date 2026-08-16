import type { DescMessage, DescService } from "@bufbuild/protobuf"

export type MethodCatalogEntry = {
  readonly apiVersion: "legacy_v1" | "v2"
  readonly docsCategory: string
  readonly docsUrl: string
  readonly methodKey: string
  readonly methodName: string
  readonly request: DescMessage
  readonly response: DescMessage
  readonly service: DescService
  readonly serviceName: string
}

export type ServiceCatalogEntry = {
  readonly apiVersion: "legacy_v1" | "v2"
  readonly docsCategory: string
  readonly methods: readonly MethodCatalogEntry[]
  readonly service: DescService
  readonly serviceName: string
  readonly typeName: string
}

const serviceMethodDocsUrlCreate = (docsCategory: string, serviceName: string, methodName: string) =>
  `https://zitadel.com/docs/reference/api/${docsCategory}/${serviceName}.${methodName}`

export function serviceCatalogCreate(
  service: DescService,
  docsCategory: string,
  apiVersion: ServiceCatalogEntry["apiVersion"],
): ServiceCatalogEntry {
  const serviceName = service.typeName.slice(service.typeName.lastIndexOf(".") + 1)
  const methods = service.methods
    .filter(({ deprecated }) => !deprecated)
    .map((method) => ({
      apiVersion,
      docsCategory,
      docsUrl: serviceMethodDocsUrlCreate(docsCategory, service.typeName, method.name),
      methodKey: method.localName,
      methodName: method.name,
      request: method.input,
      response: method.output,
      service,
      serviceName,
    }))

  return {
    apiVersion,
    docsCategory,
    methods,
    service,
    serviceName,
    typeName: service.typeName,
  }
}
