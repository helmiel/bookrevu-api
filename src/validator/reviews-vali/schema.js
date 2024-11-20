import Joi from "joi";

const ReviewPayloadSchema = Joi.object({
  review: Joi.string().required(),
});

export { ReviewPayloadSchema };
