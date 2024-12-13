import InvariantError from "../../exceptions/InvariantError.js";
import { RatingPayloadSchema } from "./schema.js";

const RatingsValidator = {
  validateRatingPayload: (payload) => {
    const validationResult = RatingPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default RatingsValidator;
