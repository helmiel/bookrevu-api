import InvariantError from "../../exceptions/InvariantError.js";
import { ReviewPayloadSchema } from "./schema.js";

const ReviewsValidator = {
  validateReviewPayload: (payload) => {
    // console.log(payload);
    const validationResult = ReviewPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

export default ReviewsValidator;
