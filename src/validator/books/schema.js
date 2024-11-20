import Joi from "joi";

const BookPayloadSchema = Joi.object({
  title: Joi.string().required(),
  published: Joi.string().required(),
  author: Joi.string().required(),
  genre: Joi.string().required(),
  format: Joi.string().required(),
  isbn: Joi.number().required(),
  description: Joi.string().required(),
  // book_image_url: Joi.string().required(),
});

const BookCoverSchema = Joi.object({
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

const searchBookSchema = Joi.object({
  q:  Joi.string().required(),
})

export { BookPayloadSchema, BookCoverSchema, searchBookSchema };
