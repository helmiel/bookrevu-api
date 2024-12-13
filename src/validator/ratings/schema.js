import Joi from "joi";

const RatingPayloadSchema = Joi.object({
  rating: Joi.number().required(),
});

export { RatingPayloadSchema };
