import Joi from 'joi';

export const noteSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(1).max(1000).required()
    // username kommer från JWT token, så behöver inte valideras här
});