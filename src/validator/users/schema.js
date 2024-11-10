import Joi from "joi";

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export { UserPayloadSchema };
