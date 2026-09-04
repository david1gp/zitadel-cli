import type { Interceptor } from "@connectrpc/connect"

export function zitadelBearerInterceptorCreate(token: string, organizationId?: string): Interceptor {
  return (next) => async (request) => {
    request.header.set("Authorization", `Bearer ${token}`)
    if (organizationId !== undefined) request.header.set("x-zitadel-orgid", organizationId)
    return next(request)
  }
}
