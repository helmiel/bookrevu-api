const routes = (handler) => [
  {
    method: "POST",
    path: "/api/books/{bookId}/review",
    handler: (request, h) => handler.postReviewHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "GET",
    path: "/api/books/{bookId}/review",
    handler: (request, h) => handler.getReviewsHandler(request, h),
  },
  {
    method: "PUT",
    path: "/api/books/{bookId}/review",
    handler: (request, h) => handler.putReviewHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/api/books/{bookId}/review",
    handler: (request, h) => handler.deleteReviewHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
];

export default routes;
