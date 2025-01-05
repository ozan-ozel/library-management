import Joi from 'joi';

export const createBookSchema = Joi.object({
  name: Joi.string().min(3).max(255).required().messages({
    'string.base': '"name" should be a type of string',
    'string.empty': '"name" cannot be an empty field',
    'string.min': '"name" should have a minimum length of 3 characters',
    'string.max': '"name" should have a maximum length of 255 characters',
    'any.required': '"name" is a required field',
  }),
});
