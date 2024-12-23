import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const routes = (handler) => [
  {
    method: "POST",
    path: "/api/users",
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: "PUT",
    path: "/api/users/profile",
    handler: (request, h) => handler.putDisplaynameHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "GET",
    path: "/api/users",
    handler: (request, h) => handler.getUserByIdHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "POST",
    path: "/api/users/profile",
    handler: (request, h) => handler.postProfilePictureHandler(request, h),
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
    path: "/api/images/profile/{param*}",
    handler: {
      directory: {
        path: path.join(__dirname, "/file/profile"),
      },
    },
  },
  {
    method: "GET",
    path: "/api/users/all",
    handler: (request, h) => handler.getAllUsersHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "POST",
    path: "/api/users/admin",
    handler: (request, h) => handler.postAdminHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/api/users/profile",
    handler: (request, h) => handler.deleteProfilePictureHandler(request, h),
    options: {
      auth: "bookrevu_api_jwt",
    },
  },
];

export default routes;
