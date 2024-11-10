import "dotenv/config";
import Hapi from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import Inert from "@hapi/inert";
import ClientError from "./exceptions/ClientError.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// users
import users from "./api/users/index.js";
import UsersService from "./services/postgres/UsersService.js";
import UsersValidator from "./validator/users/index.js";

// authentications
import authentications from "./api/authentications/index.js";
import AuthenticationsService from "./services/postgres/AuthenticationsService.js";
import AuthenticationsValidator from "./validator/authentications/index.js";
import TokenManager from "./tokenize/TokenManager.js";

// // books
import books from "./api/books/index.js";
import BooksService from "./services/postgres/BooksService.js";
import BooksValidator from "./validator/books/index.js";

// // reviews
// import reviews from "./api/reviews/index.js";
// import ReviewsService from "./services/postgres/ReviewsService.js";
// import ReviewsValidator from "./validator/reviews/index.js";

// // ratings
// import ratings from "./api/ratings/index.js";
// import RatingsService from "./services/postgres/RatingsService.js";
// import RatingsValidator from "./validator/ratings/index.js";

// uploads
import StorageService from "./services/storage/StorageService.js";

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const booksService = new BooksService();
  const storageService = new StorageService(
    path.resolve(__dirname, "api/books/file/images")
  );
  // const reviewsService = new ReviewsService();
  // const ratingsService = new RatingsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
        credentials: true,
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.state("refreshToken", {
    ttl: 24 * 60 * 60 * 1000,
    isSecure: false,
    path: "/",
    isHttpOnly: true,
    encoding: "base64json",
    clearInvalid: false,
    strictHeader: true,
  });

  server.auth.strategy("bookrevu_api_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
        email: artifacts.decoded.payload.email,
        displayname: artifacts.decoded.payload.displayname,
        role: artifacts.decoded.payload.role,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService: authenticationsService,
        usersService: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: books,
      options: {
        booksService: booksService,
        storageService: storageService,
        validator: BooksValidator,
      },
    },
    // {
    //   plugin: reviews,
    //   options: {
    //     service: reviewsService,
    //     validator: ReviewsValidator,
    //   },
    // },
    // {
    //   plugin: ratings,
    //   options: {
    //     RatingsService: ratingsService,
    //     BooksService: booksService,
    //     validator: RatingsValidator,
    //   },
    // },
  ]);

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: "fail",
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }
      const newResponse = h.response({
        status: "error",
        message: "terjadi kegagalan pada server kami",
      });
      newResponse.code(500);
      return newResponse;
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server Running at ${server.info.uri}`);
};

init();
