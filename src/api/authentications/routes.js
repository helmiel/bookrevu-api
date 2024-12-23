const routes = (handler) => [
  {
    method: "POST",
    path: "/api/authentications",
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
  },
  {
    method: "PUT",
    path: "/api/authentications",
    handler: (request, h) => handler.putAuthenticationHandler(request, h),
  },
  {
    method: "DELETE",
    path: "/api/authentications",
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
  },
];

export default routes;
