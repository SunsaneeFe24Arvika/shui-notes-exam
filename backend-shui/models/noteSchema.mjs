import Joi from 'joi';

export const noteSchema = Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(1).required()

})