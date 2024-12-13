import InvariantError from "../../exceptions/InvariantError.js";
import { UserPayloadSchema, ProfilePictureSchema } from "./schema.js";

const UsersValidator = {
  validateUserPayload: (payload) => {
    const validationResult = UserPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateProfilePictureHeader: (headers) => {
    const validationResult = ProfilePictureSchema.validate(headers);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default UsersValidator;
