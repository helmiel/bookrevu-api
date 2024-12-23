import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routes = (handler) => [
  {
    method: "POST",
    path: "/api/books",
    handler: (request, h) => handler.postBookHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "POST",
    path: "/api/books/{id}/covers",
    handler: (request, h) => handler.postBookCoverByIdHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 5120000,
      },
    },
  },
  {
    method: "GET",
    path: "/api/albums/images/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "/file/images"),
      },
    },
  },
  {
    method: "GET",
    path: "/api/books",
    handler: () => handler.getBooksHandler(),
  },
  {
    method: "GET",
    path: "/api/books/{id}",
    handler: (request, h) => handler.getBookByIdHandler(request, h),
  },
  {
    method: "GET",
    path: "/api/books/search",
    handler: (request, h) => handler.getBooksSearchHandler(request, h),
  },
  {
    method: "GET",
    path: "/api/books/upcoming",
    handler: () => handler.getUpcomingBooksHandler(),
  },
  {
    method: "GET",
    path: "/api/books/recomendation",
    handler: () => handler.getRecomendationBooksHandler(),
  },
  {
    method: "GET",
    path: "/api/books/home",
    handler: () => handler.getHomeBooksHandler(),
  },
];

export default routes;
