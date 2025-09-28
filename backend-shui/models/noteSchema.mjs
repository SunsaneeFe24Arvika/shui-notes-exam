import Joi from 'joi';

export const noteSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    content: Joi.string().min(1).max(1000).required()
    // username kommer från JWT token, så behöver inte valideras här
});

// Schema för PATCH-API: alla fält är optional
export const updateNoteSchema = Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    content: Joi.string().min(1).max(1000).optional()
})
// Kontrollera att minst ett fält skickas
.min(1)
.messages({
    'object.min': 'At least one field (title or content) must be provided for update'
});