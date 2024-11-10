import InvariantError from "../../exceptions/InvariantError.js";
import { BookPayloadSchema, BookCoverSchema } from "./schema.js";

const BooksValidator = {
  validateBookPayload: (payload) => {
    const validationResult = BookPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateBookCoverHeader: (headers) => {
    const validationResult = BookCoverSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default BooksValidator;
