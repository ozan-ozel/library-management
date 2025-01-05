import Joi from 'joi';

export const returnBookSchema = Joi.object({
  score: Joi.number().integer().min(1).max(10).required().messages({
    'number.base': '"score" must be a number',
    'number.min': '"score" must be at least 1',
    'number.max': '"score" must be at most 10',
    'any.required': '"score" is a required field'
  }),
});