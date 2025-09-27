import Joi from 'joi';

export const loginSchema = Joi.object({
    username: Joi.string().alphanum().min(8).required(),
    password: Joi.string().required()
});