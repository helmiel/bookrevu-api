import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PassThrough } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routes = (handler) => [
  {
    method: "POST",
    path: "/books",
    handler: (request, h) => handler.postBookHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "POST",
    path: "/books/{id}/covers",
    handler: (request, h) => handler.postBookCoverByIdHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 1024000,
      },
    },
  },
  {
    method: "GET",
    path: "/albums/images/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "/file/images"),
      },
    },
  },
  {
    method: "GET",
    path: "/books",
    handler: () => handler.getBooksHandler(),
  },
  {
    method: "GET",
    path: "/books/{id}",
    handler: (request, h) => handler.getBookByIdHandler(request, h),
  },
  {
    method: "GET",
    path: "/books/search",
    handler: (request, h) => handler.getBooksSearchHandler(request, h),
  },
  {
    method: "GET",
    path: "/books/upcoming",
    handler: () => handler.getUpcomingBooksHandler(),
  },
  {
    method: "GET",
    path: "/books/recomendation",
    handler: () => handler.getRecomendationBooksHandler(),
  },
  {
    method: "GET",
    path: "/books/home",
    handler: () => handler.getHomeBooksHandler(),
  },
];

export default routes;
