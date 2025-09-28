import Joi from 'joi';

export const userSchema = Joi.object({
    username : Joi.string().alphanum().min(6).required(),
    password : Joi.string()
        .alphanum()
        .min(8)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
        .messages({
            'string.pattern.base': 'The password must contain at least one uppercase letter, one lowercase letter, and one number.'
        })
        .required(),
    email : Joi.string().email().required(),
    role : Joi.string()
        .valid('GUEST', 'ADMIN')
        .required()
});