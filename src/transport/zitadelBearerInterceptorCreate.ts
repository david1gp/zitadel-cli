import type { Interceptor } from "@connectrpc/connect"

export function zitadelBearerInterceptorCreate(token: string): Interceptor {
  return (next) => async (request) => {
    request.header.set("Authorization", `Bearer ${token}`)
    return next(request)
  }
}
