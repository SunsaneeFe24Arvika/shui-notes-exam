import { updateNoteSchema } from "../models/noteSchema.mjs";
import { throwError } from "../utils/throwError.mjs";

export const validateUpdateNote = () => ({
    before: (handler) => {
        if (!handler.event.body) {
            throwError('No body provided', 400);
        }

        let data = handler.event.body;
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch {
                throwError('Invalid JSON format in body', 400);
            }
        }

        const { error, value } = updateNoteSchema.validate(data, { abortEarly: false });
        
        if (error) {
            const details = error.details.map((d) => d.message).join(', ');
            throwError(`Validation error: ${details}`, 422);
        }
        
        handler.event.body = value;
    }
});