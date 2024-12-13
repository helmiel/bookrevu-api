const routes = (handler) => [
  {
    method: "POST",
    path: "/books/{bookId}/rating",
    handler: (request, h) => handler.postRatingHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "GET",
    path: "/books/{bookId}/userrating",
    handler: (request, h) => handler.getRatingHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/books/{bookId}/rating",
    handler: (request, h) => handler.deleteRatingHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
];

export default routes;
