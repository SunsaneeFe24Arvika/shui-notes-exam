import middy from "@middy/core";
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { updateNoteById } from "../../../services/notes.mjs";
import { sendResponse } from '../../../responses/index.mjs';
import { errorHandler } from '../../../middlewares/errorHandler.mjs';
import { authenticateUser } from '../../../middlewares/authenticateUser.mjs';
import { validateUpdateNote } from '../../../middlewares/validateUpdateNote.mjs';
import { throwError } from '../../../utils/throwError.mjs';

export const handler = middy(async (event) => {
    // Get note ID from path parameters
    const { id } = event.pathParameters || {};
    
    if (!id) {
        throwError('Note ID is required', 400);
    }

    // Get authenticated user info
    const { username } = event.user;
    
    // Update the note with only the fields provided
    const result = await updateNoteById(id, event.body, username);
    
    if (!result.success) {
        if (result.message === 'Note not found') {
            throwError(`Note with ID ${id} not found`, 404);
        }
        if (result.message === 'Unauthorized') {
            throwError('You can only edit your own notes', 403);
        }
        throwError(result.message || 'Failed to update note', 500);
    }

    return sendResponse(200, {
        success: true,
        message: 'Note updated successfully',
        note: result.note
    });

}).use(httpJsonBodyParser())
  .use(authenticateUser())
  .use(validateUpdateNote())
  .use(errorHandler());