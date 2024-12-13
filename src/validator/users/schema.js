import Joi from "joi";

const UserPayloadSchema = Joi.object({
  username: Joi.string().max(50).required(),
  email: Joi.string().required(),
  password: Joi.string().required(),
});

const ProfilePictureSchema = Joi.object({
  "content-type": Joi.string()
    .valid(
      "image/apng",
      "image/avif",
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/svg+xml",
      "image/webp",
      "image/jpg"
    )
    .required(),
}).unknown();

export { UserPayloadSchema, ProfilePictureSchema };
