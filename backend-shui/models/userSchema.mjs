import Joi from 'joi';

export const userSchema = Joi.object({
    useername : Joi.string().alphanum().min(6).max(30).required(),
    password : Joi.string()
        .alphanum()
        .min(6)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
        .messages({
            'string.pattern.base' : 'The password must contain at least one uppercase letter, one lowercase letter, and one number.'
        })
        .required(),
    alias : Joi.string().min(6).max(30).optional(),
    email : Joi.string().email().required(),
    role : Joi.string()
        .valid('GUEST', 'ADMIN')
        .required()
});