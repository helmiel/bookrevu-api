const routes = (handler) => [
  {
    method: "POST",
    path: "/books/{bookId}/review",
    handler: (request, h) => handler.postReviewHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
];

export default routes;
